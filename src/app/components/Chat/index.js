"use client";

import { useState } from "react";
import { ChatHeader } from "../ChatHeader";
import { ChatInput } from "../ChatInput";
import { ChatMessage } from "../ChatMessage";
import { EmptyState } from "../EmptyState";
import styles from "./Chat.module.scss";
import getLLMResponse from "@/app/langchain/rag-web";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content, files, url) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    // Add thinking message
    const thinkingMessage = {
      id: (Date.now() + 1).toString(),
      content: "",
      sender: "ai",
      timestamp: new Date(),
      isThinking: true,
    };

    setMessages((prev) => [...prev, thinkingMessage]);

    const res = await getLLMResponse(url, content);
    const aiResponse = {
      id: (Date.now() + 2).toString(),
      content: res,
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => prev.filter((m) => !m.isThinking).concat(aiResponse));
    setIsLoading(false);
  };

  return (
    <div className={styles.chatContainer}>
      <ChatHeader />

      <main className={styles.chatMain}>
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
      </main>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
