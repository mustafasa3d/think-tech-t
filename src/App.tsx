import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-full">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">Character Explorer</Link>
          <nav className="text-sm">
            <Link to="/" className="hover:underline">Home</Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
