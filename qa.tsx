import { OpenAI } from "langchain/llms";
import { RetrievalQAChain, ConversationalRetrievalQAChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI } from "langchain/chat_models";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";

dotenv.config();

const openaiKey = process.env.OPENAI_API_KEY;

// Create embeddings
export const createEmbeddings = async (): Promise<void> => {
  // We're using OpenAI API with the davinci language model
  const model = new OpenAI({ apiKey: openaiKey });
  const text = fs.readFileSync("GAN.pdf", "utf-8");

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 250,
  });

  const docs = await textSplitter.createDocuments([text]);

  // Create a vector store from the documents
  // We will be using FAISS
  const vectorStore = await FaissStore.fromDocuments(docs, new OpenAIEmbeddings());

  // Create a conversation chain
  // We're using OpenAI and FAISS
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  const response = await chain.call({
    query: "What is a variational autoencoder?",
  });
  console.log({ response });
};

createEmbeddings();
