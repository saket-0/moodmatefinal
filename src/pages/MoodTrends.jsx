import { useMemo, useState, useEffect } from 'react' // Add useEffect
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { motivationalQuotes } from '../utils/dummyData'
import { useAuth } from '../context/AuthContext' // Import useAuth
import { api } from '../api' // Import api

// The dummy data 'sampleWeek' and 'sampleMonth' can now be removed.

export default function MoodTrends(){
  const { user } = useAuth() // Get the user to know who to fetch for
  const [range,setRange]=useState('week') // You can use this to change your API query later
  const [data,setData]=useState([]) // Default to empty array
  const [loading,setLoading]=useState(true) // Add loading state
  
  const quote = useMemo(
    ()=> motivationalQuotes[Math.floor(Math.random()*motivationalQuotes.length)],
    [] // Only calculate quote once
  )

  // Add useEffect to fetch data when the component loads or user changes
  useEffect(()=>{
    if(!user?.id){
      setLoading(false)
      return // Don't fetch if no user is logged in
    }
    setLoading(true)
    
    // Call the backend endpoint
    // Note: The backend /mood/<user_id> endpoint from my last response sends ALL moods.
    // To implement the 'range' toggle, you would need to update the backend
    // to accept a query parameter like /mood/123?range=week
    
    api.get(`/mood/${user.id}`).then(moods=>{
      if(moods.error){
        console.error(moods.error)
        setData([])
      } else {
        // Transform data for the chart
        // The backend sends 'date' and 'mood' (as a number)
        const formattedData = moods.map(m => ({
          // Format date to be readable on the chart
          day: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          mood: m.mood, // This is already a number from the modified backend
        })).reverse() // Reverse to show oldest to newest
        
        // Filter data based on range (since backend doesn't do it yet)
        if (range === 'week') {
          setData(formattedData.slice(-7)) // Get last 7 entries
        } else {
          setData(formattedData.slice(-30)) // Get last 30 entries
        }
      }
      setLoading(false)
    })
  }, [user?.id, range]) // Re-fetch if the user or the selected range changes

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mood Trends 📈</h1>
          <select className="input w-40" value={range} onChange={e=>setRange(e.target.value)}>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="h-72 mt-4">
          {/* Add loading and empty states */}
          {loading && <p>Loading chart data...</p>}
          {!loading && data.length === 0 && (
            <p className="text-slate-600 text-center">
              {user ? 'No mood data found. Log some moods to see your trend!' : 'Please log in to see your trends.'}
            </p>
          )}

          {/* Only render chart if not loading and data exists */}
          {!loading && data.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                {/* Domain is 0-4 as defined in your backend mood map */}
                <YAxis domain={[0,4]} ticks={[0, 1, 2, 3, 4]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-violet-100 to-emerald-100 text-slate-800">
          <strong>Motivational nugget:</strong> {quote}
        </div>
      </div>
    </div>
  )
}