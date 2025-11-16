# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.6] - 2025-11-16

### Fixed
- Replaced the previous QRCode library with a lightweight shim to eliminate the `Unexpected token '}'` error and restore QR generation using an external QR image service.

## [1.0.5] - 2025-11-16

### Changed
- Bumped manifest version to 1.0.5 to reflect the addition of the in-panel "Show QR Codes" button and recent compatibility fixes.

## [1.0.4] - 2025-11-16

### Added
- "Show QR Codes" button directly in the TTRPG QR Code Invites module settings panel, opening the QR dialog from the same screen where you configure WiFi options.

## [1.0.2] - 2025-11-16

### Fixed
- Resolved an error in the `renderModuleManagement` hook when Foundry passes a plain HTML element instead of a jQuery object, restoring the QR Codes button in the module list.

## [1.0.0] - 2024-11-16

### Added
- Initial release of TTRPG QR Code Invites module
- Dual QR code system for WiFi and game URL
- WiFi credential configuration through FoundryVTT settings
- QR Code button in Module Management screen
- Mobile-friendly responsive design
- Secure credential storage using FoundryVTT settings
- Client-side QR code generation (no external dependencies)
- Local network only operation for security
- Comprehensive documentation and setup instructions

### Features
- **WiFi QR Code**: Automatic network connection using WPA/WPA2, WEP, or Open Network formats
- **Game URL QR Code**: Direct FoundryVTT server URL for instant game joining
- **Settings Integration**: Full integration with FoundryVTT's module settings system
- **Responsive Design**: Optimized for mobile device QR scanning
- **Error Handling**: Graceful handling of missing WiFi credentials
- **Browser Compatibility**: Works with all modern browsers and QR scanning apps

### Supported
- FoundryVTT version 13.0 and higher
- All game systems and modules
- Mobile devices with camera/QR scanning capability
- Local network environments (offline operation)

### Documentation
- Complete README with installation and setup instructions
- Troubleshooting guide for common issues
- Security and compatibility information
- Contribution guidelines for future development
