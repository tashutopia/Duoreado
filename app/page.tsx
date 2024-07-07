"use client";

import React, { useState, useEffect } from "react";
import translateText from "@/api_calls/openai_translations";

const sentence = "This is a sentence.";

export default function Home() {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [translations, setTranslations] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTranslations() {
      await translateText(sentence).then((result) => {
        setTranslations(
          (result ?? "").replace("[", "").replace("]", "").split(",")
        );
      });
    }
    fetchTranslations();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold relative">
        {sentence.split(" ").map((word, index) => (
          <span
            key={index}
            onMouseEnter={() => setHoveredWord(word)}
            onMouseLeave={() => setHoveredWord(null)}
            className="hover:underline relative"
          >
            {word}{" "}
            {hoveredWord === word && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-200 border border-gray-400 rounded">
                {translations[index]}
              </div>
            )}
          </span>
        ))}
      </h1>
    </main>
  );
}
