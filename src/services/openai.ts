import OpenAI from "openai";
import { OPENAI_API_KEY } from "@env";
import { Language } from "../types";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const COOKING_PROMPT = `You are a cooking assistant. When user inputs a dish name, analyze the language of the input and respond with dish name, ingredients list and recipe in the specified language. Include detailed timing for each step. Format the response exactly as shown in the examples below.

Examples:
If language is Russian:
Название: Кутья

Ингредиенты:
- Пшеница (500гр)
- Мак (200гр)
- Изюм (100гр)
- Мед (по вкусу)
- Грецкие орехи (100гр)
- Вода (для варки)

Рецепт:
Время приготовления: 4-5 часов (включая время настаивания)
1. Тщательно промыть пшеницу несколько раз в холодной воде (3-4 минуты)
2. Залить пшеницу водой в пропорции 1:3 и варить на медленном огне до мягкости (60-70 минут)

If language is English:
Name: Kutia

Ingredients:
- Wheat berries (500g)
- Poppy seeds (200g)
- Raisins (100g)
- Honey (to taste)
- Walnuts (100g)
- Water (for cooking)

Recipe:
Total cooking time: 4-5 hours (including resting time)
1. Thoroughly rinse wheat berries several times in cold water (3-4 minutes)
2. Cover wheat with water in 1:3 ratio and cook on low heat until soft (60-70 minutes)

Always start with the dish name, then ingredients and recipe. Respond in the specified language and maintain this exact format with detailed timing for each step.`;

export const getRecipeWithIngredients = async (dishName: string, language: Language): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: COOKING_PROMPT },
        { role: "system", content: `Respond in ${language} language.` },
        { role: "user", content: dishName }
      ],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};