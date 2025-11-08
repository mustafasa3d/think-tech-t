import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }

type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-6 text-center text-red-700 bg-red-50">
          <h2 className="text-lg font-semibold">Something went wrong.</h2>
          <p>Try reloading the page.</p>
        </div>
      )
    }
    return this.props.children
  }
}
