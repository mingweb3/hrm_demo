import '@/styles/css/globals.css'
import '@/styles/css/taildwind-css.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { App } from './app'
import { AuthProvider } from './context/AuthProvider'
import './locales/i18n'
// themes
import { HRMTheme } from './themes'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HelmetProvider>
    <HRMTheme mode="light">
      {/* <React.StrictMode> */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={4000}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            <App />
          </SnackbarProvider>
        </AuthProvider>
      </QueryClientProvider>
      {/* </React.StrictMode> */}
    </HRMTheme>
  </HelmetProvider>
)

// Hot reloadable translation json files
if (import.meta.hot) {
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  import.meta.hot.accept(['./locales/i18n'], () => {
    // No need to render the App again because i18next works with the hooks
  })
}
