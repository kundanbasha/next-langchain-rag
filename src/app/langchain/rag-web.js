import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

export default async function getLLMResponse(webPage, question) {
  const loader = new CheerioWebBaseLoader(webPage, {});

  const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.NEXT_PUBLIC_LLM_API_KEY,
    model: process.env.NEXT_PUBLIC_MODEL,
  });

  const documents = await loader.load();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const embedder = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.NEXT_PUBLIC_LLM_API_KEY,
  });
  const webSplits = await textSplitter.splitDocuments(documents);
  const store = await MemoryVectorStore.fromDocuments(webSplits, embedder);
  const retriver = store.asRetriever();
  const instructionPrompt = `
  you are an assistant, your role is to answer questions.
  use the following retrieved context to answer the question.
  {context}
`;

  const ragPrompt = ChatPromptTemplate.fromMessages([
    ["system", instructionPrompt],
    ["user", "{input}"],
  ]);

  const questionAnswerChain = await createStuffDocumentsChain({
    llm: llm,
    prompt: ragPrompt,
  });

  const retrievalChain = await createRetrievalChain({
    retriever: retriver,
    combineDocsChain: questionAnswerChain,
  });

  const res = await retrievalChain.invoke({
    input: question,
  });

  return res.answer;
}
