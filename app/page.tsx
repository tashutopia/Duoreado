"use client";

import React, { useState, useEffect } from "react";
import translateText from "@/api_calls/openai_translations";

const paragraph = "Это короткое предложение. Это пример предложения.";

const paragraphTranslations: Record<string, string> = {
  "Это короткое предложение.": "This is a short sentence.",
  "Это пример предложения.": "This is an example sentence.",
};
const wordTranslations: Record<string, string> = {
  Это: "This",
  короткое: "short",
  предложение: "sentence",
  пример: "example",
  предложения: "sentences",
};

type Word = {
  original: string;
  translation: string;
};

type Sentence = {
  words: Word[];
  translation: string;
};

type FormattedParagraph = Sentence[];

type HoveredWordIndices = {
  sentenceIndex: number;
  wordIndex: number;
};

export default function Home() {
  const [hoveredWordIndices, setHoveredWordIndices] =
    useState<HoveredWordIndices | null>(null);
  const [isCommandPressed, setIsCommandPressed] = useState(false);
  // const [translations, setTranslations] = useState<Record<string, string>>({});
  const [formattedParagraph, setFormattedParagraph] =
    useState<FormattedParagraph>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Meta") setIsCommandPressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Meta") setIsCommandPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    // async function fetchTranslations() {
    //   setTranslations(await translateText(sentence));
    // }
    // fetchTranslations();

    // setTranslations(translation);

    // Format the paragraph
    const formattedParagraph: FormattedParagraph = paragraph
      .split(".")
      .filter((sentenceText) => sentenceText.trim() !== "")
      .map((sentenceText) => ({
        words: sentenceText
          .trim()
          .split(" ")
          .filter((word) => word.trim() !== "")
          .map((word) => ({
            original: word,
            translation: wordTranslations[word] || word,
          })),
        translation: paragraphTranslations[sentenceText.trim() + "."],
      }))
      .filter((sentence) => sentence.words.length > 0);
    setFormattedParagraph(formattedParagraph);
    console.log("formattedParagraph", formattedParagraph);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold relative">
        {formattedParagraph.map((sentence, sentenceIndex) => (
          <span
            key={`sentence-${sentenceIndex}`}
            // TODO: fix this hover effect
            className={`border-b border-dotted relative group border-gray-800${
              isCommandPressed ? "hover:border-gray-800" : "border-gray-400"
            }`}
            onMouseEnter={() =>
              setHoveredWordIndices({ sentenceIndex, wordIndex: -1 })
            }
            onMouseLeave={() => setHoveredWordIndices(null)}
          >
            <React.Fragment key={`sentence-${sentenceIndex}`}>
              {sentence.words.map((word, wordIndex) => (
                <>
                  <span> </span>
                  <span
                    key={`${sentenceIndex}-${wordIndex}`}
                    onMouseEnter={() =>
                      setHoveredWordIndices({ sentenceIndex, wordIndex })
                    }
                    onMouseLeave={() => setHoveredWordIndices(null)}
                    className={`relative ${
                      !isCommandPressed ? "hover:underline" : ""
                    }`}
                  >
                    {word.original}
                    {hoveredWordIndices?.sentenceIndex === sentenceIndex &&
                      hoveredWordIndices?.wordIndex === wordIndex &&
                      !isCommandPressed && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-200 border border-gray-400 rounded">
                          {word.translation}
                        </div>
                      )}
                  </span>
                </>
              ))}
              <span>.</span>
              {hoveredWordIndices?.sentenceIndex === sentenceIndex &&
                isCommandPressed && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-200 border border-gray-400 rounded">
                    {sentence.translation}
                  </div>
                )}
            </React.Fragment>
          </span>
        ))}
      </h1>
    </main>
  );
}
