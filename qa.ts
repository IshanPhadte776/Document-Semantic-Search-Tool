import {OpenAI} from "langchain/llms";

import {
    RetrievalQAChain,
    ConversationalRetrievalQAChain,
} from "langchain/chains";


import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI } from "langchain/chat_models";
import * as fs from "fs";
import * as dotenv from "dotenv";


import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";

dotenv.config();

const openaiKey = process.env.OPENAI_API_KEY;

//create embedding

export const createEmbeddings = async () => {
    // We're using openaiapi lm(davinci)
    const model = new OpenAI({apiKey: openaiKey});
    const text = fs.readFileSync("GAN.pdf", "utf-8");

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 250,
    });


    const docs = await textSplitter.createDocuments([text]);

    //Create a vector store from the documents
    // We will be using FAISS
    const vectorStore = await FaissStore.fromDocuments(
        docs,
        new OpenAIEmbeddings()
    );

    //create conversation chain 
    // recall we are using openai and faiss
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriver());
    const response = await chain.call({
        query: "What is a variational autoencoder?",
    });
    console.log({response});


};

createEmbeddings()