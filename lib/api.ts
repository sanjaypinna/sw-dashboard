import { initQueryClient } from "@ts-rest/react-query"
import { z } from "zod"
import { initContract } from "@ts-rest/core"
import { starWarsContract } from "./contract"

// Define the Starship schema using Zod
const StarshipSchema = z.object({
  name: z.string(),
  model: z.string(),
  manufacturer: z.string(),
  cost_in_credits: z.string(),
  length: z.string(),
  max_atmosphering_speed: z.string(),
  crew: z.string(),
  passengers: z.string(),
  cargo_capacity: z.string(),
  consumables: z.string(),
  hyperdrive_rating: z.string(),
  MGLT: z.string(),
  starship_class: z.string(),
  pilots: z.array(z.string()),
  films: z.array(z.string()),
  created: z.string(),
  edited: z.string(),
  url: z.string(),
})

export type Starship = z.infer<typeof StarshipSchema>

// Define the response schema for the starships endpoint
const StarshipsResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(StarshipSchema),
})

// Create the contract
const c = initContract()

export const swapiContract = c.router({
  getStarships: {
    method: "GET",
    path: "/api/starships",
    query: z.object({
      search: z.string().optional(),
      page: z.string().optional(),
    }),
    responses: {
      200: StarshipsResponseSchema,
      400: z.object({
        message: z.string(),
      }),
      500: z.object({
        message: z.string(),
      }),
    },
  },
})

// Create the query client
export const starWarsClient = initQueryClient(starWarsContract, {
  baseUrl: "http://swapi.dev",
  baseHeaders: {
    "Content-Type": "application/json",
  },
  api: async ({ path, method, query }: { path: string; method: string; query?: Record<string, string> }) => {
    const url = new URL(path, "https://swapi.dev")

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value)
        }
      })
    }

    const response = await fetch(url.toString(), { method })

    const data = await response.json()

    return {
      status: response.status,
      body: data,
      headers: response.headers,
    }
  },
})

// Helper function to fetch starships using ts-rest
export async function fetchStarships(search: string, page: number) {
  const response = await starWarsClient.getStarships.query({
    query: {
      search,
      page: page.toString(),
    },
  })

  if (response.status !== 200) {
    throw new Error("Failed to fetch starships")
  }

  return response.body
}