# Victory Bible Church Website

A modern React website for Victory Bible Church built with Vite, TailwindCSS, and React Query.

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (optional):
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `VITE_API_URL`: The API base URL (defaults to `http://localhost:3000` if not set)

## Production Build

1. Create a production build:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM
- **Animations**: Framer Motion, Custom CSS animations
- **UI Components**: Headless UI, Lucide React icons
- **Forms**: React Hook Form (where applicable)
- **Build Tool**: Vite with HMR and ESLint
