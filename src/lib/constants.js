export const C = {
  bg:       '#0D1117',
  surface:  '#161B22',
  surface2: '#21262D',
  surface3: '#30363D',
  border:   '#30363D',
  text:     '#E6EDF3',
  muted:    '#7D8590',
  accent:   '#2F81F7',
}

export const WORK = {
  M:    { label: 'Matin',       short: 'M',   bg: '#2F81F7', text: '#fff',    dot: '#2F81F7' },
  AM:   { label: 'Après-midi',  short: 'AM',  bg: '#3FB950', text: '#fff',    dot: '#3FB950' },
  N:    { label: 'Nuit',        short: 'N',   bg: '#DA3633', text: '#fff',    dot: '#DA3633' },
  HN:   { label: 'Horaire N.',  short: 'HN',  bg: '#E3B341', text: '#0D1117', dot: '#E3B341' },
  Repos:{ label: 'Repos',       short: 'Rps', bg: '#30363D', text: '#7D8590', dot: '#484F58' },
  CP:   { label: 'Congés',      short: 'CP',  bg: '#F0F6FC', text: '#0D1117', dot: '#F0F6FC', border: '#C9D1D9' },
}

export const PERSO = {
  sport:    { label: 'Sport',    emoji: '🏋️',  bg: '#FF9F0A', dim: '#3D2800' },
  rdv:      { label: 'RDV',      emoji: '📅',  bg: '#BF5AF2', dim: '#2D1050' },
  diner:    { label: 'Dîner',    emoji: '🍽️',  bg: '#FF6B35', dim: '#3D1800' },
  famille:  { label: 'Famille',  emoji: '👨‍👩‍👧', bg: '#32ADE6', dim: '#002D3D' },
  vacances: { label: 'Vacances', emoji: '✈️',  bg: '#0A84FF', dim: '#001D3D' },
  autre:    { label: 'Autre',    emoji: '📌',  bg: '#636366', dim: '#1C1C1E' },
}

export const MONTHS = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
]

export const DAYS_S = ['L','M','M','J','V','S','D']

// helpers
export const toKey  = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`

export const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()

export const firstDayOfWeek = (y, m) => {
  const d = new Date(y, m, 1).getDay()
  return d === 0 ? 6 : d - 1
}
