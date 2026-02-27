/**
 * Google Gemini API — fallback AI when Groq is unavailable.
 * Falls back to mock response when VITE_GEMINI_API_KEY is not set.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
export const IS_MOCK = !GEMINI_API_KEY || GEMINI_API_KEY.includes('your_')

export async function generateWithGemini(prompt) {
  if (IS_MOCK) {
    await new Promise(r => setTimeout(r, 1200))
    return 'AI analysis unavailable — add your API key in .env.local to enable real insights.'
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}
