import { atom } from "jotai"
import type { Starship } from "./types"

export const selectedStarshipsAtom = atom<Starship[]>([])