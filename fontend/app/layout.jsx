import { Providers } from "./providers"

export const metadata = {
  title: "Learning Assistant Chatbot",
  description: "AI-powered learning support chatbot",
    generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}


import './globals.css'