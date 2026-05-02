// Google Calendar API helpers
export async function fetchCalendarEvents(apiKey, calendarId) {
  if (!apiKey || !calendarId) return []
  const now = new Date().toISOString()
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${now}&maxResults=50&singleEvents=true&orderBy=startTime`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Google Calendar error: ${res.status} ${res.statusText}`)
  const data = await res.json()
  return (data.items || []).map((item) => ({
    id: item.id,
    title: item.summary || "(No title)",
    start: item.start?.dateTime || item.start?.date,
    end: item.end?.dateTime || item.end?.date,
    description: item.description || "",
    allDay: !item.start?.dateTime,
  }))
}

export async function createCalendarEvent(apiKey, calendarId, { title, date, startTime = "09:00", endTime = "10:00", description = "" }) {
  if (!apiKey || !calendarId) throw new Error("Google Calendar API key and Calendar ID are required. Add them in Settings.")
  const startDateTime = `${date}T${startTime}:00`
  const endDateTime = `${date}T${endTime}:00`
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: title,
      description,
      start: { dateTime: startDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      end: { dateTime: endDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Google Calendar error: ${res.status}`)
  }
  return await res.json()
}

export async function updateCalendarEvent(apiKey, calendarId, eventId, { title, date, startTime, endTime, description = "" }) {
  if (!apiKey || !calendarId) throw new Error("Google Calendar API key and Calendar ID are required.")
  const startDateTime = `${date}T${startTime}:00`
  const endDateTime = `${date}T${endTime}:00`
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}?key=${apiKey}`
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: title,
      description,
      start: { dateTime: startDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      end: { dateTime: endDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Google Calendar error: ${res.status}`)
  }
  return await res.json()
}

// Slack API helpers
// NOTE: Slack's Web API blocks direct browser requests due to CORS.
// Real deployments need a backend proxy. We attempt the call and surface the error clearly.
export async function postSlackMessage(botToken, channelId, text) {
  if (!botToken || !channelId) throw new Error("Slack Bot Token and Channel ID are required. Add them in Settings.")
  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${botToken}`,
    },
    body: JSON.stringify({ channel: channelId, text }),
  })
  if (!res.ok) throw new Error(`Slack error: ${res.status} ${res.statusText}`)
  const data = await res.json()
  if (!data.ok) throw new Error(`Slack API error: ${data.error}`)
  return data
}

export function formatPollSlackMessage(question, channel) {
  return `📊 *New Poll*: ${question}\n\nVote with ✅ Yes, ❌ No, or 🤷 Maybe\n_Posted from RoboSync · ${channel}_`
}
