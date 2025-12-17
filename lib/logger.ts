/**
 * Production-safe logger utility
 * Only logs in development mode to avoid performance impact in production
 */

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args)
    }
  },
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args)
  },
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args)
    }
  },
  debug: (message: string, condition: boolean = true) => {
    if (isDev && condition) {
      console.log(message)
    }
  },
}

