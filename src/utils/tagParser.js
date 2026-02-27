// Keyword → position tag mapping for auto-tagging from notes

const KEYWORD_MAP = {
  // Guard types
  'guard': 'guard',
  'half guard': 'half-guard',
  'half-guard': 'half-guard',
  'closed guard': 'closed-guard',
  'open guard': 'open-guard',
  'butterfly': 'butterfly-guard',
  'spider': 'open-guard',
  'lasso': 'open-guard',
  'de la riva': 'open-guard',
  'dlr': 'open-guard',
  'x-guard': 'x-guard',
  'single leg x': 'single-leg-x',
  '411': 'single-leg-x',
  'saddle': 'single-leg-x',
  'berimbolo': 'open-guard',
  'deep half': 'half-guard',

  // Top positions
  'side control': 'side-control',
  'mount': 'mount',
  'mounted': 'mount',
  'back': 'back-control',
  'back mount': 'back-control',
  'back control': 'back-control',
  'turtle': 'turtle',
  'knee on belly': 'knee-on-belly',
  'knee-on-belly': 'knee-on-belly',
  'north south': 'north-south',
  'crucifix': 'crucifix',

  // Standing
  'takedown': 'takedowns',
  'takedowns': 'takedowns',
  'wrestling': 'wrestling',
  'double leg': 'takedowns',
  'single leg': 'takedowns',
  'double-leg': 'takedowns',
  'ankle pick': 'takedowns',
  'high crotch': 'takedowns',
  'throw': 'takedowns',
  'trip': 'takedowns',

  // Submissions - chokes
  'armbar': 'armbars',
  'triangle': 'triangles',
  'guillotine': 'guillotine',
  'arm-in': 'guillotine',
  'rear naked': 'rear-naked-choke',
  'rnc': 'rear-naked-choke',
  'bow and arrow': 'back-control',
  'bow-and-arrow': 'back-control',
  'baseball bat': 'side-control',
  'ezekiel': 'side-control',
  'darce': 'guard',
  'anaconda': 'turtle',

  // Submissions - joint locks
  'kimura': 'side-control',
  'americana': 'side-control',
  'omoplata': 'guard',
  'oma plata': 'guard',

  // Leg attacks
  'heel hook': 'heel-hooks',
  'heel-hook': 'heel-hooks',
  'kneebar': 'leg-locks',
  'knee bar': 'leg-locks',
  'ankle lock': 'leg-locks',
  'toe hold': 'leg-locks',
  'leg lock': 'leg-locks',
  'leg-lock': 'leg-locks',

  // Actions
  'sweep': 'guard',
  'pass': 'guard',
  'passing': 'guard',
  'escape': 'side-control',
  'submit': 'armbars',
  'choke': 'rear-naked-choke',
}

/**
 * Extract position tags from free-text notes
 * @param {string} text
 * @returns {string[]} - unique position tags
 */
export function extractTags(text) {
  if (!text) return []

  const lower = text.toLowerCase()
  const found = new Set()

  for (const [keyword, tag] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) {
      found.add(tag)
    }
  }

  return Array.from(found)
}

/**
 * Suggest technique labels from text
 */
export function suggestTechniques(text) {
  if (!text) return []

  const techniques = [
    'armbar', 'triangle', 'guillotine', 'rear-naked-choke', 'kimura', 'americana',
    'heel hook', 'kneebar', 'ankle lock', 'bow-and-arrow', 'darce',
    'single leg', 'double leg', 'ankle pick',
    'torreando', 'knee cut', 'smash pass',
    'scissor sweep', 'hip bump', 'flower sweep', 'omoplata sweep',
    'berimbolo', 'back take', 'arm drag',
  ]

  const lower = text.toLowerCase()
  return techniques.filter(t => lower.includes(t))
}

/**
 * Clean a tag string for display
 */
export function formatTag(tag) {
  return tag
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * Get color class for a position tag
 */
export function getTagColor(tag) {
  const colorMap = {
    'guard': 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    'half-guard': 'bg-cyan-900/40 text-cyan-300 border-cyan-700/50',
    'closed-guard': 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    'open-guard': 'bg-teal-900/40 text-teal-300 border-teal-700/50',
    'butterfly-guard': 'bg-teal-900/40 text-teal-300 border-teal-700/50',
    'side-control': 'bg-orange-900/40 text-orange-300 border-orange-700/50',
    'mount': 'bg-red-900/40 text-red-300 border-red-700/50',
    'back-control': 'bg-purple-900/40 text-purple-300 border-purple-700/50',
    'turtle': 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50',
    'knee-on-belly': 'bg-orange-900/40 text-orange-300 border-orange-700/50',
    'north-south': 'bg-orange-900/40 text-orange-300 border-orange-700/50',
    'takedowns': 'bg-green-900/40 text-green-300 border-green-700/50',
    'wrestling': 'bg-green-900/40 text-green-300 border-green-700/50',
    'armbars': 'bg-red-900/40 text-red-300 border-red-700/50',
    'triangles': 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    'rear-naked-choke': 'bg-purple-900/40 text-purple-300 border-purple-700/50',
    'guillotine': 'bg-pink-900/40 text-pink-300 border-pink-700/50',
    'leg-locks': 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50',
    'heel-hooks': 'bg-amber-900/40 text-amber-300 border-amber-700/50',
    'single-leg-x': 'bg-amber-900/40 text-amber-300 border-amber-700/50',
    'x-guard': 'bg-cyan-900/40 text-cyan-300 border-cyan-700/50',
  }

  return colorMap[tag] || 'bg-surface-600 text-[var(--text-secondary)] border-surface-500'
}
