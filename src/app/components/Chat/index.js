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

    let res = "";
    if (url) {
      try {
        const response = await fetch("/api/process-web", {
          method: "POST",
          body: JSON.stringify({ url, question: content }),
        });

        const result = await response.json();

        if (response.ok) {
          res = result.data;
        } else {
          setIsLoading(false);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      const formData = new FormData();
      formData.append("pdfFile", files[0]);
      formData.append("question", content);

      try {
        const response = await fetch("/api/process-pdf", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          res = result.data;
        } else {
          setIsLoading(false);
        }
      } finally {
        setIsLoading(false);
      }
    }
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
