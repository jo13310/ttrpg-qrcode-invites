# TTRPG QR Code Invites

[![FoundryVTT Version](https://img.shields.io/badge/FoundryVTT-13%2B-blue.svg)](https://foundryvtt.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/jo13310/ttrpg-qrcode-invites.svg)](https://github.com/jo13310/ttrpg-qrcode-invites/issues)
[![GitHub stars](https://img.shields.io/github/stars/jo13310/ttrpg-qrcode-invites.svg)](https://github.com/jo13310/ttrpg-qrcode-invites)

A FoundryVTT module that generates QR codes for easy in-person game joining. Perfect for conventions, game stores, or home games where you want to quickly get players connected to your FoundryVTT session.

![QR Code Preview](https://via.placeholder.com/600x300/1a1a1a/ff6400?text=WiFi+QR+Code+|+Game+URL+QR+Code)

## ✨ Features

- **📱 Two-QR System**: Separate QR codes for WiFi connection and game URL for maximum compatibility
- **⚙️ Settings Integration**: Configure WiFi credentials through FoundryVTT's settings menu
- **🎯 One-Click Access**: QR Codes button directly in the Module Management screen
- **📲 Mobile Friendly**: Responsive design optimized for phone camera scanning
- **🔒 Secure**: WiFi passwords stored securely in FoundryVTT's settings system
- **🌐 Local Network**: Works completely offline - no external servers required

## 🚀 Installation

### Option 1: FoundryVTT Module Library (Recommended)

1. Open FoundryVTT
2. Go to **Game Settings** → **Add-on Modules**
3. Click **Install Module**
4. Search for "TTRPG QR Code Invites"
5. Click **Install** and restart FoundryVTT

### Option 2: GitHub Installation

1. Open FoundryVTT
2. Go to **Game Settings** → **Add-on Modules**
3. Click **Install Module**
4. Enter this URL: `https://raw.githubusercontent.com/jo13310/ttrpg-qrcode-invites/main/module.json`
5. Click **Install** and restart FoundryVTT

> **Note**: GitHub installations require the raw `manifest.json` URL, not the repository URL. FoundryVTT will automatically download all required files from the repository.

### Option 3: Manual Installation

1. [Download the latest release](https://github.com/jo13310/ttrpg-qrcode-invites/releases)
2. Extract the ZIP file
3. Move the extracted folder to your FoundryVTT `Data/modules/` directory
4. Restart FoundryVTT
5. Enable the module in **Game Settings** → **Manage Modules**

## ⚙️ Setup

### 1. Configure WiFi Settings

1. Go to **Game Settings** → **Module Settings** → **TTRPG QR Code Invites**
2. Configure your WiFi network:
   - **WiFi Network Name (SSID)**: Your network name (e.g., "HomeNetwork")
   - **WiFi Password**: Your network password
   - **WiFi Security Type**: WPA/WPA2, WEP, or Open Network

### 2. Test Your Server

Make sure your FoundryVTT server is accessible on your local network:
- Players should be able to reach your server via its local IP address
- Check that your firewall allows FoundryVTT connections (default port: 30000)

## 📖 How to Use

### For Game Masters

1. In FoundryVTT, go to **Game Settings** → **Module Management**
2. Find "TTRPG QR Code Invites" in the module list
3. Click the **"QR Codes"** button next to the module
4. A dialog will appear with two QR codes for players to scan

### For Players

1. Open your phone's camera app or QR code scanner
2. Scan the **WiFi QR Code** first to connect to the network
3. Once connected, scan the **Game URL QR Code** to join the FoundryVTT session
4. Your browser will open with the game connection prompt

![Usage Flow](https://via.placeholder.com/500x300/1a1a1a/ccc?text=Step+1:+Scan+WiFi+QR+→+Step+2:+Scan+Game+QR+→+Step+3:+Join+Game)

## 🔧 Configuration Options

### Module Settings

- **WiFi Network Name (SSID)**: Your WiFi network name
- **WiFi Password**: Your WiFi network password
- **WiFi Security Type**:
  - `WPA/WPA2` (most common)
  - `WEP` (older networks)
  - `Open Network` (no password)

### QR Code Features

- **Error Correction**: Medium level for good balance of reliability vs. data density
- **Size**: 200x200 pixels for optimal scanning
- **Format**: Standard QR code format compatible with all major scanning apps

## 🐛 Troubleshooting

### QR Codes Not Working

- **Issue**: QR codes don't scan or contain incorrect data
- **Solution**: Verify WiFi credentials are entered correctly in module settings

### Players Can't Connect

- **Issue**: Players can't connect after scanning QR codes
- **Solution**:
  - Ensure FoundryVTT server is running and accessible on local network
  - Check firewall settings (allow port 30000 or your configured port)
  - Verify all devices are on the same network subnet

### WiFi QR Code Issues

- **Issue**: WiFi QR code doesn't work on some devices
- **Solution**:
  - Check that security type matches your network (WPA/WPA2, WEP, or Open)
  - Some older devices may not support WiFi QR codes - provide manual connection details
  - Ensure special characters in password are properly escaped

### Network Detection

- **Issue**: Wrong server URL in QR code
- **Solution**:
  - The module detects your server URL automatically
  - If incorrect, restart FoundryVTT and regenerate QR codes
  - Ensure FoundryVTT is configured for network access in settings

## 🔒 Security Notes

- **Local Storage**: WiFi passwords are stored securely in FoundryVTT's settings system
- **Client-Side Generation**: QR codes are generated in your browser, not sent to external servers
- **Network Only**: Module only works on local networks - no internet connectivity required
- **No Data Collection**: The module does not collect or transmit any personal data

## 🌍 Requirements

- **FoundryVTT**: Version 13.0 or higher
- **Network**: Players must be on the same local network as the Game Master
- **Device**: Mobile phone or tablet with camera and QR code scanning capability
- **Browser**: Modern web browser for QR code scanning apps

## 📱 Device Compatibility

- **iOS**: Camera app (iOS 11+), or third-party QR scanner apps
- **Android**: Camera app (Android 8+), or third-party QR scanner apps
- **Third-party Apps**: Most QR scanner apps support WiFi and URL QR codes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Discord**: [.gerko](https://discord.com/users/gerko)
- **GitHub Issues**: [Submit an issue](https://github.com/jo13310/ttrpg-qrcode-invites/issues)
- **FoundryVTT Forums**: Post in the module development section

## 🗺️ Roadmap

- [ ] QR code customization options (colors, logos)
- [ ] Support for multiple WiFi networks
- [ ] Automatic network detection
- [ ] QR code analytics (scan tracking)
- [ ] Integration with Discord invites
- [ ] Support for external network connections

## ⭐ Credits

- **QR Code Library**: [qrcode.js](https://github.com/davidshimjs/qrcodejs) by David Shim
- **FoundryVTT**: [Foundry Virtual Tabletop](https://foundryvtt.com)
- **Icons**: [Font Awesome](https://fontawesome.com)

---

<div align="center">
  <strong>Made with ❤️ for the TTRPG community</strong>
</div>