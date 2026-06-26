import { Component, createElement as h } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return h(
        'div',
        {
          className:
            'flex min-h-screen flex-col items-center justify-center bg-slate-100 px-6 text-center',
        },
        h(AlertCircle, {
          className: 'mb-4 h-12 w-12 text-danger-500',
          'aria-hidden': true,
        }),
        h(
          'h1',
          { className: 'text-xl font-semibold text-slate-900' },
          'Terjadi kesalahan',
        ),
        h(
          'p',
          { className: 'mt-2 max-w-md text-sm text-slate-600' },
          'Aplikasi mengalami masalah tak terduga. Muat ulang halaman untuk mencoba lagi.',
        ),
        h(
          'button',
          {
            type: 'button',
            onClick: this.handleReload,
            className:
              'mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700',
          },
          h(RefreshCw, { className: 'h-4 w-4' }),
          'Muat ulang',
        ),
      )
    }

    return this.props.children
  }
}