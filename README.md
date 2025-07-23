# CoWordle - Multiplayer Wordle Game

A real-time multiplayer Wordle game built with React, TypeScript, WebSocket, shadcn/ui, and Tailwind CSS.

## Features

- **Solo Mode**: Play Wordle by yourself against random words
- **Multiplayer Mode**: Compete with friends in real-time
- **Session Links**: Generate shareable links to invite friends
- **Real-time Updates**: See your opponent's progress in real-time
- **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, Socket.io
- **UI**: shadcn/ui, Tailwind CSS, Radix UI
- **Real-time**: WebSocket with Socket.io
- **Styling**: Tailwind CSS with custom animations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd cowordle
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development servers**

   ```bash
   npm run dev
   ```

   This will start both the frontend (port 3000) and backend (port 3001) servers concurrently.

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend health check: http://localhost:3001/health

## How to Play

### Solo Mode

1. Enter your name
2. Click "Start a new game"
3. Guess the 5-letter word within 6 attempts
4. Letters turn green (correct position), yellow (wrong position), or gray (not in word)

### Multiplayer Mode

1. Enter your name
2. Choose one of these options:

   - **Create a game**: Click "Invite a friend" to generate a shareable link
   - **Join a game**: Click "Join a friend's game" and enter the session ID

3. Share the generated link with your friend
4. Both players compete to solve the same word
5. First player to solve the word wins the match

### Game Rules

- Words must be 5 letters long
- You have 6 attempts to guess the word
- Color coding:
  - 🟩 Green: Letter is correct and in the right position
  - 🟨 Yellow: Letter is in the word but in the wrong position
  - ⬜ Gray: Letter is not in the word

## Project Structure

```
cowordle/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── GameBoard.tsx # Game grid component
│   │   ├── GameHeader.tsx# Header with navigation
│   │   ├── GameScreen.tsx# Main game screen
│   │   ├── HomeScreen.tsx# Landing page
│   │   └── Keyboard.tsx  # Virtual keyboard
│   ├── lib/
│   │   └── utils.ts      # Utility functions
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles
├── server/
│   └── index.ts          # WebSocket server
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the frontend development server
- `npm run server` - Start only the backend server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build

## Configuration

### Environment Variables

You can create a `.env` file to customize settings:

```env
VITE_SERVER_URL=http://localhost:3001
PORT=3001
```

### Customization

- **Word List**: Modify the `WORD_LIST` array in `server/index.ts` and `src/components/GameScreen.tsx`
- **Styling**: Customize colors and themes in `tailwind.config.js` and `src/index.css`
- **Game Rules**: Adjust `maxGuesses` and other game parameters in the game components

## Session Management

- Sessions automatically expire after 24 hours
- Empty sessions are cleaned up when all players disconnect
- Session IDs are generated using random strings for security
- Links can be shared via URL parameters: `?session=<session-id>`

## Deployment

### Frontend (Vite)

```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend (Node.js)

```bash
# Build and start the server
npm run server
```

Make sure to update the WebSocket URL in production:

- Update `VITE_SERVER_URL` in your environment variables
- Update CORS settings in `server/index.ts`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Inspired by the original Wordle game by Josh Wardle
- Built with shadcn/ui components
- Uses Tailwind CSS for styling
- Real-time functionality powered by Socket.io
