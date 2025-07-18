import dotenv from "dotenv";
import axios from "axios";

dotenv.config();


const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/chat-bison-001:generateContent";




export const geminaiFunc = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return result;
  } catch (err: any) {
    console.error("Gemini API error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.error?.message || err.message);
  }
};
