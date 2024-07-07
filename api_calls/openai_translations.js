"use server";

import OpenAI from "openai";

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
              text: `Translate the following sentence into Russian and return a 2D array. The first array should contain the Russian translations for each word, and the second array should contain the original English words corresponding to the same index. Sentence: "${text}"`,
            },
            {
              type: "text",
              text: `Here's an example: "This is a sentence." -> [["Это", "есть", "предложение."], ["This", "is", "a", "sentence."]]`,
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
    console.log("response.choices", response.choices);
    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
}
