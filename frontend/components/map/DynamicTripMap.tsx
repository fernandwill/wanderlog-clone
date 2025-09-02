'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Dynamically import TripMap with no SSR
const TripMap = dynamic(() => import('./TripMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  )
})

export default TripMap