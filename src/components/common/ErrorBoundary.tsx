import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error', error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[40vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Something went wrong</h2>
          <p className="text-sm text-slate-600">A data or rendering error interrupted this view. Refresh the page to try again.</p>
          <Button onClick={() => this.setState({ hasError: false })}>Retry</Button>
        </div>
      );
    }

    return this.props.children;
  }
}