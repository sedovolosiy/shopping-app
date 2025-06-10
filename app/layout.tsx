
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider';
import ServiceWorkerRegister from '@/app/service-worker-register';
import DeviceProvider from '@/components/device-detector';
import './globals.css'
import './mobile-styles.css'
import './mobile-scroll-fixes.css'
import './tablet-styles.css'
import './intermediate-styles.css'
import './desktop-styles.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Умный помощник для покупок',
  description: 'Приложение для оптимизации маршрута покупок в магазинах Lidl, Biedronka и Aldi',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
  themeColor: '#4f46e5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Умный помощник для покупок'
  },
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Умный помощник для покупок" />
        <meta name="application-name" content="Помощник" />
        
        {/* Дополнительные meta теги для мобильных устройств */}
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Предотвращаем zoom на inputs в iOS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media screen and (-webkit-min-device-pixel-ratio:0) {
              select, textarea, input[type="text"], input[type="password"], 
              input[type="datetime"], input[type="datetime-local"], 
              input[type="date"], input[type="month"], input[type="time"], 
              input[type="week"], input[type="number"], input[type="email"], 
              input[type="url"], input[type="search"], input[type="tel"] {
                font-size: 16px !important;
              }
            }
          `
        }} />
        
        {/* Apple touch icons */}
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-icon-167.png" />
        
        {/* iPad splash screens */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/splash/ipad_splash.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/splash/ipad_pro_10_5_splash.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/splash/ipad_pro_12_9_splash.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/splash/ipad_pro_11_splash.png" />
        
        {/* iPad ландшафтный режим */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="/splash/ipad_landscape_splash.png" />
        
        {/* iPhone splash screens */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/splash/iphone_splash.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <DeviceProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
              {children}
              <ServiceWorkerRegister />
            </div>
          </DeviceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
