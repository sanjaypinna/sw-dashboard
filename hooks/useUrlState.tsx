import { useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

export function useUrlState() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateURL = useCallback((params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
    })

    const newURL = pathname + (newParams.toString() ? `?${newParams.toString()}` : "")
    router.replace(newURL, { scroll: false })
  }, [pathname, router, searchParams])

  return { updateURL, searchParams }
}