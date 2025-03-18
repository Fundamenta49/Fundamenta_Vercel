# Development Setup

This application can be run both on Replit and locally. Here's how to set it up:

## Running on Replit
The application is already configured for Replit and will work out of the box. Just click the "Run" button.

## Running Locally
1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your environment variables
3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
# For local development
npm run dev:local

# For Replit (default)
npm run dev
```

## Important Notes
- The application uses different configurations for local and Replit environments
- The Replit environment uses `vite.config.ts`
- Local development uses `vite.config.local.ts`
- Some features (like the Replit-specific plugins) will only work in the Replit environment
- API endpoints will automatically adjust based on the environment

## Environment Variables
Make sure to set up all required environment variables in your `.env` file when running locally. On Replit, these are managed through the Secrets panel.
