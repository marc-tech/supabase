import 'styles/code.scss'
import 'styles/contextMenu.scss'
import 'styles/date-picker.scss'
import 'styles/editor.scss'
import 'styles/grid.scss'
import 'styles/main.scss'
import 'styles/monaco.scss'
import 'styles/react-data-grid-logs.scss'
import 'styles/storage.scss'
import 'styles/stripe.scss'
import 'styles/toast.scss'
import 'styles/ui.scss'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import Head from 'next/head'
import { AppPropsWithLayout } from 'types'

import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StoreProvider } from 'hooks'
import { getParameterByName } from 'lib/common/fetch'
import { GOTRUE_ERRORS } from 'lib/constants'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { RootStore } from 'stores'

import { AppBannerWrapper, PortalToast, RouteValidationWrapper } from 'components/interfaces/App'
import FlagProvider from 'components/ui/Flag/FlagProvider'
import PageTelemetry from 'components/ui/PageTelemetry'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient())
  const [rootStore] = useState(() => new RootStore())
  const router = useRouter()

  useEffect(() => {
    const errorDescription = getParameterByName('error_description', router.asPath)
    if (errorDescription === GOTRUE_ERRORS.UNVERIFIED_GITHUB_USER) {
      rootStore.ui.setNotification({
        category: 'error',
        message:
          'Please verify your email on GitHub first, then reach out to us at support@supabase.io to log into the dashboard',
      })
    }
  }, [])

  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <StoreProvider rootStore={rootStore}>
          <FlagProvider>
            <Head>
              <title>Supabase</title>
              <meta name="viewport" content="initial-scale=1.0, width=device-width" />
              <link rel="stylesheet" type="text/css" href="/css/fonts.css" />
            </Head>
            <PageTelemetry>
              <RouteValidationWrapper>
                <AppBannerWrapper>{getLayout(<Component {...pageProps} />)}</AppBannerWrapper>
              </RouteValidationWrapper>
            </PageTelemetry>
            <PortalToast />
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          </FlagProvider>
        </StoreProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}
export default MyApp
