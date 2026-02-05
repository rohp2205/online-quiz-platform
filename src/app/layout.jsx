import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Online Quiz Platform',
  description: 'Admin based online quiz system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="bg-black text-white"
        suppressHydrationWarning
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
