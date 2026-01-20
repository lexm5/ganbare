import Header from '@/components/header/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return(
    <html lang="jp">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}