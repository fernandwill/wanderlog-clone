import './app.css'

export const metadata = {
  title: 'Wanderlog Clone',
  description: 'Plan your perfect trip',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}