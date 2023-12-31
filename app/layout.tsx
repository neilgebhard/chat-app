import { StoreProvider } from './context/store'
import { AddChannelModalProvider } from './context/addChannelModal'
import { DeleteMessageModalProvider } from './context/deleteMessageModal'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const revalidate = 0

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-neutral-900 text-neutral-200 ${inter.className}`}>
        <StoreProvider>
          <AddChannelModalProvider>
            <DeleteMessageModalProvider>{children}</DeleteMessageModalProvider>
          </AddChannelModalProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
