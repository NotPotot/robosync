import { useState, useEffect, useCallback } from "react"
import { fetchCalendarEvents, createCalendarEvent, updateCalendarEvent } from "../lib/api"

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay() }

function pad2(n) { return String(n).padStart(2, "0") }
function dateToYMD(d) { return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}` }

function EventModal({ event, selectedDate, onClose, onSave, loading }) {
  const [title, setTitle] = useState(event?.title || "")
  const [date, setDate] = useState(event?.date || selectedDate || dateToYMD(new Date()))
  const [startTime, setStartTime] = useState(event?.startTime || "09:00")
  const [endTime, setEndTime] = useState(event?.endTime || "10:00")
  const [description, setDescription] = useState(event?.description || "")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), date, startTime, endTime, description })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-[#232323] rounded-t-2xl sm:rounded-2xl p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-base">{event ? "Edit Event" : "New Event"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#333] text-[#888]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[#aaa] text-xs font-medium mb-1.5 block">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full bg-[#2a2a2a] text-white placeholder-[#555] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0066CC]"
              placeholder="Event title" />
          </div>
          <div>
            <label className="text-[#aaa] text-xs font-medium mb-1.5 block">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
              className="w-full bg-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0066CC] [color-scheme:dark]" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[#aaa] text-xs font-medium mb-1.5 block">Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0066CC] [color-scheme:dark]" />
            </div>
            <div className="flex-1">
              <label className="text-[#aaa] text-xs font-medium mb-1.5 block">End Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0066CC] [color-scheme:dark]" />
            </div>
          </div>
          <div>
            <label className="text-[#aaa] text-xs font-medium mb-1.5 block">Description <span className="text-[#555] font-normal">(optional)</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full bg-[#2a2a2a] text-white placeholder-[#555] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0066CC] resize-none" />
          </div>
          <button type="submit" disabled={loading}
            className="bg-[#0066CC] hover:bg-[#0055aa] disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
            {loading ? "Saving…" : event ? "Save Changes" : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function CalendarTab({ googleCalendarKey, calendarId }) {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [toastError, setToastError] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const showToast = (msg, isError = false) => {
    setToast(msg); setToastError(isError)
    setTimeout(() => setToast(null), 3500)
  }

  const loadEvents = useCallback(async () => {
    if (!googleCalendarKey || !calendarId) return
    setLoading(true)
    try {
      const raw = await fetchCalendarEvents(googleCalendarKey, calendarId)
      // Normalise to {id, title, date(YYYY-MM-DD), startTime, endTime, description}
      const normalised = raw.map((e) => {
        const startDate = e.start ? e.start.substring(0, 10) : null
        const startTime = e.start && e.start.length > 10 ? e.start.substring(11, 16) : "00:00"
        const endTime = e.end && e.end.length > 10 ? e.end.substring(11, 16) : "00:00"
        return { ...e, date: startDate, startTime, endTime }
      })
      setEvents(normalised)
    } catch (err) {
      showToast(err.message, true)
    } finally {
      setLoading(false)
    }
  }, [googleCalendarKey, calendarId])

  useEffect(() => { loadEvents() }, [loadEvents])

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11) }
    else setCurrentMonth(m => m - 1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0) }
    else setCurrentMonth(m => m + 1)
    setSelectedDay(null)
  }

  const eventsForDay = (day) => {
    const ymd = `${currentYear}-${pad2(currentMonth+1)}-${pad2(day)}`
    return events.filter((e) => e.date === ymd)
  }

  const selectedYMD = selectedDay ? `${currentYear}-${pad2(currentMonth+1)}-${pad2(selectedDay)}` : null
  const selectedEvents = selectedDay ? eventsForDay(selectedDay) : []

  const handleSaveEvent = async ({ title, date, startTime, endTime, description }) => {
    setSaving(true)
    try {
      if (editingEvent && editingEvent.gcalId) {
        const updated = await updateCalendarEvent(googleCalendarKey, calendarId, editingEvent.gcalId, { title, date, startTime, endTime, description })
        setEvents((prev) => prev.map((e) => e.id === editingEvent.id ? { ...e, title, date, startTime, endTime, description, gcalId: updated.id } : e))
        showToast("Event updated ✓")
      } else {
        const created = await createCalendarEvent(googleCalendarKey, calendarId, { title, date, startTime, endTime, description })
        setEvents((prev) => [...prev, { id: created.id, gcalId: created.id, title, date, startTime, endTime, description }])
        showToast("Event created on Google Calendar ✓")
      }
    } catch (err) {
      showToast(err.message, true)
    } finally {
      setSaving(false)
      setShowModal(false)
      setEditingEvent(null)
    }
  }

  // Build calendar grid
  const calendarCells = []
  for (let i = 0; i < firstDay; i++) calendarCells.push(null)
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d)
  while (calendarCells.length % 7 !== 0) calendarCells.push(null)

  const hasKeys = !!(googleCalendarKey && calendarId)

  return (
    <div className="flex flex-col h-full relative">
      {toast && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 text-white text-sm px-4 py-2 rounded-full shadow-lg max-w-xs text-center ${toastError ? "bg-[#EF4444]" : "bg-[#10B981]"}`}>
          {toast}
        </div>
      )}

      {showModal && (
        <EventModal
          event={editingEvent}
          selectedDate={selectedYMD}
          onClose={() => { setShowModal(false); setEditingEvent(null) }}
          onSave={handleSaveEvent}
          loading={saving}
        />
      )}

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-[#aaa] hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-white font-semibold text-base">{MONTHS[currentMonth]} {currentYear}</h2>
            {loading && <span className="text-[#666] text-xs">Loading…</span>}
            {hasKeys && (
              <button onClick={loadEvents} title="Refresh" className="p-1.5 rounded-lg hover:bg-[#2a2a2a] text-[#666] hover:text-white transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              </button>
            )}
          </div>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-[#aaa] hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        {!hasKeys && (
          <div className="bg-[#232323] rounded-xl p-4 mb-4 text-center">
            <p className="text-[#aaa] text-sm mb-1">Connect Google Calendar</p>
            <p className="text-[#666] text-xs">Add your API Key and Calendar ID in Settings to see real events.</p>
          </div>
        )}

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
            const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear
            return (
              <button key={day} onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`relative flex flex-col items-center py-1.5 rounded-lg transition-all ${
                  isSelected ? "bg-[#0066CC] text-white" : isToday ? "bg-[#2a2a2a] text-white" : "text-[#ccc] hover:bg-[#2a2a2a]"
                }`}>
                <span className="text-sm font-medium">{day}</span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((e, i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? "white" : "#3B82F6" }} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Selected day */}
        {selectedDay && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#aaa] text-xs font-medium uppercase tracking-wider">
                {MONTHS[currentMonth]} {selectedDay}
              </p>
              <button
                onClick={() => { setEditingEvent(null); setShowModal(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0066CC] hover:bg-[#0055aa] text-white text-xs rounded-lg transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                Add Event
              </button>
            </div>
            {selectedEvents.length === 0 ? (
              <div className="bg-[#232323] rounded-xl p-4 text-center text-[#666] text-sm">No events this day</div>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedEvents.map((event) => (
                  <div key={event.id} className="bg-[#232323] rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5 bg-[#3B82F6]" />
                        <h3 className="text-white font-semibold text-sm">{event.title}</h3>
                      </div>
                      <button
                        onClick={() => { setEditingEvent({ ...event, gcalId: event.id }); setShowModal(true) }}
                        className="p-1.5 rounded-lg hover:bg-[#333] text-[#666] hover:text-white transition-colors flex-shrink-0"
                        title="Edit event"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    </div>
                    {(event.startTime || event.endTime) && (
                      <p className="text-[#888] text-xs mt-1 ml-5">{event.startTime} – {event.endTime}</p>
                    )}
                    {event.description && (
                      <p className="text-[#666] text-xs mt-1 ml-5 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedDay && (
          <div className="mt-4 bg-[#232323] rounded-xl p-4 text-center text-[#666] text-sm">
            {hasKeys ? "Tap a day to see or add events" : "Tap a day to add events"}
          </div>
        )}
      </div>

      {/* FAB — add event for today */}
      <button
        onClick={() => { setEditingEvent(null); setShowModal(true) }}
        className="absolute bottom-6 right-4 bg-[#0066CC] hover:bg-[#0055aa] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95"
        aria-label="Add event"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>
    </div>
  )
}
