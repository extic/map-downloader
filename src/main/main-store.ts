let currentReferer = ''

export const setReferrer = (referer: string) => {
  currentReferer = referer
}

export const getReferrer = (): string => {
  return currentReferer
}
