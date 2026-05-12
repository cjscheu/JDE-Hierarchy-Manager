import { createContext, useContext, type ReactNode } from 'react'

export type PageMode = 'default' | 'references' | 'app-review' | 'data'

const PageModeContext = createContext<PageMode>('default')

export function PageModeProvider({ mode, children }: { mode: PageMode; children: ReactNode }) {
  return <PageModeContext.Provider value={mode}>{children}</PageModeContext.Provider>
}

export function usePageMode() {
  return useContext(PageModeContext)
}
