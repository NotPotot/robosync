"use client"

import { useState } from "react"

const IMPORTANCE_COLORS = {
  important: "#EF4444",
  somewhat: "#FBBF24",
  encouraged: "#10B981",
  optional: "#3B82F6",
}

const IMPORTANCE_LABELS = {
  important: "Critical",
  somewhat: "Practice",
  encouraged: "Encouraged",
  optional: "Optional",
}

const INITIAL_EVENTS = [
  { id: 1, title: "Regional Competition", time: "8:00 AM – 5:00 PM", date: 9, month: 10, importance: "important", attendees: 7, total: 9, rsvp: null },
  { id: 2, title: "Saturday Practice", time: "4:00 PM – 8:00 PM", date: 6, month: 10, importance: "somewhat", attendees: 6, total: 9, rsvp: null },
  { id: 3, title: "Design Review", time: "5:30 PM – 7:00 PM", date: 10, month: 10, importance: "somewhat", attendees: 5, total: 9, rsvp: null },
  { id: 4, title: "Team Social Night", time: "6:00 PM – 9:00 PM", date: 12, month: 10, importance: "encouraged", attendees: 4, total: 9, rsvp: null },
  { id: 5, title: "FTC Webinar", time: "7:00 PM – 8:30 PM", date: 8, month: 10, importance: "optional", attendees: 3, total: 9, rsvp: null },
]

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

export default function CalendarTab() {
  const [currentYear] = useState(2024)
  const [currentMonth, setCurrentMonth] = useState(10) // November = 10
  const [selectedDay, setSelectedDay] = useState(null)
  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const prevMonth = () => {
    setCurrentMonth((m) => (m === 0 ? 11 : m - 1))
    setSelectedDay(null)
  }
  const nextMonth = () => {
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1))
    setSelectedDay(null)
  }

  const eventsForDay = (day) =>
    events.filter((e) => e.date === day && e.month === currentMonth)

  const selectedEvents = selectedDay ? eventsForDay(selectedDay) : []

  const handleRSVP = (eventId, rsvp) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const wasYes = e.rsvp === "yes"
        const nowYes = rsvp === "yes"
        const delta = nowYes && !wasYes ? 1 : !nowYes && wasYes ? -1 : 0
        return { ...e, rsvp, attendees: Math.max(0, Math.min(e.total, e.attendees + delta)) }
      })
    )
    showToast("RSVP saved")
  }

  // Build calendar grid
  const calendarCells = []
  for (let i = 0; i < firstDay; i++) calendarCells.push(null)
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d)
  while (calendarCells.length % 7 !== 0) calendarCells.push(null)

  return (
    <div className="flex flex-col h-full relative">
      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#10B981] text-white text-sm px-4 py-2 rounded-full shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Month navigator */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-[#aaa] hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h2 className="text-white font-semibold text-base">{MONTHS[currentMonth]} {currentYear}</h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-[#aaa] hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="text-center text-[#666] text-xs font-medium py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {calendarCells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />
            const dayEvents = eventsForDay(day)
            const isSelected = selectedDay === day
            const today = new Date()
            const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`relative flex flex-col items-center py-1.5 rounded-lg transition-all ${
                  isSelected
                    ? "bg-[#0066CC] text-white"
                    : isToday
                    ? "bg-[#2a2a2a] text-white"
                    : "text-[#ccc] hover:bg-[#2a2a2a]"
                }`}
              >
                <span className="text-sm font-medium">{day}</span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.map((e) => (
                      <span
                        key={e.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: isSelected ? "white" : IMPORTANCE_COLORS[e.importance] }}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 mb-2">
          {Object.keys(IMPORTANCE_COLORS).map((imp) => (
            <div key={imp} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: IMPORTANCE_COLORS[imp] }} />
              <span className="text-[#888] text-xs">{IMPORTANCE_LABELS[imp]}</span>
            </div>
          ))}
        </div>

        {/* Selected day events */}
        {selectedDay && (
          <div className="mt-4">
            <p className="text-[#aaa] text-xs font-medium uppercase tracking-wider mb-3">
              {MONTHS[currentMonth]} {selectedDay}
            </p>
            {selectedEvents.length === 0 ? (
              <div className="bg-[#232323] rounded-xl p-4 text-center text-[#666] text-sm">
                No events this day
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedEvents.map((event) => (
                  <div key={event.id} className="bg-[#232323] rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: IMPORTANCE_COLORS[event.importance] }}
                        />
                        <h3 className="text-white font-semibold text-sm">{event.title}</h3>
                      </div>
                      <span className="text-[#666] text-xs flex-shrink-0">{event.attendees}/{event.total}</span>
                    </div>
                    <p className="text-[#888] text-xs ml-5.5 mb-3">{event.time}</p>

                    {/* Attendee bar */}
                    <div className="ml-5.5 mb-3">
                      <div className="w-full bg-[#333] rounded-full h-1">
                        <div
                          className="h-1 rounded-full transition-all"
                          style={{
                            width: `${(event.attendees / event.total) * 100}%`,
                            backgroundColor: IMPORTANCE_COLORS[event.importance],
                          }}
                        />
                      </div>
                    </div>

                    {/* RSVP */}
                    <div className="flex gap-2 ml-5.5">
                      {["yes", "no", "maybe"].map((r) => (
                        <button
                          key={r}
                          onClick={() => handleRSVP(event.id, event.rsvp === r ? null : r)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                            event.rsvp === r
                              ? r === "yes"
                                ? "bg-[#10B981] text-white"
                                : r === "no"
                                ? "bg-[#EF4444] text-white"
                                : "bg-[#FBBF24] text-black"
                              : "bg-[#333] text-[#aaa] hover:bg-[#3a3a3a]"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedDay && (
          <div className="mt-4 bg-[#232323] rounded-xl p-4 text-center text-[#666] text-sm">
            Tap a day with dots to see events
          </div>
        )}
      </div>
    </div>
  )
}
