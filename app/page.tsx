"use client";

import React, { useState, useEffect } from "react";
import translateText from "@/api_calls/openai_translations";

const sentence = "Это короткое предложение.";

export default function Home() {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchTranslations() {
      setTranslations(await translateText(sentence));
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
                {translations[word]}
              </div>
            )}
          </span>
        ))}
      </h1>
    </main>
  );
}
