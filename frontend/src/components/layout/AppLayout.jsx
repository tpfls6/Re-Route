import { AppNavbar } from './AppNavbar'

export function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <AppNavbar />
      <main className="app-main">
        {children}
      </main>
    </div>
  )
}
