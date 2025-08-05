'use client'
import {useState} from 'react'
import TripForm from './components/TripForm'
import RouteDisplay from './components/RouteDisplay'


export default function Home() {
  const [dest, setDest] = useState([''])

  return (
    <main>
      <div className="container">
        <h1>Wanderlog Clone</h1>
        <TripForm dest={dest} setDest={setDest}/>
        <RouteDisplay dest={dest} />
      </div>
    </main>
  )
}