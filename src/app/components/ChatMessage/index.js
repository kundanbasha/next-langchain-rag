"use client";

import { Bot, User } from "lucide-react";
import styles from "./ChatMessage.module.scss";

export const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`${styles.messageWrapper} ${
        isUser ? styles.userMessage : styles.aiMessage
      }`}
    >
      <div className={styles.messageContent}>
        <div className={styles.avatar}>
          <div
            className={`${styles.avatarIcon} ${
              isUser ? styles.userAvatar : styles.aiAvatar
            }`}
          >
            {isUser ? (
              <User className={styles.icon} />
            ) : (
              <Bot className={styles.icon} />
            )}
          </div>
        </div>

        <div className={styles.messageBody}>
          <div
            className={`${styles.messageBubble} ${
              isUser ? styles.userBubble : styles.aiBubble
            }`}
          >
            {message.isThinking ? (
              <div className={styles.thinkingContainer}>
                <div className={styles.thinkingDots}>
                  <div className={`${styles.dot} ${styles.dot1}`}></div>
                  <div className={`${styles.dot} ${styles.dot2}`}></div>
                  <div className={`${styles.dot} ${styles.dot3}`}></div>
                </div>
                <span className={styles.thinkingText}>
                  Thinking, please wait...
                </span>
              </div>
            ) : (
              <p className={styles.messageText}>{message.content}</p>
            )}
          </div>

          <span className={styles.timestamp}>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
