import OpenAI from "openai";
import { OPENAI_API_KEY } from "@env";
import { Language, Recipe } from "../types";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const COOKING_PROMPT = `You are a cooking assistant. You MUST respond ONLY in the language specified in the user's message. When user inputs a dish name and language, provide dish name, ingredients list and recipe in the specified language. Include detailed timing for each step. Format the response in JSON format as shown in the example below.

Example:
{
  "name": "Кутья",
  "ingredients": [
    "Пшеница (500гр)",
    "Мак (200гр)",
    "Изюм (100гр)",
    "Мед (по вкусу)",
    "Грецкие орехи (100гр)",
    "Вода (для варки)"
  ],
  "instructions": "Время приготовления: 4-5 часов (включая время настаивания)\n1. Тщательно промыть пшеницу несколько раз в холодной воде (3-4 минуты)\n2. Залить пшеницу водой в пропорции 1:3 и варить на медленном огне до мягкости (60-70 минут)"
}

Respond ONLY in the specified language and maintain this exact JSON format with detailed timing for each step.`;

export const getRecipeWithIngredients = async (dishName: string, language: Language): Promise<Recipe> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: COOKING_PROMPT },
        { role: "user", content: `Please respond in the language: ${language}. Also, translate the dish name: ${dishName} into ${language}, even if it was provided in another language.` }
      ],      
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });
    console.log('messages', `Language: ${language}\nDish: ${dishName} translated to ${language}`);

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    const recipeData = JSON.parse(response);
    console.log('response', response);
    
    return {
      ...recipeData,
      language
    };
  } catch (error) {
    console.error("Error getting recipe:", error);
    throw error;
  }
};