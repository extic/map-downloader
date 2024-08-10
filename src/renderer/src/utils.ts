export function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

export const isProduction = () => {
  return process.env.NODE_ENV === 'production'
}
