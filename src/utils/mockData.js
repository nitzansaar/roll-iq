import { subDays, subWeeks, format } from 'date-fns'

const today = new Date()

export const mockUser = {
  id: 'demo-user-001',
  email: 'demo@rolliq.app',
  name: 'Alex Silva',
  avatar: null,
  belt: 'blue',
  stripes: 2,
  gym: 'Gracie Academy',
  instructor: 'Marcus Almeida',
  joinedAt: '2023-09-15',
  preferences: {
    defaultType: 'gi',
    showGiNoGi: true,
  }
}

export const POSITIONS = [
  'guard', 'half-guard', 'closed-guard', 'open-guard', 'butterfly-guard',
  'side-control', 'mount', 'back-control', 'turtle', 'knee-on-belly',
  'north-south', 'crucifix', 'single-leg-x', 'x-guard',
  'takedowns', 'wrestling', 'trips', 'throws',
  'armbars', 'triangles', 'rear-naked-choke', 'guillotine', 'kimura', 'americana',
  'leg-locks', 'heel-hooks', 'kneebars',
]

export const TECHNIQUES = [
  'armbar', 'triangle', 'guillotine', 'rear-naked-choke', 'kimura', 'americana',
  'heel-hook', 'knee-bar', 'ankle-lock', 'bow-and-arrow', 'baseball-bat-choke',
  'ezekiel', 'darce', 'anaconda', 'north-south-choke',
  'scissor-sweep', 'flower-sweep', 'hip-bump-sweep', 'oma-plata-sweep',
  'berimbolo', 'de-la-riva', 'kiss-of-dragon', 'x-guard-sweep',
  'single-leg', 'double-leg', 'ankle-pick', 'blast-double',
]

export const mockEntries = [
  {
    id: 'entry-001',
    userId: 'demo-user-001',
    date: format(subDays(today, 0), 'yyyy-MM-dd'),
    type: 'gi',
    duration: 90,
    mood: 4,
    energy: 3,
    title: 'Evening open mat — working half-guard passes',
    notes: 'Drilled the torreando pass from half-guard extensively. Managed to land it twice in sparring but still struggling when they recover their underhook. Coach suggested focusing on the knee cut instead when underhook battle is lost. Had great rolls with Mike and Jordan — Mike is getting really slippery with his escapes from side control.',
    techniques: ['torreando-pass', 'knee-cut', 'half-guard', 'side-control'],
    positions: ['half-guard', 'side-control'],
    wins: 3,
    losses: 2,
    tags: ['drilling', 'passing', 'half-guard'],
    highlights: 'Landed torreando twice in live rolling',
    improvements: 'Need to work on underhook recovery in half guard',
    instructorFeedback: 'Focus on knee cut when losing underhook battle',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'entry-002',
    userId: 'demo-user-001',
    date: format(subDays(today, 2), 'yyyy-MM-dd'),
    type: 'nogi',
    duration: 75,
    mood: 5,
    energy: 5,
    title: 'No-gi class — heel hook mechanics',
    notes: 'Best session in weeks. Finally getting the outside heel hook from 411 position — the hip alignment clicked today. Tapped 3 people who had never tapped to leg locks before. Marcus showed us the transition from saddle to the opposite inside heel hook when they roll. Mind blown. Need to rep this 1000 times.',
    techniques: ['heel-hook', 'outside-heel-hook', 'inside-heel-hook', '411', 'saddle', 'leg-entanglement'],
    positions: ['single-leg-x', 'leg-locks', 'heel-hooks'],
    wins: 5,
    losses: 1,
    tags: ['leg-locks', 'heel-hooks', 'breakthrough'],
    highlights: 'Hip alignment for outside heel hook finally clicked',
    improvements: 'Transition from saddle needs more reps',
    instructorFeedback: 'Strong progress on leg attacks — be careful in drilling',
    createdAt: subDays(today, 2).toISOString(),
  },
  {
    id: 'entry-003',
    userId: 'demo-user-001',
    date: format(subDays(today, 4), 'yyyy-MM-dd'),
    type: 'gi',
    duration: 60,
    mood: 2,
    energy: 2,
    title: 'Tough morning class — getting passed repeatedly',
    notes: 'Off day. Got my guard passed by everyone. Tried to play de la riva but kept getting de la riva guard passed with the kick-through. Felt slow and reactive. Maybe sleep deprivation is catching up. Did manage to hit one triangle from guard but it was sloppy — had to squeeze really hard. Need to revisit DLR fundamentals.',
    techniques: ['de-la-riva', 'dlr-pass', 'kick-through', 'triangle'],
    positions: ['open-guard', 'guard', 'triangles'],
    wins: 1,
    losses: 4,
    tags: ['struggling', 'de-la-riva', 'guard-retention'],
    highlights: 'One triangle finish',
    improvements: 'DLR guard retention — getting passed too easily',
    instructorFeedback: null,
    createdAt: subDays(today, 4).toISOString(),
  },
  {
    id: 'entry-004',
    userId: 'demo-user-001',
    date: format(subDays(today, 6), 'yyyy-MM-dd'),
    type: 'gi',
    duration: 105,
    mood: 4,
    energy: 4,
    title: 'Saturday morning — takedown clinic',
    notes: 'Marcus ran a special takedown session. Worked on the high crotch to double leg. The key detail I never knew: you have to look up, not down, when you shoot. Game changer for my posture on shot. Also drilled the ankle pick off a jab setup — surprisingly effective. Finished with 45 min sparring. Felt strong on the feet today.',
    techniques: ['double-leg', 'high-crotch', 'ankle-pick', 'takedown'],
    positions: ['takedowns', 'wrestling'],
    wins: 4,
    losses: 2,
    tags: ['takedowns', 'wrestling', 'fundamentals', 'seminar'],
    highlights: 'Look-up posture cue for double leg shot — huge',
    improvements: 'Need to chain takedown attempts better',
    instructorFeedback: 'Good posture on shots, need to finish stronger',
    createdAt: subDays(today, 6).toISOString(),
  },
  {
    id: 'entry-005',
    userId: 'demo-user-001',
    date: format(subDays(today, 8), 'yyyy-MM-dd'),
    type: 'gi',
    duration: 90,
    mood: 3,
    energy: 3,
    title: 'Back mount and RNC finishes',
    notes: 'Focused class on back control. Learning the body triangle vs hooks debate — Marcus says body triangle on bigger opponents, hooks on flexible ones. Drilled the bow-and-arrow from back mount as an alternative to RNC. Much tighter with the collar grip. Sparring was decent — managed to take the back twice but only finished once with RNC.',
    techniques: ['back-control', 'rear-naked-choke', 'bow-and-arrow', 'body-triangle', 'hooks'],
    positions: ['back-control', 'rear-naked-choke'],
    wins: 3,
    losses: 3,
    tags: ['back-control', 'finishing', 'chokes'],
    highlights: 'Bow-and-arrow feels much tighter than RNC',
    improvements: 'Back mount — losing position too often',
    instructorFeedback: 'Good back takes but finish rate needs work',
    createdAt: subDays(today, 8).toISOString(),
  },
  {
    id: 'entry-006',
    userId: 'demo-user-001',
    date: format(subDays(today, 10), 'yyyy-MM-dd'),
    type: 'nogi',
    duration: 60,
    mood: 4,
    energy: 5,
    title: 'No-gi fundamentals — escapes from bad positions',
    notes: 'Focused on escaping side control and mount. The elbow-knee escape to guard from mount is feeling more natural. Key: create a frame FIRST before bridging. Also worked on the sit-up guard from deep half as an alternative when bridge-and-roll fails. Had a great drill partner today who challenged my escapes properly.',
    techniques: ['mount-escape', 'elbow-knee-escape', 'bridge-roll', 'sit-up-guard', 'deep-half'],
    positions: ['mount', 'side-control', 'half-guard'],
    wins: 2,
    losses: 2,
    tags: ['escapes', 'defense', 'fundamentals'],
    highlights: 'Sit-up guard from deep half opening up new options',
    improvements: 'Still too slow to frame before bridging from mount',
    instructorFeedback: null,
    createdAt: subDays(today, 10).toISOString(),
  },
  {
    id: 'entry-007',
    userId: 'demo-user-001',
    date: format(subDays(today, 13), 'yyyy-MM-dd'),
    type: 'gi',
    duration: 120,
    mood: 5,
    energy: 4,
    title: 'Competition prep — longest session yet',
    notes: 'Two hour competition prep session. Marcus paired me with three different training partners to simulate competition rounds. Went 6-1 overall — only lost to the purple belt who outweighs me by 30lbs. First time I hit my triangle → armbar combo in live rolling! The transition was clean. Also working on not letting my guard get stacked.',
    techniques: ['triangle', 'armbar', 'guard-retention', 'stacking-defense'],
    positions: ['guard', 'triangles', 'armbars'],
    wins: 6,
    losses: 1,
    tags: ['competition-prep', 'combos', 'breakthrough'],
    highlights: 'Triangle to armbar combo landed in live rolling!',
    improvements: 'Guard getting stacked — need to angle out earlier',
    instructorFeedback: 'Very promising — focus on staying calm under pressure',
    createdAt: subDays(today, 13).toISOString(),
  },
  {
    id: 'entry-008',
    userId: 'demo-user-001',
    date: format(subDays(today, 15), 'yyyy-MM-dd'),
    type: 'gi',
    duration: 75,
    mood: 3,
    energy: 4,
    title: 'Spider guard clinic',
    notes: 'Dedicated spider guard session. The lasso guard variation is really interesting — much harder to pass than standard spider. Learning the omoplata from lasso when they try to posture out. Also drilled the balloon sweep from spider. Need to keep sleeves closer to my body for better control.',
    techniques: ['spider-guard', 'lasso-guard', 'omoplata', 'balloon-sweep', 'sweep'],
    positions: ['open-guard', 'guard'],
    wins: 2,
    losses: 3,
    tags: ['spider-guard', 'lasso', 'sweeps'],
    highlights: 'Lasso guard feels very tight',
    improvements: 'Sleeve control in spider guard needs work',
    instructorFeedback: null,
    createdAt: subDays(today, 15).toISOString(),
  },
  {
    id: 'entry-009',
    userId: 'demo-user-001',
    date: format(subDays(today, 18), 'yyyy-MM-dd'),
    type: 'gi',
    duration: 90,
    mood: 4,
    energy: 3,
    title: 'Pressure passing workshop',
    notes: 'All about smash passing today. The knee-on-belly to mount transition via the step-over is now making sense. Marcus showed us how to use head pressure to flatten opponents. Key insight: the pass is 80% about taking away their hips, not just going forward.',
    techniques: ['smash-pass', 'knee-on-belly', 'toreando', 'head-pressure'],
    positions: ['side-control', 'knee-on-belly', 'mount'],
    wins: 3,
    losses: 2,
    tags: ['passing', 'pressure', 'top-game'],
    highlights: 'Hip control concept for passing — game changer',
    improvements: 'Need to react faster when they recover guard',
    instructorFeedback: 'Good pressure but telegraphing transitions',
    createdAt: subDays(today, 18).toISOString(),
  },
  {
    id: 'entry-010',
    userId: 'demo-user-001',
    date: format(subDays(today, 21), 'yyyy-MM-dd'),
    type: 'nogi',
    duration: 75,
    mood: 5,
    energy: 5,
    title: 'No-gi — guillotine game finally clicking',
    notes: 'Had a revelation with the arm-in guillotine today. The magic detail: your hips need to be OUT, not in. Once I got that, every shot becomes a guillotine opportunity. Finished 4 arm-in guillotines in sparring. Also learned the transition to triangle when they defend by tucking the chin.',
    techniques: ['guillotine', 'arm-in-guillotine', 'triangle', 'hip-position'],
    positions: ['guard', 'guillotine'],
    wins: 5,
    losses: 1,
    tags: ['guillotine', 'chokes', 'breakthrough'],
    highlights: 'Hip position for arm-in guillotine — everything clicked',
    improvements: 'Triangle from failed guillotine needs more drilling',
    instructorFeedback: 'Excellent guillotine development this month',
    createdAt: subDays(today, 21).toISOString(),
  },
]

// Generate additional entries to fill the heatmap
export function generateHistoricalEntries() {
  const extraEntries = []
  const types = ['gi', 'nogi']
  const moods = [2, 3, 3, 4, 4, 4, 5]

  for (let i = 23; i <= 90; i++) {
    // Skip some days to make it realistic (train ~4-5x per week)
    if (i % 7 === 0 || i % 7 === 3) continue
    if (Math.random() > 0.7 && i > 30) continue

    extraEntries.push({
      id: `entry-hist-${i}`,
      userId: 'demo-user-001',
      date: format(subDays(today, i), 'yyyy-MM-dd'),
      type: types[Math.floor(Math.random() * types.length)],
      duration: [60, 75, 90, 105][Math.floor(Math.random() * 4)],
      mood: moods[Math.floor(Math.random() * moods.length)],
      energy: moods[Math.floor(Math.random() * moods.length)],
      title: `Training session`,
      notes: 'General training and drilling.',
      techniques: [],
      positions: [POSITIONS[Math.floor(Math.random() * POSITIONS.length)]],
      wins: Math.floor(Math.random() * 5),
      losses: Math.floor(Math.random() * 3),
      tags: [],
      highlights: '',
      improvements: '',
      instructorFeedback: null,
      createdAt: subDays(today, i).toISOString(),
    })
  }

  return extraEntries
}

export const allMockEntries = [...mockEntries, ...generateHistoricalEntries()]

export const mockSummary = {
  id: 'summary-001',
  userId: 'demo-user-001',
  generatedAt: subDays(today, 1).toISOString(),
  period: 'last-30-days',
  content: `## Training Analysis — Last 30 Days

**Overview:** Strong month with 24 sessions logged. Your training frequency is excellent and shows clear progression in multiple areas.

**Top Strengths This Month:**
- **Leg lock game** has dramatically improved — outside heel hook mechanics from 411 position finally clicked. You're consistently finishing opponents who previously defended well.
- **Guillotine finishes** are at an all-time high. Hip positioning discovery created 4x finish rate improvement.
- **Guard passing** showing solid progress — torreando and pressure passing fundamentals are landing in live rolling.

**Areas Needing Attention:**
- **De la riva guard retention**: You've noted DLR being passed repeatedly in 3 of the last 5 gi sessions. The kick-through pass is your primary vulnerability here.
- **Back mount finishing**: You're taking the back but only finishing ~33% of the time. Back triangle or bow-and-arrow are your strongest options.
- **Guard when stacked**: Triangle attacks getting defended by stacking. Angling out earlier is the key fix.

**Patterns:**
- No-gi sessions consistently show higher mood/energy than gi (4.6 vs 3.8 avg)
- Morning sessions have lower performance scores — consider timing if possible
- Saturday sessions are your best performers — competition prep environment suits you

**Recommendation:** For next 2 weeks, prioritize DLR guard retention drills and back mount finishing sequences. Your attacking game is strong; shore up these defensive gaps before your next competition.`,
  weaknesses: [
    { position: 'de-la-riva', severity: 'high', count: 5, label: 'De La Riva Guard Retention' },
    { position: 'back-control', severity: 'medium', count: 3, label: 'Back Mount Finishing' },
    { position: 'guard', severity: 'medium', count: 3, label: 'Triangle vs Stack Defense' },
    { position: 'half-guard', severity: 'low', count: 2, label: 'Half Guard Underhook Battle' },
  ],
  strengths: [
    { position: 'leg-locks', count: 4, label: 'Heel Hook Attacks' },
    { position: 'guillotine', count: 4, label: 'Guillotine Finishes' },
    { position: 'side-control', count: 3, label: 'Guard Passing' },
  ],
  stats: {
    totalSessions: 24,
    totalMinutes: 1890,
    avgMood: 4.1,
    avgEnergy: 3.9,
    winRate: 0.67,
    giSessions: 16,
    nogiSessions: 8,
    currentStreak: 4,
    longestStreak: 8,
  }
}

export const mockVideos = [
  {
    id: 'video-001',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'De La Riva Guard Retention: 5 Key Concepts',
    channel: 'Bernardo Faria BJJ',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    duration: '18:24',
    views: '142K',
    position: 'de-la-riva',
    relevanceScore: 0.97,
    saved: false,
    feedback: null,
    description: 'Complete breakdown of DLR retention against the kick-through and hip control passes.',
  },
  {
    id: 'video-002',
    youtubeId: 'xvFZjo5PgG0',
    title: 'Finishing From Back Mount: Bow & Arrow vs RNC Decision Tree',
    channel: 'John Danaher Fundamentals',
    thumbnail: 'https://i.ytimg.com/vi/xvFZjo5PgG0/hqdefault.jpg',
    duration: '22:11',
    views: '89K',
    position: 'back-control',
    relevanceScore: 0.95,
    saved: true,
    feedback: 'like',
    description: 'When to choose each submission and how to transition between them.',
  },
  {
    id: 'video-003',
    youtubeId: 'M7lc1UVf-VE',
    title: 'Escaping the Stack: Triangle Defense Against Pressure Passers',
    channel: 'Mikey Musumeci Grappling',
    thumbnail: 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg',
    duration: '14:52',
    views: '67K',
    position: 'guard',
    relevanceScore: 0.91,
    saved: false,
    feedback: null,
    description: 'Hip angling and frame creation to prevent your triangle from being stacked and passed.',
  },
  {
    id: 'video-004',
    youtubeId: 'fJ9rUzIMcZQ',
    title: 'Half Guard Underhook Battle: Winning the Framing War',
    channel: 'Tom DeBlass BJJ',
    thumbnail: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
    duration: '16:38',
    views: '53K',
    position: 'half-guard',
    relevanceScore: 0.88,
    saved: false,
    feedback: null,
    description: 'Systematic approach to winning the underhook from half guard bottom.',
  },
  {
    id: 'video-005',
    youtubeId: 'kffacxfA7G4',
    title: 'DLR to X-Guard: The Missing Link in Your Guard Game',
    channel: 'Buchecha BJJ',
    thumbnail: 'https://i.ytimg.com/vi/kffacxfA7G4/hqdefault.jpg',
    duration: '11:45',
    views: '38K',
    position: 'de-la-riva',
    relevanceScore: 0.85,
    saved: false,
    feedback: 'dislike',
    description: 'Transitioning between DLR and X-guard to maintain guard when being passed.',
  },
  {
    id: 'video-006',
    youtubeId: 'hTWKbfoikeg',
    title: 'Back Control System: Taking and Keeping the Back',
    channel: 'Gordon Ryan Technique',
    thumbnail: 'https://i.ytimg.com/vi/hTWKbfoikeg/hqdefault.jpg',
    duration: '28:14',
    views: '215K',
    position: 'back-control',
    relevanceScore: 0.82,
    saved: false,
    feedback: null,
    description: 'Complete back control system from taking the back to finishing.',
  },
]

export const mockPositionStats = [
  { position: 'Guard', wins: 18, losses: 8, neutral: 4 },
  { position: 'Half Guard', wins: 10, losses: 12, neutral: 3 },
  { position: 'Side Control', wins: 22, losses: 6, neutral: 5 },
  { position: 'Mount', wins: 15, losses: 9, neutral: 2 },
  { position: 'Back', wins: 12, losses: 8, neutral: 6 },
  { position: 'Leg Locks', wins: 9, losses: 3, neutral: 2 },
]
