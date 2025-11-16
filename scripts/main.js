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

    // Add a button to the main scene controls (left toolbar)
    Hooks.on('getSceneControlButtons', (controls) => {
      TTRPGQRCodeInvites.addSceneControlButton(controls);
    });

    // Add button to module settings
    Hooks.on('renderModuleManagement', (app, html, data) => {
      TTRPGQRCodeInvites.addModuleButton(app, html, data);
    });

    // Add sidebar button for easy access
    Hooks.on('renderSidebarTab', (app, html, data) => {
      TTRPGQRCodeInvites.addSidebarButton(app, html, data);
    });

    // Add settings UI
    Hooks.on('renderSettings', (app, html, data) => {
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
    // Find our module in the list
    const moduleElement = html.find(`.package[data-package-id="${TTRPGQRCodeInvites.MODULE_ID}"]`);
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

  static addSceneControlButton(controls) {
    // Try to attach to the token controls; fall back to the first control set
    const target = controls.find(c => c.name === 'token') || controls[0];
    if (!target) return;

    target.tools.push({
      name: 'qr-codes',
      title: 'Game Join QR Codes',
      icon: 'fas fa-qrcode',
      button: true,
      onClick: () => TTRPGQRCodeInvites.showQRDialog()
    });
  }

  static addSidebarButton(app, html, data) {
    // Only add button to the Scenes tab (or you could add to any tab)
    if (data.tab !== 'scenes') return;

    // Find the sidebar controls container
    const controls = html.find('.sidebar-tabs .item.active').parent().find('.scene-controls');

    if (controls.length === 0) {
      // If scene-controls doesn't exist, try alternative approach
      const sidebarControls = html.find('.sidebar-popout');
      if (sidebarControls.length > 0) {
        TTRPGQRCodeInvites.createSidebarQRButton(sidebarControls);
      }
      return;
    }

    // Create QR button
    const qrButton = $(`
      <li class="scene-control" data-tool="qr-codes" data-tooltip="Show QR Codes">
        <div class="control-icon">
          <i class="fas fa-qrcode"></i>
        </div>
      </li>
    `);

    controls.append(qrButton);

    // Add click handler
    qrButton.on('click', (event) => {
      event.preventDefault();
      TTRPGQRCodeInvites.showQRDialog();
    });
  }

  static createSidebarQRButton(container) {
    // Alternative sidebar button creation
    const qrButton = $(`
      <button class="qr-sidebar-button" title="Show QR Codes">
        <i class="fas fa-qrcode"></i> QR Codes
      </button>
    `);

    container.append(qrButton);

    qrButton.on('click', (event) => {
      event.preventDefault();
      TTRPGQRCodeInvites.showQRDialog();
    });
  }

  static renderSettings(app, html, data) {
    // Find our module settings section
    const moduleSettings = html.find(`.settings-list .setting[data-setting-id="${TTRPGQRCodeInvites.MODULE_ID}"]`);

    if (moduleSettings.length === 0) return;

    // Get current settings values
    const wifiSSID = game.settings.get(TTRPGQRCodeInvites.MODULE_ID, 'wifiSSID');
    const wifiPassword = game.settings.get(TTRPGQRCodeInvites.MODULE_ID, 'wifiPassword');
    const wifiSecurity = game.settings.get(TTRPGQRCodeInvites.MODULE_ID, 'wifiSecurity');

    // Create custom settings HTML
    const customSettings = $(`
      <div class="qr-invites-settings">
        <h3><i class="fas fa-wifi"></i> WiFi QR Code Configuration</h3>
        <p class="settings-hint">Configure your WiFi network settings to generate QR codes for easy player connection.</p>

        <div class="form-group">
          <label for="qr-wifi-ssid">WiFi Network Name (SSID)</label>
          <input type="text" id="qr-wifi-ssid" name="wifiSSID" value="${wifiSSID}" placeholder="Enter your WiFi network name">
          <p class="notes">The name of the WiFi network that players should connect to</p>
        </div>

        <div class="form-group">
          <label for="qr-wifi-password">WiFi Password</label>
          <input type="password" id="qr-wifi-password" name="wifiPassword" value="${wifiPassword}" placeholder="Enter your WiFi password">
          <p class="notes">The password for your WiFi network. Leave blank for open networks.</p>
        </div>

        <div class="form-group">
          <label for="qr-wifi-security">Security Type</label>
          <select id="qr-wifi-security" name="wifiSecurity">
            <option value="WPA" ${wifiSecurity === 'WPA' ? 'selected' : ''}>WPA/WPA2 (Recommended)</option>
            <option value="WEP" ${wifiSecurity === 'WEP' ? 'selected' : ''}>WEP (Older)</option>
            <option value="nopass" ${wifiSecurity === 'nopass' ? 'selected' : ''}>Open Network (No Password)</option>
          </select>
          <p class="notes">The security type of your WiFi network</p>
        </div>

        <div class="form-group">
          <button type="button" id="qr-settings-save" class="qr-settings-save-btn">
            <i class="fas fa-save"></i> Save WiFi Settings
          </button>
        </div>
      </div>
    `);

    // Replace the default module setting with our custom settings
    moduleSettings.find('.setting-content').empty().append(customSettings);

    // Add save handler
    html.find('#qr-settings-save').on('click', async (event) => {
      event.preventDefault();
      await TTRPGQRCodeInvites.saveSettings(html);
    });

    // Add change handlers to auto-save
    html.find('#qr-wifi-ssid, #qr-wifi-password, #qr-wifi-security').on('change', async () => {
      await TTRPGQRCodeInvites.saveSettings(html);
    });
  }

  static async saveSettings(html) {
    const ssid = html.find('#qr-wifi-ssid').val();
    const password = html.find('#qr-wifi-password').val();
    const security = html.find('#qr-wifi-security').val();

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
    const wifiSSID = game.settings.get(TTRPGQRCodeInvites.MODULE_ID, 'wifiSSID');
    const wifiPassword = game.settings.get(TTRPGQRCodeInvites.MODULE_ID, 'wifiPassword');
    const wifiSecurity = game.settings.get(TTRPGQRCodeInvites.MODULE_ID, 'wifiSecurity');

    if (!wifiSSID) {
      const container = html.find('#wifi-qr-container');
      container.html('<div class="qr-error">WiFi network not configured. Please set up WiFi credentials in module settings.</div>');
      return;
    }

    const wifiString = `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};;`;
    const container = html.find('#wifi-qr-container')[0];

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
    const serverURL = TTRPGQRCodeInvites.getServerURL();
    const container = html.find('#game-qr-container')[0];

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
