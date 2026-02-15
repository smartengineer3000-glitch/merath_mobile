# Merath Islamic Inheritance Calculator

## Overview

Merath is a professional-grade Islamic inheritance calculator built with React Native and Expo. It accurately calculates heir distributions according to Islamic jurisprudence (Fiqh) across multiple Islamic schools (Madhabs) using advanced mathematical precision with fraction arithmetic.

## Features

### Core Calculation Engine

- **Multi-Madhab Support**: Hanafi, Maliki, Shafii, Hanbali
- **Precision Arithmetic**: Fraction-based calculations for exact inheritance shares
- **Hijab System**: Complete implementation of Islamic exclusion rules
- **Asset Distribution**: Calculate exact monetary amounts for each heir
- **Input Validation**: Comprehensive validation of estate and heir data

### User Interface

- **Modern Design**: Material Design 3 with professional styling
- **Responsive Layout**: Works across all screen sizes
- **Dark Mode Support**: Full light/dark theme support
- **Accessibility**: WCAG 2.1 compliant components
- **Intuitive Flow**: Step-by-step calculation wizard

### Data Management

- **History Tracking**: Save and review past calculations
- **Export Options**: JSON, CSV, and PDF export formats
- **Audit Logging**: Complete audit trail of all calculations
- **Data Persistence**: Secure local storage

### Testing & Quality

- **Comprehensive Test Suite**: 150+ test cases
- **Unit Tests**: Core calculation engine fully tested
- **Integration Tests**: Component and hook testing
- **Manual QA**: Professional QA checklist

## Installation

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Mobile device or emulator (iOS/Android)

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/merath_mobile.git
cd merath_mobile

# Install dependencies
npm install

# Install iOS pods (macOS only)
cd ios && pod install && cd ..

# Start development server
npm run dev
```

### Development Modes

```bash
# Development mode
npm run dev

# Production build
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type checking
npm run check
```

## Architecture

### Project Structure

```text
merath_mobile/
├── components/              # UI components
│   ├── ui/                 # Design system components
│   ├── CalculationButton.tsx
│   ├── EstateInput.tsx
│   ├── HeirSelector.tsx
│   └── ResultsDisplay.tsx
├── screens/                # Screen components
│   └── CalculatorScreen.tsx
├── lib/                    # Core libraries
│   ├── inheritance/        # Calculation engine
│   │   ├── calculation-engine.ts
│   │   ├── fraction.ts
│   │   ├── hijab-system.ts
│   │   ├── hooks.ts
│   │   └── types.ts
│   └── design/             # Design system
│       └── theme.ts
├── hooks/                  # Custom React hooks
├── __tests__/              # Test suites
├── app.config.ts           # App configuration
├── eas.json                # EAS build config
└── package.json            # Dependencies
```

### Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Hooks
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint
- **Build**: Expo / EAS Build

## Core Concepts

### Madhabs (Islamic Schools)

Merath supports four main Islamic jurisprudence schools:

- **Hanafi**: Mercy-based approach, most practical
- **Maliki**: Customary practices integrated
- **Shafii**: Middle-ground approach
- **Hanbali**: Strict adherence to principles

### Hijab (Exclusion Rules)

Complete implementation of Islamic exclusion rules:

- **Hijab by proximity** (حجاب بالقرب)
- **Hijab by degree** (حجاب بالدرجة)
- **Hijab by existence** (حجاب بالوجود)
- **Partial hijab** (حجاب النقصان)

### Shares and Distribution

- **Obligatory shares**: Fixed portions for certain heirs
- **Residuary shares**: Remaining estate distribution
- **Fraction precision**: Accurate fractional inheritance
- **Monetary calculation**: Direct conversion to currency

## Deployment & Distribution

### iOS App Store

1. Create Apple Developer Account
2. Register App ID
3. Create App Store Connect record
4. Configure signing certificates
5. Build and upload with EAS

### Android Play Store

1. Create Google Play Developer account
2. Register app bundle ID
3. Generate signing keys
4. Configure Play Store listing
5. Build and upload AAB with EAS

## Roadmap

### Phase 6 (In Progress)

- [ ] Advanced UI/UX improvements
- [ ] Enhanced dark mode
- [ ] Performance optimization

### Phase 7 (Planned)

- [ ] Multi-language support
- [ ] RTL language support
- [ ] International prayer times

### Phase 8 (Future)

- [ ] AI-assisted heir discovery
- [ ] Family tree builder
- [ ] Integration with legal services

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### Version 1.0.0

- Initial release
- Core calculation engine
- Multi-madhab support
- Basic UI
- Test suite

## Contact

- **Website**: <https://merath.app>
- **GitHub**: <https://github.com/merath/mobile>
- **Email**: <hello@merath.app>

---

**Last Updated**: 2024
**Maintained By**: Merath Team
