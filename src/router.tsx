import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { CharacterCardSkeleton } from './components/Skeleton'

const CharactersPage = lazy(() => import('./pages/CharactersPage'))
const CharacterDetailsPage = lazy(() => import('./pages/CharacterDetailsPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ErrorBoundary>
            <Suspense fallback={<div className="p-4 space-y-2"><CharacterCardSkeleton /><CharacterCardSkeleton /></div>}>
              <CharactersPage />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: 'character/:id',
        element: (
          <ErrorBoundary>
            <Suspense fallback={<div className="p-4 space-y-2"><CharacterCardSkeleton /></div>}>
              <CharacterDetailsPage />
            </Suspense>
          </ErrorBoundary>
        ),
      },
    ],
  },
])

export default router
