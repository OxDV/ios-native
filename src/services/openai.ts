import OpenAI from "openai";
import { OPENAI_API_KEY } from "@env";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a cooking assistant. When user inputs a dish name, analyze the language of the input and respond with ingredients list in THE SAME LANGUAGE as the input. Return only a list of ingredients needed for cooking, one per line, starting with "-". Don't include any other text, just the list.

Examples:
If user asks "борщ", respond in Russian:
- свекла(100g)
- картофель(500гр)
- капуста(100гр)
- морковь(200гр)
- вода(2л)
- соль(1ч.л)
- лук(1шт)
...

If user asks "pizza", respond in English:
- flour(500g)
- yeast(7g)
- water(300ml)
- salt(1tsp)
- olive oil(2tbsp) 
- tomato sauce(200g)
- mozzarella cheese(250g)
...

Always match the language of the input query.`;

export const getIngredientsForDish = async (dishName: string): Promise<string[]> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: dishName }
      ],
      model: "gpt-3.5-turbo",
    });

    const ingredients = completion.choices[0].message.content
      ?.split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(2).trim()) || [];

    return ingredients;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}; 