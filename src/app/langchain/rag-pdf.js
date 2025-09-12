"use client";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export default async function getPdfLLMResponse(file, question) {
  const llm = new ChatGoogleGenerativeAI({
    model: process.env.NEXT_PUBLIC_MODEL,
    apiKey: process.env.NEXT_PUBLIC_LLM_API_KEY,
  });
  const loader = new PDFLoader(file);
  debugger;
  const docs = await loader.load();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 50,
  });
  const splitDocs = await textSplitter.splitDocuments(docs);
  const embedder = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.NEXT_PUBLIC_LLM_API_KEY,
  });
  debugger;
  console.log("splitDocs", splitDocs);
  const store = await MemoryVectorStore.fromDocuments(splitDocs, embedder);
  const retriever = store.asRetriever();

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful Coding AI assistant. Use the below content to answer the question.`,
    ],
    [
      "human",
      `Context: {context},
     Question: {question}`,
    ],
  ]);

  const getContext = async (question) => {
    const res = await retriever.invoke(question);
    return {
      context: res[0].pageContent,
      question: question,
    };
  };

  const chain = RunnableSequence.from([getContext, prompt, llm]);
  const res = await chain.invoke(question);
  console.log("check answer", res);
  return res;
}
