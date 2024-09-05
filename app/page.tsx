"use client";

import React, { useState, useEffect } from "react";
import translateText from "@/api_calls/openai_translations";

const paragraph = "Это короткое предложение. Это пример предложения.";
const translation: Record<string, string> = {
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
  // todo: add translation
};

type FormattedParagraph = Sentence[];

type HoveredWordIndices = {
  sentenceIndex: number;
  wordIndex: number;
};

export default function Home() {
  const [hoveredWordIndices, setHoveredWordIndices] =
    useState<HoveredWordIndices | null>(null);
  // const [translations, setTranslations] = useState<Record<string, string>>({});
  const [formattedParagraph, setFormattedParagraph] =
    useState<FormattedParagraph>([]);

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
            translation: translation[word] || word,
          })),
      }))
      .filter((sentence) => sentence.words.length > 0);
    setFormattedParagraph(formattedParagraph);
    console.log("formattedParagraph", formattedParagraph);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold relative">
        {formattedParagraph.map((sentence, sentenceIndex) => (
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
                  className="hover:underline relative"
                >
                  {word.original}
                  {hoveredWordIndices?.sentenceIndex === sentenceIndex &&
                    hoveredWordIndices?.wordIndex === wordIndex && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-200 border border-gray-400 rounded">
                        {word.translation}
                      </div>
                    )}
                </span>
              </>
            ))}
            <span>.</span>
          </React.Fragment>
        ))}
      </h1>
    </main>
  );
}
