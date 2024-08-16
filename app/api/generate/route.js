export async function POST(req) {
  try {
    const { message } = await req.json();
    console.log("Received message:", message);

    const prompt = `
    You are a flashcard creator, you take in the user's message's texts and create multiple flashcards from it. Make sure to create exactly 5 flashcards.
    Both question and answer should be one sentence long.
    You should return in the following JSON format:
    {
      "flashcards":[
        {
          "question": "Front of the card",
          "answer": "Back of the card"
        }
      ]
    } Do not write any other texts, just return the JSON. \n\nUser: ${message}`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();
    // console.log("OpenRouter response:", data);

    const generatedContent = data.choices[0].message.content;
    console.log(generatedContent);

    // Parse the content as JSON
    let flashcards;
    try {
      flashcards = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error("Failed to parse flashcards:", parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse flashcards" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (flashcards.flashcards && Array.isArray(flashcards.flashcards)) {
      return new Response(
        JSON.stringify({ flashcards: flashcards.flashcards }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Unexpected response format from OpenRouter" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return new Response(
      JSON.stringify({ error: "Error communicating with OpenRouter" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
