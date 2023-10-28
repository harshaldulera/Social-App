import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { ClerkProvider } from '@clerk/nextjs'

import Topbar from '@/components/shared/Topbar'
import LeftsSidebar from '@/components/shared/Leftsidebar'
import RightSidebar from '@/components/shared/Rightsidebar'
import Bottombar from '@/components/shared/Bottombar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />
            <main>
              <LeftsSidebar />
              <section className="container">
              <div className='w-full max-w-4xl'>
                {children}
              </div>
              </section>
              <RightSidebar />
            </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  )
}
