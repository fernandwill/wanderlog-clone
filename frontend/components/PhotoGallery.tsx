'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { XMarkIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { photosAPI } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/lib/store'

interface Photo {
  id: string
  url: string
  caption?: string
  createdAt: string
}

interface PhotoGalleryProps {
  tripId: string
}

export default function PhotoGallery({ tripId }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { isAuthenticated, user, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    fetchPhotos()
  }, [tripId])

  const fetchPhotos = async () => {
    try {
      setLoading(true)
      
      // Check if user is authenticated before making the request
      if (!isAuthenticated) {
        console.log('User not authenticated, skipping photo fetch')
        setPhotos([])
        return
      }
      
      const response = await photosAPI.getByTripId(tripId)
      setPhotos(response.data.photos || [])
    } catch (error: any) {
      console.error('Error fetching photos:', error)
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        const errorMessage = error.response?.data?.error || ''
        
        if (errorMessage.includes('Invalid or expired token') || errorMessage.includes('invalid signature')) {
          // JWT token is invalid/expired - user needs to re-authenticate
          toast({
            title: 'Session Expired',
            description: 'Your session has expired. Please sign in again.',
            variant: 'destructive',
          })
          
          // Clear invalid auth state and redirect to login
          logout()
          setTimeout(() => {
            router.push('/auth/login')
          }, 2000)
        } else {
          // Other authentication/authorization errors
          toast({
            title: 'Authentication Required',
            description: 'Please sign in to view and manage photos.',
            variant: 'destructive',
          })
        }
      } else if (error.response?.status === 404) {
        // Photos not found - this is normal if no photos exist yet
        setPhotos([])
        console.log('No photos found for this trip (404) - this is normal')
        return // Don't show error toast for 404
      } else if (error.response?.status >= 500) {
        toast({
          title: 'Server Error',
          description: 'Server is experiencing issues. Please try again later.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.error || error.message || 'Failed to load photos',
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleUpload = async (file: File) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('photo', file)
      formData.append('tripId', tripId)
      
      const response = await photosAPI.upload(formData)
      
      // Add the new photo to the list
      if (response.data && response.data.photo) {
        setPhotos(prev => [response.data.photo, ...prev])
        
        toast({
          title: 'Success',
          description: 'Photo uploaded successfully',
        })
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload photo',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (photoId: string) => {
    try {
      await photosAPI.delete(photoId)
      setPhotos(prev => prev.filter(photo => photo.id !== photoId))
      
      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto(null)
      }
      
      toast({
        title: 'Success',
        description: 'Photo deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting photo:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete photo',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Photo Gallery</span>
            <Skeleton className="h-8 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Photo Gallery</span>
          {isAuthenticated ? (
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              variant="outline"
              size="sm"
            >
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
          ) : (
            <Button 
              onClick={() => router.push('/auth/login')}
              variant="outline"
              size="sm"
            >
              Sign In to Upload
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isAuthenticated ? (
          <div className="text-center py-8">
            <PhotoIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Sign in to view photos</h3>
            <p className="mt-1 text-sm text-gray-500">You need to be signed in to view and upload photos.</p>
            <div className="mt-6">
              <Button 
                onClick={() => router.push('/auth/login')}
              >
                Sign In
              </Button>
            </div>
          </div>
        ) : (
          <>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
            
            {photos.length === 0 ? (
              <div className="text-center py-8">
                <PhotoIcon className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No photos</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by uploading a photo.</p>
                <div className="mt-6">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${photo.url}`}
                      alt={photo.caption || 'Trip photo'}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(photo.id)
                        }}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
      
      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => {
                handleDelete(selectedPhoto.id)
                setSelectedPhoto(null)
              }}
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${selectedPhoto.url}`}
              alt={selectedPhoto.caption || 'Trip photo'}
              className="max-w-full max-h-full object-contain"
            />
            {selectedPhoto.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                {selectedPhoto.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}