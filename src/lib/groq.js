/**
 * Groq API client for AI summaries.
 * Falls back to mock response when VITE_GROQ_API_KEY is not set.
 */

import { mockSummary } from '../utils/mockData'
import { extractTags, formatTag } from '../utils/tagParser'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
export const IS_MOCK = !GROQ_API_KEY || GROQ_API_KEY.includes('your_')

/**
 * Derive weaknesses and strengths from actual journal entries (used in mock mode)
 */
function computeMockInsights(entries) {
  const weaknessCounts = {}
  const strengthCounts = {}

  for (const entry of entries) {
    // Weaknesses: extract from improvements text (+2 weight)
    const improvementTags = extractTags(entry.improvements || '')
    for (const tag of improvementTags) {
      weaknessCounts[tag] = (weaknessCounts[tag] || 0) + 2
    }

    // Weaknesses: positions from losing sessions (+1 weight)
    if ((entry.losses || 0) > (entry.wins || 0)) {
      for (const pos of (entry.positions || [])) {
        weaknessCounts[pos] = (weaknessCounts[pos] || 0) + 1
      }
    }

    // Strengths: positions from winning sessions (+1 weight)
    if ((entry.wins || 0) > (entry.losses || 0)) {
      for (const pos of (entry.positions || [])) {
        strengthCounts[pos] = (strengthCounts[pos] || 0) + 1
      }
    }

    // Strengths: extract from highlights text (+1 weight)
    const highlightTags = extractTags(entry.highlights || '')
    for (const tag of highlightTags) {
      strengthCounts[tag] = (strengthCounts[tag] || 0) + 1
    }
  }

  // Sort and take top weaknesses
  let weaknesses = Object.entries(weaknessCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([pos, count]) => ({
      position: pos,
      count,
      severity: count >= 4 ? 'high' : count >= 2 ? 'medium' : 'low',
      label: formatTag(pos),
    }))

  // Edge case: no improvements text found — fall back to most-mentioned positions
  if (weaknesses.length === 0) {
    const allPositions = {}
    for (const entry of entries) {
      for (const pos of (entry.positions || [])) {
        allPositions[pos] = (allPositions[pos] || 0) + 1
      }
    }
    weaknesses = Object.entries(allPositions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([pos, count]) => ({
        position: pos,
        count,
        severity: count >= 4 ? 'high' : count >= 2 ? 'medium' : 'low',
        label: formatTag(pos),
      }))
  }

  const strengths = Object.entries(strengthCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([pos, count]) => ({
      position: pos,
      count,
      label: formatTag(pos),
    }))

  return { weaknesses, strengths }
}

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
    await new Promise(r => setTimeout(r, 1800))
    const { weaknesses, strengths } = computeMockInsights(entries)
    return {
      content: mockSummary.content,
      weaknesses,
      strengths,
    }
  }

  const entrySummary = entries.slice(0, 20).map(e => ({
    date: e.date,
    mood: e.mood,
    energy: e.energy,
    wins: e.wins,
    losses: e.losses,
    notes: e.notes?.slice(0, 300),
    positions: e.positions,
    techniques: e.techniques,
    improvements: e.improvements,
  }))

  const systemPrompt = `You are an expert BJJ coach analyzing YOUR student's training journal.
Speak directly to the user using "you" and "your" consistently. Do NOT use third-person phrasing like "the student".
Provide insightful, specific, actionable analysis. Focus on patterns, weaknesses to address, and strengths to build on.
Format your response in clean markdown with clear sections.`

  const userPrompt = `Analyze these ${entries.length} training sessions from the past ${period === 'last-7-days' ? '7 days' : '30 days'}:

${JSON.stringify(entrySummary, null, 2)}

Provide:
1. Overview of training volume and consistency
2. Top 2-3 strengths showing improvement
3. Top 2-3 weaknesses/areas needing work (be specific about positions/techniques)
4. Notable patterns (mood, energy, performance)
5. Specific recommendation for next 2 weeks

Also extract a JSON block at the end in this exact format:
<weaknesses>
[{"position": "position-slug", "severity": "high|medium|low", "count": N, "label": "Human Label"}]
</weaknesses>
<strengths>
[{"position": "position-slug", "count": N, "label": "Human Label"}]
</strengths>

Base weaknesses strictly on patterns in the 'improvements' and high-loss entries' 'positions' fields. Base strengths on entries with high 'wins' counts and positive 'highlights'. Do not invent positions not mentioned in the data.`

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
  } catch { }

  // Remove the XML blocks and any LLM markdown artifacts from display content
  const cleanContent = content
    .replace(/<weaknesses>[\s\S]*?<\/weaknesses>/, '')
    .replace(/<strengths>[\s\S]*?<\/strengths>/, '')
    .replace(/###\s*Extracted.*$/gim, '')
    .replace(/```[\w]*\n[\s\S]*?```/g, '')
    .replace(/```[\w]*/g, '')
    .replace(/\n{3,}/g, '\n\n')
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

Give ONE specific, actionable insight or coaching cue for this session in 1-2 sentences. Be direct, specific, and address the user directly as "you" (do not use third-person).`

  return groqChat([{ role: 'user', content: prompt }])
}
