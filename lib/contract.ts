import { initContract } from "@ts-rest/core"
import { z } from "zod"
import type { StarshipResponse } from "./types"

const c = initContract()

export const starWarsContract = c.router({
  getStarships: {
    method: "GET",
    path: "/api/starships",
    query: z.object({
      page: z.string(),
      search: z.string(),
    }),
    responses: {
      200: c.type<StarshipResponse>(),
    },
  },
})