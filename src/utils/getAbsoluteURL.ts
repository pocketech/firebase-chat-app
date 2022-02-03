// Gets the URL for the current environment
export const getAbsoluteURL = (relativePath: `/${string}`) => {
  const baseURL = process.env.NEXT_PUBLIC_VERCEL_URL
    ? process.env.NEXT_PUBLIC_VERCEL_URL
    : 'http://localhost:3039'

  return baseURL + relativePath
}
