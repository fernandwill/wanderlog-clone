'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  MapPinIcon, 
  CalendarIcon, 
  SparklesIcon, 
  RouteIcon, 
  PlusIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { tripsAPI, aiAPI } from '@/lib/api'
import { useTripStore } from '@/lib/store'

interface ItineraryItem {
  id: string
  day: number
  order: number
  place: {
    id: string
    name: string
    category: string
    description?: string
  }
}

interface AISuggestion {
  id: string
  type: string
  suggestion: any
  reasoning: string
  confidence: number
  isAccepted: boolean | null
}

interface Trip {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  destination: string
  budget?: number
  isPublic: boolean
  coverImage?: string
  itineraries?: ItineraryItem[]
  aiSuggestions?: AISuggestion[]
}

export default function TripDetailPage() {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState(1)
  const router = useRouter()
  const { id } = useParams()
  
  const { setCurrentTrip } = useTripStore()

  useEffect(() => {
    if (id) {
      fetchTrip(id as string)
    }
  }, [id])

  const fetchTrip = async (tripId: string) => {
    try {
      setLoading(true)
      const response = await tripsAPI.getById(tripId)
      setTrip(response.data)
      setCurrentTrip(response.data)
      
      // Set the number of days in the trip
      if (response.data.itineraries && response.data.itineraries.length > 0) {
        const maxDay = Math.max(...response.data.itineraries.map(item => item.day))
        // We'll handle day selection logic here
      }
    } catch (err) {
      setError('Failed to load trip details')
      console.error('Error fetching trip:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateSuggestions = async () => {
    if (!trip) return
    
    try {
      const response = await aiAPI.generateSuggestions(trip.id, {
        preferences: 'Any',
        budget: trip.budget,
        interests: 'General tourism'
      })
      
      // Refresh trip data to get new suggestions
      fetchTrip(trip.id)
    } catch (err) {
      console.error('Error generating suggestions:', err)
    }
  }

  const handleOptimizeRoute = async () => {
    if (!trip) return
    
    try {
      const response = await aiAPI.optimizeRoute(trip.id)
      
      // Refresh trip data to get optimization
      fetchTrip(trip.id)
    } catch (err) {
      console.error('Error optimizing route:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-48 w-full" />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md max-w-md">
            {error}
          </div>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Trip not found</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Get unique days from itineraries
  const days = trip.itineraries 
    ? [...new Set(trip.itineraries.map(item => item.day))].sort((a, b) => a - b)
    : []

  // Filter itineraries for selected day
  const dayItineraries = trip.itineraries 
    ? trip.itineraries
        .filter(item => item.day === selectedDay)
        .sort((a, b) => a.order - b.order)
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">{trip.title}</h1>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateSuggestions}
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                AI Suggestions
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleOptimizeRoute}
              >
                <RouteIcon className="h-4 w-4 mr-2" />
                Optimize Route
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Info */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{trip.title}</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {trip.destination}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </span>
            </div>
            {trip.budget && (
              <div>
                <span className="font-medium">Budget:</span> ${trip.budget}
              </div>
            )}
          </div>
          
          {trip.description && (
            <p className="mt-4 text-gray-700">{trip.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Itinerary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Daily Itinerary</span>
                  <Button size="sm">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                </CardTitle>
                <CardDescription>
                  Plan your activities for each day of your trip
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Day Selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {days.map(day => (
                    <Button
                      key={day}
                      variant={selectedDay === day ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDay(day)}
                    >
                      Day {day}
                    </Button>
                  ))}
                </div>
                
                {/* Itinerary Items */}
                <div className="space-y-4">
                  {dayItineraries.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No activities planned for this day yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => console.log('Add activity')}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Activity
                      </Button>
                    </div>
                  ) : (
                    dayItineraries.map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-start p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                          <span className="text-primary-800 font-medium">{item.order + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.place.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{item.place.category}</p>
                          {item.place.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.place.description}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <span className="sr-only">Edit</span>
                          ...
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar - AI Suggestions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2 text-yellow-500" />
                  AI Suggestions
                </CardTitle>
                <CardDescription>
                  Personalized recommendations for your trip
                </CardDescription>
              </CardHeader>
              <CardContent>
                {trip.aiSuggestions && trip.aiSuggestions.length > 0 ? (
                  <div className="space-y-4">
                    {trip.aiSuggestions.slice(0, 3).map(suggestion => (
                      <div 
                        key={suggestion.id} 
                        className="p-4 border rounded-lg bg-yellow-50"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900 capitalize">
                            {suggestion.type} Suggestion
                          </h4>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            {Math.round(suggestion.confidence * 100)}% confidence
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-2">
                          {suggestion.reasoning}
                        </p>
                        
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="default">
                            Accept
                          </Button>
                          <Button size="sm" variant="outline">
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No suggestions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Generate AI suggestions to get personalized recommendations.
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={handleGenerateSuggestions}
                    >
                      Generate Suggestions
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}