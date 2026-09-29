const KNOWLEDGE_KEY = 'know_knowledge_entries'

export function loadKnowledgeEntries() {
  const saved = localStorage.getItem(KNOWLEDGE_KEY)

  if (!saved) {
    return []
  }

  try {
    return JSON.parse(saved)
  } catch {
    return []
  }
}

export function saveKnowledgeEntries(entries) {
  localStorage.setItem(
    KNOWLEDGE_KEY,
    JSON.stringify(entries)
  )
}

const RESEARCH_KEY = 'know_research_entries'

export function loadResearchEntries() {
  const saved = localStorage.getItem(RESEARCH_KEY)

  if (!saved) {
    return []
  }

  try {
    return JSON.parse(saved)
  } catch {
    return []
  }
}

export function saveResearchEntries(entries) {
  localStorage.setItem(
    RESEARCH_KEY,
    JSON.stringify(entries)
  )
}

export function addKnowledgeEntry(entry) {
  const entries = loadKnowledgeEntries()

  const newEntry = {
    ...entry,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  }

  saveKnowledgeEntries([newEntry, ...entries])
}