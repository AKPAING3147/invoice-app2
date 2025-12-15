const API_URL = "https://invoice-app-api.mms-it.com/api/v1"

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Login failed")
  }

  return data
}
export async function signup(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: confirmPassword,
    }),
  })

  const data = await res.json()

  // 👇 THIS IS KEY
  if (!res.ok) {
    console.error("REGISTER ERROR:", data)
    throw data
  }

  return data
}