export interface Starship {
    name: string
    model: string
    manufacturer: string
    crew: string
    hyperdrive_rating: string
}

export interface StarshipResponse {
    count: number
    next: string | null
    previous: string | null
    results: Starship[]
}
