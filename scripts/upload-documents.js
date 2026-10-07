# Solar Chatbot WordPress API

A complete end-to-end solar company chatbot project that uses OpenAI + vector database + PDF ingestion and can be embedded into a WordPress website.

## Features
- OpenAI-powered customer support chatbot
- Pinecone vector database integration for RAG (retrieval-augmented generation)
- PDF upload endpoint to index company documents in vector DB
- WordPress-friendly widget script
- Lead capture form for solar quote requests
- Demo frontend for testing the product locally

## Tech Stack
- Node.js + Express
- OpenAI API
- Pinecone vector database
- PDF parsing with `pdf-parse`
- Multer for file uploads
- WordPress embeddable JS widget

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment file
```bash
cp .env.example .env
```

Update `.env` with your API keys and company details.

### 3. Start the app
```bash
npm start
```

Open http://localhost:3000

### 4. Upload PDFs to the knowledge base
Upload a PDF in the demo UI or call the API directly:

```bash
curl -X POST http://localhost:3000/api/upload-pdf \
  -F "file=@your-file.pdf"
```

### 5. Ask questions
Use the chat UI or post to the API:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Do you offer battery storage?",
    "sessionId": "demo-session"
  }'
```

## Required configuration

### OpenAI
Get an API key at https://platform.openai.com/api-keys

Example:
```env
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4o-mini
```

### Pinecone
Create an index at https://www.pinecone.io/

Example:
```env
PINECONE_API_KEY=your-key
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX=solar-knowledge
```

## Project structure
```bash
.
├── public/
│   ├── index.html
│   ├── chat-widget.js
│   └── styles.css
├── scripts/
│   ├── clear-pinecone-index.js
│   ├── test-chat.js
│   └── upload-documents.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── server.js
├── documents/
└── uploads/
```

## PDF upload flow

1. User uploads a PDF file
2. Server parses the PDF using `pdf-parse`
3. Text is split into chunks
4. Chunks are turned into embeddings using OpenAI
5. Embeddings are sent to Pinecone index
6. Chatbot uses knowledge retrieval at runtime for better answers

## WordPress integration

Use the embeddable widget:
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

## Lead form
The chatbot includes a lead capture endpoint:

```bash
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "service": "solar_installation"
  }'
```

## Example knowledge base documents
Add PDFs like:
- pricing guide
- installation checklist
- warranty terms
- local rebates / incentives
- service policies
- maintenance handbook

These can be uploaded and automatically indexed.

## Local development notes
Use:
```bash
npm run dev
```
for automatic restarts.

## Production recommendations
- Move lead data to a database
- Add admin auth / dashboard
- Store PDF metadata in a database
- Add rate limiting and security headers
- Deploy behind HTTPS and a secured domain
- Use a proper CRM or email pipeline for leads

## License
MIT
