"use client";

import { useState, useRef } from "react";
import { Send, Paperclip, X } from "lucide-react";
import styles from "./ChatInput.module.scss";

export const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() && files.length === 0 && !url.trim()) return;

    onSendMessage(message.trim(), files, url.trim());
    setMessage("");
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
    );
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.inputContainer}>
      {/* File attachments */}
      {files.length > 0 && (
        <div className={styles.attachments}>
          {files.map((file, index) => (
            <div key={index} className={styles.attachment}>
              <span className={styles.fileName}>{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className={styles.removeFile}
                type="button"
              >
                <X className={styles.removeIcon} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* URL input */}
      <div className={styles.urlSection}>
        <input
          type="url"
          placeholder="Enter webpage URL to analyze (optional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={styles.urlInput}
        />
      </div>

      {/* Main input form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={styles.messageInput}
            disabled={isLoading}
          />

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={styles.actionButton}
              disabled={isLoading}
            >
              <Paperclip className={styles.actionIcon} />
            </button>

            <button
              type="submit"
              disabled={
                isLoading ||
                (!message.trim() && files.length === 0 && !url.trim())
              }
              className={styles.sendButton}
            >
              <Send className={styles.sendIcon} />
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.xlsx,.xls"
          multiple
          onChange={handleFileSelect}
          className={styles.hiddenFileInput}
        />
      </form>
    </div>
  );
};
