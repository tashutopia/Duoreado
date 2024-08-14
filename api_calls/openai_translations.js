"use server";

import OpenAI from "openai";

const sample_text = "Это пример предложения.";

const sample_json = {
  Это: "this",
  пример: "example",
  предложения: "sentence",
};

console.log(
  `PROMPT: Here's an example: ${sample_text} -> ${JSON.stringify(sample_json)}`
);

export default async function translateText(text) {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              // text: `Translate the following sentence into Russian and return a 2D array. The first array should contain the Russian translations for each word, and the second array should contain the original English words corresponding to the same index. Sentence: "${text}"`,
              text: `Given the following sentence: "${text}" translate every word to English and return a json object, nothing more, nothing less.`,
            },
            {
              type: "text",
              text: `Here's an example: ${sample_text} -> ${JSON.stringify(
                sample_json
              )}`,
            },
          ],
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const translations_json = JSON.parse(response.choices[0].message.content);
    console.log("translations_json", translations_json);
    return translations_json;
  } catch (error) {
    console.error(error);
  }
}
