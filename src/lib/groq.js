/**
 * Groq API client for AI summaries.
 * Falls back to mock response when VITE_GROQ_API_KEY is not set.
 */

import { mockSummary } from '../utils/mockData'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
export const IS_MOCK = !GROQ_API_KEY || GROQ_API_KEY.includes('your_')

async function groqChat(messages, model = 'llama-3.3-70b-versatile') {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Groq API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

/**
 * Build a BJJ training summary from an array of recent entries
 */
export async function generateTrainingSummary(entries, period = 'last-30-days') {
  if (IS_MOCK) {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1800))
    return {
      content: mockSummary.content,
      weaknesses: mockSummary.weaknesses,
      strengths: mockSummary.strengths,
    }
  }

  const entrySummary = entries.slice(0, 20).map(e => ({
    date: e.date,
    type: e.type,
    mood: e.mood,
    energy: e.energy,
    wins: e.wins,
    losses: e.losses,
    notes: e.notes?.slice(0, 300),
    positions: e.positions,
    techniques: e.techniques,
    improvements: e.improvements,
  }))

  const systemPrompt = `You are an expert BJJ coach analyzing a student's training journal.
Provide insightful, specific, actionable analysis. Focus on patterns, weaknesses to address, and strengths to build on.
Format your response in clean markdown with clear sections.`

  const userPrompt = `Analyze these ${entries.length} training sessions from the past ${period === 'last-7-days' ? '7 days' : '30 days'}:

${JSON.stringify(entrySummary, null, 2)}

Provide:
1. Overview of training volume and consistency
2. Top 2-3 strengths showing improvement
3. Top 2-3 weaknesses/areas needing work (be specific about positions/techniques)
4. Notable patterns (mood, energy, gi vs nogi performance)
5. Specific recommendation for next 2 weeks

Also extract a JSON block at the end in this exact format:
<weaknesses>
[{"position": "position-slug", "severity": "high|medium|low", "count": N, "label": "Human Label"}]
</weaknesses>
<strengths>
[{"position": "position-slug", "count": N, "label": "Human Label"}]
</strengths>`

  const content = await groqChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ])

  // Parse structured data from response
  const weaknessMatch = content.match(/<weaknesses>([\s\S]*?)<\/weaknesses>/)
  const strengthMatch = content.match(/<strengths>([\s\S]*?)<\/strengths>/)

  let weaknesses = []
  let strengths = []

  try {
    if (weaknessMatch) weaknesses = JSON.parse(weaknessMatch[1].trim())
    if (strengthMatch) strengths = JSON.parse(strengthMatch[1].trim())
  } catch {}

  // Remove the JSON blocks from display content
  const cleanContent = content
    .replace(/<weaknesses>[\s\S]*?<\/weaknesses>/, '')
    .replace(/<strengths>[\s\S]*?<\/strengths>/, '')
    .trim()

  return { content: cleanContent, weaknesses, strengths }
}

/**
 * Generate a quick one-line insight for a single entry
 */
export async function generateEntryInsight(entry) {
  if (IS_MOCK) {
    await new Promise(r => setTimeout(r, 800))
    return `Focus on the ${entry.positions?.[0] || 'technique'} improvements noted in this session — consistency here will compound quickly.`
  }

  const prompt = `BJJ training session: ${entry.notes?.slice(0, 400)}
Positions: ${entry.positions?.join(', ')}
Mood: ${entry.mood}/5, Energy: ${entry.energy}/5

Give ONE specific, actionable insight or coaching cue for this session in 1-2 sentences. Be direct and specific.`

  return groqChat([{ role: 'user', content: prompt }])
}
