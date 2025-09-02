'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPinIcon, PlusIcon, SparklesIcon, ArrowPathIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { tripsAPI } from '@/lib/api'

interface Trip {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  destination: string
  coverImage?: string
  photos?: {
    id: string
    url: string
  }[]
}

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    // Always fetch trips - will get user trips if authenticated, public trips if not
    fetchTrips()
  }, [isAuthenticated])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const response = await tripsAPI.getAll()
      setTrips(response.data.trips)
    } catch (err) {
      setError('Failed to load trips')
      console.error('Error fetching trips:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrip = () => {
    router.push('/dashboard/trips/new')
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    
    if (startDate.getFullYear() === endDate.getFullYear()) {
      if (startDate.getMonth() === endDate.getMonth()) {
        return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      }
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  // Remove the authentication check - allow viewing public trips

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <MapPinIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Wanderlog</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">Welcome, {user?.username}</span>
                  <Button variant="outline" onClick={() => logout()}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => router.push('/auth/login')}>
                    Sign In
                  </Button>
                  <Button onClick={() => router.push('/auth/register')}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAuthenticated ? 'My Trips' : 'Public Trips'}
            </h1>
            <p className="text-gray-600">
              {isAuthenticated ? 'Plan and organize your adventures' : 'Discover amazing travel experiences'}
            </p>
          </div>
          {isAuthenticated && (
            <Button onClick={handleCreateTrip}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Trip
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12">
            <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {isAuthenticated ? 'No trips yet' : 'No public trips available'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {isAuthenticated 
                ? 'Get started by creating a new trip.' 
                : 'Sign in to create and manage your own trips.'}
            </p>
            <div className="mt-6">
              {isAuthenticated ? (
                <Button onClick={handleCreateTrip}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Your First Trip
                </Button>
              ) : (
                <Button onClick={() => router.push('/auth/login')}>
                  Sign In to Create Trips
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card 
                key={trip.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/dashboard/trips/${trip.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-primary-600 mr-2" />
                    {trip.title}
                  </CardTitle>
                  <CardDescription>{trip.destination}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </p>
                  {trip.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {trip.description}
                    </p>
                  )}
                  
                  {/* Photo preview */}
                  {trip.photos && trip.photos.length > 0 && (
                    <div className="mt-3 relative">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <PhotoIcon className="h-3 w-3 mr-1" />
                        <span>{trip.photos.length} photo{trip.photos.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex -space-x-2">
                        {trip.photos.slice(0, 3).map((photo, index) => (
                          <div key={photo.id} className="relative">
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${photo.url}`}
                              alt="Trip photo"
                              className="w-10 h-10 rounded-full object-cover border-2 border-white"
                            />
                            {index === 2 && trip.photos.length > 3 && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                +{trip.photos.length - 3}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex mt-4 space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <SparklesIcon className="h-3 w-3 mr-1" />
                      Smart Planning
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <ArrowPathIcon className="h-3 w-3 mr-1" />
                      Optimized
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}