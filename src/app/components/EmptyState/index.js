"use client";

import { MessageCircle, FileText, Link, Sparkles } from "lucide-react";
import styles from "./EmptyState.module.scss";

export const EmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Sparkles className={styles.mainIcon} />
        </div>

        <h2 className={styles.title}>Welcome to SmartChat</h2>
        <p className={styles.description}>
          Start a conversation with our AI assistant. You can chat naturally,
          upload files, or analyze web content.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <MessageCircle className={styles.icon} />
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>Natural Conversations</h3>
              <p className={styles.featureDescription}>
                Chat freely with Google Gemini LLM
              </p>
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FileText className={styles.icon} />
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>File Analysis</h3>
              <p className={styles.featureDescription}>
                Upload PDFs and Excel files for analysis
              </p>
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Link className={styles.icon} />
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>Web Content</h3>
              <p className={styles.featureDescription}>
                Analyze and query webpage content
              </p>
            </div>
          </div>
        </div>

        <div className={styles.prompt}>
          <p className={styles.promptText}>
            Type a message below to get started
          </p>
        </div>
      </div>
    </div>
  );
};
