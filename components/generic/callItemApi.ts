export async function callItemApi<
  T extends { success: boolean; error: string },
>(
  fn: () => Promise<T>,
  setLoading: (v: boolean) => void,
  setError: (e: string | null) => void
): Promise<T | null> {
  setLoading(true)
  setError(null)
  try {
    return await fn()
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to connect to daemon')
    return null
  } finally {
    setLoading(false)
  }
}
