'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Place {
  id: string
  name: string
  description?: string
  latitude: number
  longitude: number
  category: string
  address?: string
}

interface ItineraryItem {
  id: string
  day: number
  order: number
  place: Place
}

interface TripMapProps {
  itineraryItems: ItineraryItem[]
  selectedDay: number
  onPlaceSelect?: (placeId: string) => void
}

const categoryColors: Record<string, string> = {
  restaurant: '#ef4444',
  attraction: '#3b82f6',
  hotel: '#10b981',
  activity: '#8b5cf6',
  transport: '#f59e0b',
  other: '#6b7280'
}

const getCategoryIcon = (category: string) => {
  const color = categoryColors[category] || categoryColors.other
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><span style="color: white; font-size: 12px; font-weight: bold;">${category.charAt(0).toUpperCase()}</span></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

export default function TripMap({ itineraryItems, selectedDay, onPlaceSelect }: TripMapProps) {
  const [center, setCenter] = useState<LatLngExpression>([51.505, -0.09])
  const [zoom, setZoom] = useState(13)
  const [routePoints, setRoutePoints] = useState<LatLngExpression[]>([])

  // Filter items for the selected day and sort by order
  const dayItems = itineraryItems
    .filter(item => item.day === selectedDay)
    .sort((a, b) => a.order - b.order)

  // Calculate map center based on places
  useEffect(() => {
    if (dayItems.length > 0) {
      const avgLat = dayItems.reduce((sum, item) => sum + item.place.latitude, 0) / dayItems.length
      const avgLng = dayItems.reduce((sum, item) => sum + item.place.longitude, 0) / dayItems.length
      setCenter([avgLat, avgLng])
      
      // Set route points for polyline
      const points = dayItems.map(item => [item.place.latitude, item.place.longitude] as LatLngExpression)
      setRoutePoints(points)
    }
  }, [dayItems])

  // If no items for the day, don't render the map
  if (dayItems.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">No places to show on map for Day {selectedDay}</p>
      </div>
    )
  }

  return (
    <div className="h-96 rounded-lg overflow-hidden">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Route polyline */}
        {routePoints.length > 1 && (
          <Polyline 
            positions={routePoints} 
            color="#3b82f6" 
            weight={4} 
            opacity={0.7} 
          />
        )}
        
        {/* Place markers */}
        {dayItems.map((item) => {
          const position: LatLngExpression = [item.place.latitude, item.place.longitude]
          return (
            <Marker 
              key={item.id} 
              position={position}
              icon={getCategoryIcon(item.place.category)}
              eventHandlers={{
                click: () => {
                  onPlaceSelect?.(item.place.id)
                },
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-gray-900">{item.place.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{item.place.category}</p>
                  {item.place.description && (
                    <p className="text-sm mt-1">{item.place.description}</p>
                  )}
                  {item.place.address && (
                    <p className="text-xs text-gray-500 mt-1">{item.place.address}</p>
                  )}
                  <div className="mt-2 text-xs">
                    <p>Day: {item.day} | Order: {item.order + 1}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}