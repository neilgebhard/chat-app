import { StoreProvider } from './context/store'
import { AddChannelModalProvider } from './context/addChannelModal'
import { DeleteMessageModalProvider } from './context/deleteMessageModal'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <AddChannelModalProvider>
            <DeleteMessageModalProvider>{children}</DeleteMessageModalProvider>
          </AddChannelModalProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
