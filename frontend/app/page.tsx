import Link from 'next/link'
import { MapPinIcon, SparklesIcon, RouteIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <MapPinIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Wanderlog Clone</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-primary-600">
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Plan Your Perfect Trip with{' '}
            <span className="text-primary-600">AI Assistance</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create detailed itineraries, get personalized recommendations, and optimize your routes 
            with our AI-powered travel planning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Start Planning Free
            </Link>
            <Link 
              href="/demo"
              className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Trip Planning
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features to make your travel planning effortless and enjoyable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <SparklesIcon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Suggestions</h3>
            <p className="text-gray-600">
              Get personalized recommendations for places to visit, restaurants, and activities based on your preferences.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <RouteIcon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Route Optimization</h3>
            <p className="text-gray-600">
              Automatically optimize your daily routes to save time and reduce travel distances.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <MapPinIcon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Maps</h3>
            <p className="text-gray-600">
              Visualize your itinerary on interactive maps with detailed place information and photos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <UsersIcon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaborative Planning</h3>
            <p className="text-gray-600">
              Share your trips and collaborate with friends and family to plan together.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Next Adventure?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of travelers who trust our AI-powered platform
          </p>
          <Link 
            href="/auth/register"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Create Your First Trip
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <MapPinIcon className="h-6 w-6 text-primary-400" />
            <span className="ml-2 text-lg font-semibold">Wanderlog Clone</span>
          </div>
          <p className="text-center text-gray-400 mt-4">
            © 2024 Wanderlog Clone. Built with AI-powered travel planning.
          </p>
        </div>
      </footer>
    </div>
  )
}