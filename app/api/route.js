'use server'
import OpenAI from "openai";

const openai = new OpenAI({
  //fix by using actual open AI key
  apiKey:process.env.OPEN_AI_API_KEY
});

export async function POST(req) {
  try {
    const { pantryItems } = await req.json();

    if (!pantryItems || pantryItems.length === 0) {
      return new Response(JSON.stringify({ error: "No pantry items provided" }), { status: 400 });
    }

    const prompt = `I have the following ingredients in my pantry: ${pantryItems.join(", ")}.
      
    Please suggest 3 simple, protein-rich recipes if I am trying to lose weight and have a goal of 1,800 calories a day: one breakfast, one lunch, and one dinner.
    If any recipe requires additional ingredients, suggest purchasable ingredients and after the ingredient name include an asterik symbol, if that ingredient is not 
    found in the pantry. If carrots are included in a lunch recipe, have it ONLY be included in salad recipes and not included in recipe that includes 
    ground beef. Do not suggest making any salads with cheese. Only the dinner recipe can include ground beef. Give an estimation of the amount of calories the recipes may have. Do not include snacks in any of the recipes. 
    Also, if you give an option with cheese, make sure it is only included in the lunch or dinner recipe. 

    Return the response as a JSON object in this exact format:

{
  "breakfast": {
    "name": "<recipe name>",
    "calories": <Calories>,
    "preparation time": <preparation time>,
    "cooking time": <cooking time>,
    "ingredients": ["ingredient1", "ingredient2", ...]

  },
  "lunch": {
    "name": "<recipe name>",
    "calories": <Calories>,
    "preparation time": <preparation time>,
    "cooking time": <cooking time>,
    "ingredients": ["ingredient1", "ingredient2", ...]
  },
  "dinner": {
    "name": "<recipe name>",
    "calories": <Calories>,
    "preparation time": <preparation time>,
    "cooking time": <cooking time>,
    "ingredients": ["ingredient1", "ingredient2", ...]
  }
}

Do not include any other text outside the JSON object.`
      ;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = response.choices[0].message.content;

    return new Response(JSON.stringify({ text }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "AI generation failed" }), { status: 500 });
  }
}
