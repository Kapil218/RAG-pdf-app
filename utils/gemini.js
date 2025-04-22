import { Embeddings } from "@langchain/core/embeddings";

// Replace this with actual call to Vertex AI or Gemini API
async function getGeminiEmbeddings(texts) {
  // MOCK: Replace with real embedding logic using Vertex AI's textembedding-gecko
  return texts.map(() => Array(768).fill(Math.random()));
}

class GeminiEmbeddings extends Embeddings {
  async embedDocuments(texts) {
    return getGeminiEmbeddings(texts);
  }

  async embedQuery(text) {
    const [vector] = await getGeminiEmbeddings([text]);
    return vector;
  }
}

export { GeminiEmbeddings };
