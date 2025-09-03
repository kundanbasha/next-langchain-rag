"use client";
import getLLMResponse from "../langchain/rag-web";
import { useState } from "react";

export default function ContextQuestion() {
  const [userInput, setUserInput] = useState({ question: "", webPage: "" });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await getLLMResponse(userInput.webPage, userInput.question);
    console.log(res);
  };

  return (
    <form className="flex f-column" onSubmit={handleSubmit}>
      <input
        value={userInput.webPage}
        onChange={onChangeHandler}
        placeholder="Please enter webpage"
        name="webPage"
      />
      <input
        value={userInput.question}
        onChange={onChangeHandler}
        placeholder="Please enter your question"
        name="question"
      />
      <button>Send</button>
    </form>
  );
}
