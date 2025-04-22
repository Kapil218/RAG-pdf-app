import { Worker } from "bullmq";
import { GeminiEmbeddings } from "./gemini.js";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

console.log("Worker started");

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    console.log(job);

    const data = job.data;

    console.log(data);

    const loader = new PDFLoader(data.path);
    const docs = await loader.load();
    console.log(docs);

    const embeddings = new GeminiEmbeddings();

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "langchainjs-pdf",
      }
    );

    await vectorStore.addDocuments(docs);
    console.log("all docs added to vector store");
  },
  {
    concurrency: 100,
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
