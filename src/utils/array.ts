export const replaceItemAtIndex = <T>(arr: T[], index: number, newValue: T): T[] => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

export const removeItemAtIndex = <T>(arr: T[], index: number): T[] => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)]
}

export const sortAscByCreated = <T extends { createdAt: string }[]>(items: T) => {
  return [...items].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
}
