//This import brings in the OpenAI class from the langchain/llms/openai module. It is used for interacting with the OpenAI API.
import { OpenAI } from "langchain/llms/openai";
//These imports bring in the RetrievalQAChain and ConversationalRetrievalQAChain classes from the langchain/chains module. They are used for building retrieval-based question answering chains.
import { RetrievalQAChain, ConversationalRetrievalQAChain } from "langchain/chains";
//This import brings in the RecursiveCharacterTextSplitter class from the langchain/text_splitter module. It is used for splitting text into smaller chunks or documents.
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
//This import brings in the ChatOpenAI class from the langchain/chat_models module. It is used for chat-based interactions with the OpenAI API.
import { ChatOpenAI } from "langchain/chat_models";
//This import brings in the entire fs module, which is a built-in Node.js module used for file system operations such as reading files.
import * as fs from "fs";
//This import brings in the entire dotenv module, which is used for loading environment variables from a .env file into process.env.
import * as dotenv from "dotenv";
//This import brings in the FaissStore class from the langchain/vectorstores/faiss module. It is used for creating and managing vector stores using the Faiss library.
import { FaissStore } from "langchain/vectorstores/faiss";
//This import brings in the OpenAIEmbeddings class from the langchain/embeddings/openai module. It is used for generating embeddings using the OpenAI language model.
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
//This import brings in the TextLoader class from the langchain/document_loaders/fs/text module. It is used for loading text documents from the file system.
import { TextLoader } from "langchain/document_loaders/fs/text";

//dotenv.config() loads environment variables from a .env file located in the same directory as the script.
dotenv.config();

const openaiKey = process.env.OPENAI_API_KEY;

// Create embeddings
export const createEmbeddings = async (): Promise<void> => {
  // We're using OpenAI API with the davinci language model
  const model = new OpenAI({ openAIApiKey: openaiKey });
  const text = fs.readFileSync("GAN.pdf", "utf-8");

  //Dividing text into smaller chunks to handle 
  //chunkSize = size of a chunk
  //chunkOverlap = overlap between chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 250,
  });

  //splits the text by the chunk size and overlap, stores the result in the docs variable 
  const docs = await textSplitter.createDocuments([text]);

  // Create a vector store from the documents
  // We will be using FAISS
  const vectorStore = await FaissStore.fromDocuments(docs, new OpenAIEmbeddings());

  // Create a conversation chain
  // We're using OpenAI and FAISS
  //OpenAI for for generating responses
  
  //Faiss for retrieveing relevant documents 
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  const response = await chain.call({
    query: "What is a variational autoencoder?",
  });
  console.log({ response });
};

createEmbeddings();
