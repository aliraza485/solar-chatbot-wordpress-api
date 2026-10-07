# solar-chatbot-wordpress-api
A full-stack starter for a solar company customer support chatbot that can be embedded into a WordPress website via a simple API and widget.

## Features
- REST API for chatbot conversations
- Demo front-end to test the chatbot
- WordPress-friendly widget script
- FAQ and intent handling for solar customer support
- Lead capture endpoint for quotes or service requests
- Ready for extension with OpenAI, Azure OpenAI, or other LLM services

## Project structure
- `server.js` — Express backend API
- `public/index.html` — demo site
- `public/chat-widget.js` — embeddable chatbot widget script
- `public/styles.css` — front-end styling
- `wordpress-snippet.md` — WordPress integration example
- `.env.example` — environment configuration

## Quick start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Start the app:
   ```bash
   npm start
   ```
4. Open the demo site:
   - http://localhost:3000

## API endpoints
### GET /health
Returns app health status.

### GET /api/faqs
Returns a sample list of solar support FAQs.

### POST /api/chat
Sends a customer message and gets a response from the solar chatbot.

Example request:
```json
{
  "message": "I want a quote for rooftop solar panels",
  "customerName": "John"
}
```

Example response:
```json
{
  "reply": "Absolutely! We can help you with a rooftop solar quote.",
  "intent": "quote_request",
  "suggestedActions": [
    "Get a solar quote",
    "Check installation timeline",
    "Ask about financing"
  ]
}
```

### POST /api/lead
Stores a lead inquiry for quote requests or service follow-up.

Example request:
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "service": "solar_installation"
}
```

## WordPress integration
The `public/chat-widget.js` script can be embedded in WordPress using a custom HTML block or a small plugin.

Example snippet:
```html
<div id="solar-chatbot"></div>
<script src="https://yourdomain.com/chat-widget.js"></script>
<script>
  window.SolarChat.init({
    apiUrl: 'https://yourdomain.com',
    companyName: 'SunPeak Solar',
    containerId: 'solar-chatbot'
  });
</script>
```

See `wordpress-snippet.md` for more details.

## Solar bot knowledge base
This starter includes a simple keyword-based response system for common solar industry prompts:
- quote requests
- panel installation
- battery storage
- maintenance and support
- financing
- warranties
- outages and troubleshooting
- service scheduling

## Next enhancements
- Replace rule-based responses with OpenAI/Azure OpenAI
- Store leads in a database
- Add authentication for admin dashboard
- Add multilingual support
- Add CRM integration
- Add analytics and conversation history

## License
MIT
