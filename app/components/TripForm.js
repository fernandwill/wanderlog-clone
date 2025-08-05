'use client'

export default function TripForm({dest, setDest}) {

    const addDest = () => {
        setDest([...dest, ''])
    }

    const updateDest = (index, value) => {
        const newDest = [...dest]
        newDest[index] = value
        setDest(newDest)
    }

    return (
        <div className="trip-form">
            <h2>Plan Your Trip</h2>
            {dest.map((dest, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder={`Destination ${index + 1}`}
                    value={dest}
                    onChange={(e) => updateDest(index, e.target.value)}
                />
            ))}
            <button
                onClick={addDest}>Add Destination</button>
        </div>
    )
}