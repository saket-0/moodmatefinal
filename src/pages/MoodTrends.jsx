import { useMemo, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { motivationalQuotes } from '../utils/dummyData'

const sampleWeek=[
  {day:'Mon',mood:2},
  {day:'Tue',mood:3},
  {day:'Wed',mood:1},
  {day:'Thu',mood:2},
  {day:'Fri',mood:4},
  {day:'Sat',mood:3},
  {day:'Sun',mood:2}
]

const sampleMonth=Array.from({length:30},(_,i)=>({
  day:i+1,
  mood:Math.floor(Math.random()*5)
}))

export default function MoodTrends(){
  const [range,setRange]=useState('week')
  const data = range==='week'? sampleWeek : sampleMonth
  const quote = useMemo(
    ()=> motivationalQuotes[Math.floor(Math.random()*motivationalQuotes.length)],
    [range]
  )

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
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0,4]} />
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
        </div>

        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-violet-100 to-emerald-100 text-slate-800">
          <strong>Motivational nugget:</strong> {quote}
        </div>
      </div>
    </div>
  )
}
