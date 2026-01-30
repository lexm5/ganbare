import Header from '@/components/header/Header';
import ThemeContextProvider from '@/context/ThemeContext';
import NotificationProvider from '@/context/NotificationContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return(
    <html lang="jp">
      <body>
        <ThemeContextProvider>
          <NotificationProvider>
            <Header />
            {children}
          </NotificationProvider>
        </ThemeContextProvider>
      </body>
    </html>
  )
}
