# Fundamenta: AI-Powered Life Skills Platform

Fundamenta is an advanced AI-powered personal development platform that transforms learning into an immersive, gamified experience focusing on holistic wellness and intelligent skill acquisition.

## Strategic Vision

Fundamenta aims to overcome the limitations of previous life skills platforms by:

1. **Creating Engaging Experiences** - Moving beyond passive content to active, adaptive learning
2. **Solving Real Emotional Problems** - Addressing urgent needs in the moment they arise
3. **Building Mobile-First Experiences** - Designed for the devices and attention spans of our target audience
4. **Listening to Users** - Rapid iteration based on constant feedback
5. **Focusing on Our Audience** - Targeted support for 16-30 year olds navigating critical life transitions

Our comprehensive strategic approach is documented in:
- [Fundamenta Success Blueprint](docs/FUNDAMENTA_SUCCESS_BLUEPRINT.md)
- [Consolidated Strategy 2025](docs/CONSOLIDATED_STRATEGY_2025.md)

## Core Technologies

- React with TypeScript for dynamic, responsive frontend
- Framer Motion for smooth, interactive animations
- Express.js backend with modular, scalable architecture
- AI-driven conversational interface with OpenAI GPT-4o integration
- Tailwind CSS for responsive, modern design
- Advanced content advisory and age verification systems
- Comprehensive user engagement tracking and interactive learning modules

## Development Setup

This application can be run both on Replit and locally. Here's how to set it up:

### Running on Replit
The application is already configured for Replit and will work out of the box. Just click the "Run" button.

### Running Locally
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

### Important Notes
- The application uses different configurations for local and Replit environments
- The Replit environment uses `vite.config.ts`
- Local development uses `vite.config.local.ts`
- Some features (like the Replit-specific plugins) will only work in the Replit environment
- API endpoints will automatically adjust based on the environment

### Environment Variables
Make sure to set up all required environment variables in your `.env` file when running locally. On Replit, these are managed through the Secrets panel.
