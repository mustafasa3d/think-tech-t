import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { CharacterCardSkeleton } from './components/Skeleton'

const CharactersPage = lazy(() => import('./pages/CharactersPage'))
const CharacterDetailsPage = lazy(() => import('./pages/CharacterDetailsPage'))

const router = createBrowserRouter([
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

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  </StrictMode>,
)
