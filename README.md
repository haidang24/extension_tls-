# Certificate Transparency Browser Extension on Prism

![Project Logo](icons/prism-logo.png)

**Certificate Transparency Browser Extension on Prism** is a browser extension for Chrome and Firefox that enhances web browsing security by verifying SSL/TLS certificates using Certificate Transparency (CT) and Prism technology on the Celestia blockchain. It helps users detect potential Man-in-the-Middle (MitM) attacks and ensures website certificates are valid and trustworthy.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Tech Stack](#tech-stack)
- [Business Model](#business-model)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- **Certificate Verification**: Automatically checks SSL/TLS certificates for the current website using Prism and Certificate Transparency logs.
- **MitM Detection**: Alerts users to potential Man-in-the-Middle attacks via certificate validation.
- **User-Friendly Interface**: Provides an intuitive popup displaying verification results.
- **Blockchain Integration**: Leverages Prism on Celestia for enhanced security and transparency.
- **Cross-Platform Support**: Compatible with Chrome and Firefox (Firefox version in development).

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/certificate-transparency-prism.git
Install on Chrome:
Open chrome://extensions/.
Enable "Developer mode."
Click "Load unpacked" and select the project folder.
Verify Installation:
The extension icon will appear in the Chrome toolbar. Click it to check the popup.
Note: Firefox installation instructions will be updated when the Firefox version is ready.

Usage
Click the extension icon in the browser toolbar to open the popup.
Press the "Verify Certificate" button to check the current website’s certificate.
View the results, including status, certificate fingerprint, validity period, and Prism data.
Configuration
API Base URL: Defaults to http://localhost:4000. Modify in background.js if needed.
Prism Node: Configure in prism-config.js with node details from Celestia.
Tech Stack
Rust: Core language for secure, high-performance logic.
Prism: Base layer on the Celestia blockchain for certificate verification.
Chrome/Firefox APIs: Integrates the extension with browsers.
WebAssembly (WASM): Embeds Rust logic into the web extension.
Business Model
This project pioneers advanced security services for web browser users. You can:

Charge Directly: Sell the extension via one-time purchases or subscriptions.
Premium Features: Offer enhanced features (e.g., real-time notifications) for a fee.
