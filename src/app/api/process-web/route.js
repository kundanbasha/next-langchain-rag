import { NextResponse } from "next/server";
import { PineconeEmbeddings } from "@langchain/pinecone";
import { ChatGroq } from "@langchain/groq";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export async function POST(request) {
  const data = await request.json();
  const { url, question } = data;

  if (!url || !question) {
    return NextResponse.json(
      { error: "Missing url or question" },
      { status: 400 }
    );
  }

  try {
    const llm = new ChatGroq({
      model: process.env.NEXT_PUBLIC_MODEL,
      apiKey: process.env.NEXT_PUBLIC_LLM_API_KEY,
    });
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1500,
      chunkOverlap: 50,
    });
    const loader = new CheerioWebBaseLoader(url, {});
    const docs = await loader.load();
    const splitDocs = await textSplitter.splitDocuments(docs);
    const embedder = new PineconeEmbeddings({ model: "multilingual-e5-large" });
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
    return NextResponse.json({ success: true, data: res.content });
  } catch (error) {
    console.error("Error processing URL:", error);
    return NextResponse.json(
      { error: "Error processing URL" },
      { status: 500 }
    );
  }
}
