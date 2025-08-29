import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Cookies from 'js-cookie'

interface User {
  id: number
  username: string
  email: string
  lastName?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

// Custom storage that uses cookies
const cookieStorage = {
  getItem: (name: string) => {
    return Cookies.get(name) || null
  },
  setItem: (name: string, value: string) => {
    Cookies.set(name, value, { expires: 7, sameSite: 'strict' })
  },
  removeItem: (name: string) => {
    Cookies.remove(name)
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
)

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
  itineraries?: any[]
}

interface TripState {
  trips: Trip[]
  currentTrip: Trip | null
  setTrips: (trips: Trip[]) => void
  setCurrentTrip: (trip: Trip | null) => void
  addTrip: (trip: Trip) => void
  updateTrip: (id: string, updates: Partial<Trip>) => void
  removeTrip: (id: string) => void
}

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  currentTrip: null,
  setTrips: (trips) => set({ trips }),
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  addTrip: (trip) => set((state) => ({ trips: [trip, ...state.trips] })),
  updateTrip: (id, updates) =>
    set((state) => ({
      trips: state.trips.map((trip) => (trip.id === id ? { ...trip, ...updates } : trip)),
      currentTrip: state.currentTrip?.id === id ? { ...state.currentTrip, ...updates } : state.currentTrip,
    })),
  removeTrip: (id) =>
    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== id),
      currentTrip: state.currentTrip?.id === id ? null : state.currentTrip,
    })),
}))

interface UIState {
  sidebarOpen: boolean
  mapView: boolean
  selectedDay: number
  setSidebarOpen: (open: boolean) => void
  setMapView: (view: boolean) => void
  setSelectedDay: (day: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  mapView: false,
  selectedDay: 1,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMapView: (view) => set({ mapView: view }),
  setSelectedDay: (day) => set({ selectedDay: day }),
}))