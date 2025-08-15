# CINC Phone AI Starter

Minimal Node.js server for integrating with the CINC API.

Endpoints:
- /oauth/start - Redirect to CINC login
- /oauth/exchange - Exchange code for token (Zapier method)
- /lead-lookup - Find lead by phone/email
- /lead-recommendations - Suggest listings for a lead

## Usage
1. Copy `.env.example` to `.env` and set your credentials.
2. `npm install`
3. `npm run dev`
