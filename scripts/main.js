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
  }

  static ready() {
    console.log(`${TTRPGQRCodeInvites.MODULE_ID} | QR Code Invites Module Ready`);
  }

  static registerSettings() {
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
    // Get the current server URL
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

    // Use localhost:30000 as default for local testing
    if (hostname === 'localhost' && !port) {
      return 'http://localhost:30000';
    }

    // Construct the full URL
    const url = port ? `${protocol}//${hostname}:${port}` : `${protocol}//${hostname}`;
    return url;
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