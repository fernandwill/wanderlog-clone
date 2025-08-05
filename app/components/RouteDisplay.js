'use client'
import {useState} from 'react'

export default function RouteDisplay({dest}) {
    const [routes, setRoutes] = useState([])
    const [load, setLoad] = useState(false)

    const transportMethod = [
        { type: 'car', icon: '🚗', time: '2h 30m', cost: '$25' },
        { type: 'plane', icon: '✈️', time: '45m', cost: '$150' },
        { type: 'train', icon: '🚆', time: '3h 15m', cost: '$45' },
        { type: 'bus', icon: '🚌', time: '4h', cost: '$15' }
    ]

    const generateRoutes = () => {
        setLoad(true)
        setTimeout(() => {
            setRoutes(transportMethod)
            setLoading(false)
        }, 1000)
    }

    if (dest.filter(d => d.trim()).length < 2) {
        return <div className="route-display">Add at least 2 destinations to see routes.</div>
    }

    return (
        <div className="route-display">
            <h3>Route Options</h3>
            <button onClick={generateRoutes} disabled={load}>
                {load ? 'Finding routes...' : 'Get Route Suggestions'}
            </button>

            {routes.map((route, index) => (
                <div key={index} className="route-option">
                    <span className="transport-icon">{route.icon}</span>
                    <div className="route-info">
                        <h4>{route.type.charAt(0).toUpperCase() + route.type.slice(1)}</h4>
                        <p>Time: {route.time} | Cost: {route.cost}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}