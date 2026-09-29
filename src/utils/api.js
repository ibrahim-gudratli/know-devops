// const API_URL = 'http://localhost:3000/api'
const API_URL = import.meta.env.VITE_API_URL
// const API_URL = 'http://192.168.1.107:3000/api'

function getToken() {
  return localStorage.getItem('know_token')
}

async function request(path, options = {}) {
  const token = getToken()

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export function login(username, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

// Knowledge
export function getKnowledge() {
  return request('/knowledge')
}

export function createKnowledge(entry) {
  return request('/knowledge', {
    method: 'POST',
    body: JSON.stringify(entry),
  })
}

export function updateKnowledge(id, entry) {
  return request(`/knowledge/${id}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  })
}

export function deleteKnowledge(id) {
  return request(`/knowledge/${id}`, {
    method: 'DELETE',
  })
}

// Research
export function getResearch() {
  return request('/research')
}

export function createResearch(entry) {
  return request('/research', {
    method: 'POST',
    body: JSON.stringify(entry),
  })
}

export function updateResearch(id, entry) {
  return request(`/research/${id}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  })
}

export function deleteResearch(id) {
  return request(`/research/${id}`, {
    method: 'DELETE',
  })
}

export function completeResearch(id, entry) {
  return request(`/research/${id}/complete`, {
    method: 'POST',
    body: JSON.stringify(entry),
  })
}

// Auth / Signup
export function signup(email, username) {
  return request('/signup', {
    method: 'POST',
    body: JSON.stringify({ email, username }),
  })
}

export function resendSignupCode(email) {
  return request('/signup/resend', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function confirmSignup(email, code, password, username) {
  return request('/signup/confirm', {
    method: 'POST',
    body: JSON.stringify({ email, code, password, username }),
  })
}