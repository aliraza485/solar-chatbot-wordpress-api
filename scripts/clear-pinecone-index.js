require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const OpenAI = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');
const { v4: uuidv4 } = require('uuid');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.Index(process.env.PINECONE_INDEX || 'solar-knowledge');

function chunkText(text, chunkSize = 1200) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    const slice = text.slice(i, i + chunkSize).trim();
    if (slice) chunks.push(slice);
  }
  return chunks;
}

async function uploadSinglePdf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const parsed = await pdf(buffer);
  const rawText = (parsed.text || '').replace(/\s+/g, ' ').trim();

  if (!rawText) {
    throw new Error(`No readable text found in ${filePath}`);
  }

  const chunks = chunkText(rawText);
  const vectors = [];

  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunk
    });

    vectors.push({
      id: uuidv4(),
      values: embedding.data[0].embedding,
      metadata: {
        source: path.basename(filePath),
        content: chunk,
        chunkIndex: i,
        type: 'pdf'
      }
    });
  }

  await index.upsert(vectors);
  console.log(`✓ Uploaded ${path.basename(filePath)} (${chunks.length} chunks)`);
}

async function main() {
  const docsDir = path.join(__dirname, '..', 'documents');

  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
    console.log('Created documents folder. Add your PDFs there and rerun the script.');
    return;
  }

  const files = fs.readdirSync(docsDir)
    .filter(file => file.toLowerCase().endsWith('.pdf'));

  if (!files.length) {
    console.log('No PDF files found in /documents. Add PDF files and rerun.');
    return;
  }

  for (const file of files) {
    const filePath = path.join(docsDir, file);
    await uploadSinglePdf(filePath);
  }

  console.log('\n✅ All PDFs uploaded to the knowledge base.');
}

main().catch((error) => {
  console.error('Upload failed:', error.message);
  process.exit(1);
});
