import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GeminiEmbeddings } from "../utils/gemini.js";
import { GoogleGenAI } from "@google/genai";

const queue = new Queue("file-upload-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

const uploadPdf = async (req, res) => {
  const job = await queue.add("file-ready", {
    filename: req.file.originalname,
    destination: req.file.destination,
    path: req.file.path,
  });
  console.log("Job added:", job.id);
  console.log("uploaded");
  res.status(200).json("uploaded");
};

const embeddings = new GeminiEmbeddings();
const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: process.env.QDRANT_URL,
  collectionName: "langchainjs-pdf",
});
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const chat = async (req, res) => {
  const userQuery = req.body.query;

  // Get the context from the vector store based on the user query
  const retriever = vectorStore.asRetriever({ k: 2 });
  const result = await retriever.invoke(userQuery);

  // Define the context for the Gemini API
  const CONTEXT = JSON.stringify(result);

  // Construct the request payload for the Gemini model
  const prompt = `give the answer of the QUESTION based on the following CONTEXT give a breif explaination and the refrence also.
  CONTEXT: ${CONTEXT}
  QUESTION: ${userQuery}
  ANSWER:`;

  // Call the Gemini API to generate a response
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  const answer = response.candidates[0].content.parts[0].text;
  console.log(answer);

  // Return the generated answer from the Gemini API
  return res.status(200).json({ answer: answer });
};

export { uploadPdf, chat };
