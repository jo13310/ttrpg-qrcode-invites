/**
 * TTRPG QR Code Invites Module
 * Generates QR codes for WiFi and game URL to help players join in-person games
 */

class TTRPGQRCodeInvites {
  static MODULE_ID = 'ttrpg-qrcode-invites';

  static init() {
    console.log(`${TTRPGQRCodeInvites.MODULE_ID} | Initializing QR Code Invites Module`);

    // Register module settings
    TTRPGQRCodeInvites.registerSettings();

    // Add button to module settings
    Hooks.on('renderModuleManagement', (app, html, data) => {
      TTRPGQRCodeInvites.addModuleButton(app, html, data);
    });

    // Enhance settings UI
    Hooks.on('renderSettingsConfig', (app, html, data) => {
      TTRPGQRCodeInvites.renderSettings(app, html, data);
    });
  }

  static ready() {
    console.log(`${TTRPGQRCodeInvites.MODULE_ID} | QR Code Invites Module Ready`);
  }

  static registerSettings() {
    // Register WiFi SSID setting (hidden from default config, we'll create custom UI)
    game.settings.register(TTRPGQRCodeInvites.MODULE_ID, 'wifiSSID', {
      name: 'WiFi Network Name (SSID)',
      hint: 'The name of the WiFi network players should connect to',
      scope: 'world',
      config: true,
      type: String,
      default: ''
    });

    game.settings.register(TTRPGQRCodeInvites.MODULE_ID, 'wifiPassword', {
      name: 'WiFi Password',
      hint: 'The password for the WiFi network',
      scope: 'world',
      config: true,
      type: String,
      default: ''
    });

    game.settings.register(TTRPGQRCodeInvites.MODULE_ID, 'wifiSecurity', {
      name: 'WiFi Security Type',
      hint: 'The security type of your WiFi network',
      scope: 'world',
      config: true,
      type: String,
      choices: {
        'WPA': 'WPA/WPA2',
        'WEP': 'WEP',
        'nopass': 'Open Network'
      },
      default: 'WPA'
    });

    // Optional override for the game server URL used in QR codes
    game.settings.register(TTRPGQRCodeInvites.MODULE_ID, 'serverURL', {
      name: 'Game Server URL',
      hint: 'Full URL (including port) that players should use to join your FoundryVTT game. Leave blank to auto-detect from the browser URL.',
      scope: 'world',
      config: true,
      type: String,
      default: ''
    });
  }

  static addModuleButton(app, html, data) {
    const $html = $(html);

    // Find our module in the list
    const moduleElement = $html.find(`.package[data-package-id="${TTRPGQRCodeInvites.MODULE_ID}"]`);
    if (moduleElement.length === 0) return;

    // Add QR Code button to module controls
    const controlsDiv = moduleElement.find('.package-controls');
    const qrButton = $(`
      <button class="qr-invites-button" title="Show QR Codes">
        <i class="fas fa-qrcode"></i> QR Codes
      </button>
    `);

    controlsDiv.append(qrButton);

    // Add click handler
    qrButton.on('click', (event) => {
      event.preventDefault();
      TTRPGQRCodeInvites.showQRDialog();
    });
  }

  static renderSettings(app, html, data) {
    const $html = $(html);

    // Only run on the Module Settings tab
    const settingsList = $html.find('.settings-list');
    if (settingsList.length === 0) return;

    // Look for one of our own settings (wifiSSID)
    const wifiRow = settingsList.find(
      `.setting[data-setting-id="${TTRPGQRCodeInvites.MODULE_ID}.wifiSSID"]`
    );
    if (wifiRow.length === 0) return;

    // Avoid adding the button multiple times
    if (settingsList.find('.qr-invites-show-row').length > 0) return;

    const qrRow = $(`
      <div class="setting qr-invites-show-row">
        <label>QR Codes</label>
        <div class="form-fields">
          <button type="button" class="qr-show-codes-btn">
            <i class="fas fa-qrcode"></i> Show QR Codes
          </button>
        </div>
        <p class="notes">
          Click "Show QR Codes" to open a popup with WiFi and Game URL QR codes for your players.
          Make sure to save any WiFi changes first using the main "Save Changes" button below.
        </p>
      </div>
    `);

    wifiRow.after(qrRow);

    settingsList.find('.qr-show-codes-btn').on('click', (event) => {
      event.preventDefault();
      TTRPGQRCodeInvites.showQRDialog();
    });
  }

  static async saveSettings(html) {
    const $html = $(html);

    const ssid = $html.find('#qr-wifi-ssid').val();
    const password = $html.find('#qr-wifi-password').val();
    const security = $html.find('#qr-wifi-security').val();

    try {
      // Save all settings
      await game.settings.set(TTRPGQRCodeInvites.MODULE_ID, 'wifiSSID', ssid);
      await game.settings.set(TTRPGQRCodeInvites.MODULE_ID, 'wifiPassword', password);
      await game.settings.set(TTRPGQRCodeInvites.MODULE_ID, 'wifiSecurity', security);

      // Show success notification
      ui.notifications.info('WiFi QR Code settings saved successfully!');

      console.log(`${TTRPGQRCodeInvites.MODULE_ID} | Settings saved:`, { ssid, security: security + '***' });
    } catch (error) {
      console.error(`${TTRPGQRCodeInvites.MODULE_ID} | Error saving settings:`, error);
      ui.notifications.error('Failed to save WiFi settings. Please try again.');
    }
  }

  static showQRDialog() {
    const dialog = new Dialog({
      title: 'Game Join QR Codes',
      content: TTRPGQRCodeInvites.generateDialogContent(),
      buttons: {
        close: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Close',
          callback: () => {}
        }
      },
      default: 'close',
      render: (html) => {
        TTRPGQRCodeInvites.generateQRCodes(html);
      },
      close: () => {
        // Clean up QR codes
        const qrContainers = document.querySelectorAll('.qr-code-container');
        qrContainers.forEach(container => {
          container.innerHTML = '';
        });
      }
    }, {
      width: 600,
      height: 'auto',
      resizable: false
    });

    dialog.render(true);
  }

  static generateDialogContent() {
    const serverURL = TTRPGQRCodeInvites.getServerURL();
    const wifiSSID = game.settings.get(TTRPGQRCodeInvites.MODULE_ID, 'wifiSSID');
    const wifiPassword = game.settings.get(TTRPGQRCodeInvites.MODULE_ID, 'wifiPassword');
    const wifiSecurity = game.settings.get(TTRPGQRCodeInvites.MODULE_ID, 'wifiSecurity');

    return `
      <div class="qr-invites-container">
        <div class="qr-instructions">
          <h3>Share these QR codes with your players</h3>
          <p>Players can scan the WiFi QR code to connect to your network, then scan the Game URL QR code to join your FoundryVTT session.</p>
        </div>

        <div class="qr-codes-grid">
          <!-- WiFi QR Code -->
          <div class="qr-code-section">
            <h4><i class="fas fa-wifi"></i> WiFi Connection</h4>
            <div class="qr-code-container" id="wifi-qr-container"></div>
            <div class="qr-details">
              <p><strong>Network:</strong> ${wifiSSID || 'Not configured'}</p>
              <p><strong>Security:</strong> ${wifiSecurity}</p>
              <p class="qr-hint">Scan this QR code to automatically connect to the WiFi network</p>
            </div>
          </div>

          <!-- Game URL QR Code -->
          <div class="qr-code-section">
            <h4><i class="fas fa-gamepad"></i> Game URL</h4>
            <div class="qr-code-container" id="game-qr-container"></div>
            <div class="qr-details">
              <p><strong>URL:</strong> <code>${serverURL}</code></p>
              <p class="qr-hint">Scan this QR code after connecting to WiFi to join the game</p>
            </div>
          </div>
        </div>

        <div class="qr-footer">
          <p><small><i class="fas fa-info-circle"></i> Make sure your FoundryVTT server is accessible on your local network. Players must be on the same WiFi network as the Game Master.</small></p>
        </div>
      </div>
    `;
  }

  static generateQRCodes(html) {
    // Generate WiFi QR Code
    TTRPGQRCodeInvites.generateWiFiQR(html);

    // Generate Game URL QR Code
    TTRPGQRCodeInvites.generateGameQR(html);
  }

  static generateWiFiQR(html) {
    const $html = $(html);

    const wifiSSID = game.settings.get(TTRPGQRCodeInvites.MODULE_ID, 'wifiSSID');
    const wifiPassword = game.settings.get(TTRPGQRCodeInvites.MODULE_ID, 'wifiPassword');
    const wifiSecurity = game.settings.get(TTRPGQRCodeInvites.MODULE_ID, 'wifiSecurity');

    if (!wifiSSID) {
      const container = $html.find('#wifi-qr-container');
      container.html('<div class="qr-error">WiFi network not configured. Please set up WiFi credentials in module settings.</div>');
      return;
    }

    const wifiString = `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};;`;
    const container = $html.find('#wifi-qr-container')[0];

    if (container) {
      new QRCode(container, {
        text: wifiString,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }

  static generateGameQR(html) {
    const $html = $(html);

    const serverURL = TTRPGQRCodeInvites.getServerURL();
    const container = $html.find('#game-qr-container')[0];

    if (container) {
      new QRCode(container, {
        text: serverURL,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }

  static getServerURL() {
    // First, respect any custom server URL the GM configured
    const customURL = (game.settings.get(TTRPGQRCodeInvites.MODULE_ID, 'serverURL') || '').trim();
    if (customURL) return customURL;

    // Fallback: use the current browser URL (same as the invite link in many setups)
    const protocol = window.location.protocol || 'http:';
    const hostname = window.location.hostname || 'localhost';
    const port = window.location.port;

    // Use localhost:30000 as default for local testing when no port is set
    if (hostname === 'localhost' && !port) {
      return 'http://localhost:30000';
    }

    // Construct the full URL
    return port ? `${protocol}//${hostname}:${port}` : `${protocol}//${hostname}`;
  }

  static getLocalIP() {
    // This is a simple method to get local IP
    // In a real implementation, you might want to use WebRTC or server-side detection
    return new Promise((resolve) => {
      const rtc = new RTCPeerConnection({iceServers: []});
      rtc.createDataChannel('', {reliable: false});
      rtc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          const match = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
          if (match) {
            resolve(match[1]);
            rtc.close();
          }
        }
      };
      rtc.createOffer()
        .then(offer => rtc.setLocalDescription(offer))
        .catch(e => console.error('Error getting local IP:', e));
    });
  }
}

// Initialize the module
Hooks.on('init', () => {
  TTRPGQRCodeInvites.init();
});

Hooks.on('ready', () => {
  TTRPGQRCodeInvites.ready();
});

// Add to global scope for debugging
window.TTRPGQRCodeInvites = TTRPGQRCodeInvites;
