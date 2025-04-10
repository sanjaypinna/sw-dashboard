import type { StarshipResponse } from "./types"

interface FetchStarshipsParams {
  page?: number
  search?: string
}

export async function fetchStarships({ page = 1, search = "" }: FetchStarshipsParams): Promise<StarshipResponse> {
  const params = new URLSearchParams()

  if (page) {
    params.append("page", page.toString())
  }

  if (search) {
    params.append("search", search)
  }

  const url = `https://swapi.dev/api/starships/?${params.toString()}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching starships:", error)
    throw error
  }
}
