import React, { useEffect } from 'react';
import { OpenAI } from 'langchain/llms/openai';
import { RetrievalQAChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { FaissStore } from 'langchain/vectorstores/faiss';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openaiKey = process.env.OPENAI_API_KEY;

const QAComponent = () => {
  useEffect(() => {
    const createEmbeddings = async () => {
      const model = new OpenAI({ openAIApiKey: openaiKey });
      const text = 'Content of the GAN.pdf file';

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 250,
      });

      const docs = await textSplitter.createDocuments([text]);

      const vectorStore = await FaissStore.fromDocuments(docs, new OpenAIEmbeddings());

      const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
      const response = await chain.call({
        query: 'What is a variational autoencoder?',
      });
      console.log({ response });
    };

    createEmbeddings();
  }, []);

  return null; // Return null or any other React component if needed
};

export default QAComponent;
