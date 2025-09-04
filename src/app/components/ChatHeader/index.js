"use client";

import { Bot } from "lucide-react";
import styles from "./ChatHeader.module.scss";

export const ChatHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <div className={styles.iconWrapper}>
            <Bot className={styles.icon} />
          </div>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>SmartChat</h1>
            <p className={styles.subtitle}>AI-Powered Assistant</p>
          </div>
        </div>

        <div className={styles.status}>
          <div className={styles.statusDot}></div>
          <span className={styles.statusText}>Online</span>
        </div>
      </div>
    </header>
  );
};
