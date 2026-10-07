require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.Index(process.env.PINECONE_INDEX || 'solar-knowledge');

async function clearIndex() {
  const stats = await index.describeIndexStats();
  const totalVectors = stats.totalVectorCount || 0;

  if (totalVectors === 0) {
    console.log('Index is already empty.');
    return;
  }

  console.log(`Deleting ${totalVectors} vectors from index...`);
  await index.deleteAll();
  console.log('✅ Pinecone index cleared.');
}

clearIndex().catch((error) => {
  console.error('Failed to clear index:', error.message);
  process.exit(1);
});
