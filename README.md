# Kanvas

A modern whiteboard canvas application built with Next.js. Kanvas is a simple and intuitive drawing tool for sketching, brainstorming, and creative work.

## Features

🎨 **Drawing Tools** - Complete suite of drawing and sketching tools for creating digital content

↩️ **Undo/Redo** - Full undo and redo support with keyboard shortcuts for smooth workflow

🎯 **Intuitive Interface** - Clean, user-friendly UI with a retro-grid background aesthetic

📱 **Responsive Design** - Works seamlessly on desktop and tablet devices

🔄 **State Management** - Persistent whiteboard state with smooth synchronization

## Tech Stack

- **Next.js** - React framework for production
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code quality and consistency

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd get-roasted/client
```

2. **Install dependencies**
```bash
npm install
```

## Getting Started

### Development Mode

1. **Start the development server**:
```bash
npm run dev
```

2. **Open your browser** and navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
kanvas/
├── src/
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   │   ├── Hero.tsx
│   │   ├── WhiteBoard.tsx
│   │   ├── ui/            # UI components
│   │   └── whiteboard/    # Whiteboard-specific components
│   ├── helpers/           # Utility functions
│   ├── lib/               # Libraries and utilities
│   ├── stores/            # State management
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
└── next.config.ts         # Next.js configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run lint` - Run ESLint

## Key Components

### WhiteBoard Component
The main drawing canvas component that handles all drawing operations.

### NavBar Component
Navigation bar with drawing tools and options.

### UndoButton & RedoButton
Components for managing drawing history with undo/redo functionality.

## Contributing

We welcome contributions! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please create an issue in the repository.

---

**Kanvas** - Collaborate, Create, Connect
