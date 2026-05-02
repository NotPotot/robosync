import { useState } from "react"
import { postSlackMessage, formatPollSlackMessage, createCalendarEvent } from "../lib/api"

const INITIAL_POLLS = [
  {
    id: 1,
    question: "Should we go to States if we qualify?",
    yes: 6, no: 1, maybe: 2,
    timeLeft: "2h 30m",
    channel: "Slack #announcements",
    userVote: null,
    active: true,
    eventDate: null,
    calendarEventCreated: false,
  },
  {
    id: 2,
    question: "Add driver practice to every Saturday session?",
    yes: 4, no: 3, maybe: 1,
    timeLeft: "18h 45m",
    channel: "Slack #general",
    userVote: null,
    active: true,
    eventDate: null,
    calendarEventCreated: false,
  },
  {
    id: 3,
    question: "Buy a second drive hub as backup?",
    yes: 3, no: 5, maybe: 1,
    timeLeft: "Ended",
    channel: "Slack #hardware",
    userVote: "no",
    active: false,
    eventDate: null,
    calendarEventCreated: false,
  },
]

const CHANNELS = ["Slack #announcements", "Slack #general", "Slack #hardware", "Discord #general", "Discord #ftc-chat"]

function CreatePollModal({ onClose, onSubmit }) {
  const [question, setQuestion] = useState("")
  const [channel, setChannel] = useState(CHANNELS[0])
  const [timeLimit, setTimeLimit] = useState("24h")
  const [eventDate, setEventDate] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!question.trim()) return
    onSubmit({ question: question.trim(), timeLeft: timeLimit, channel, eventDate: eventDate || null })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-[#232323] rounded-t-2xl sm:rounded-2xl p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-base">Create Poll</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#333] transition-colors text-[#888]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[#aaa] text-xs font-medium mb-1.5 block">Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Should we practice autonomous on Saturday?"
              className="w-full bg-[#2a2a2a] text-white placeholder-[#555] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0066CC] resize-none"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="text-[#aaa] text-xs font-medium mb-1.5 block">Event Date <span className="text-[#555] font-normal">(optional — creates calendar event on first Yes)</span></label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0066CC] [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="text-[#aaa] text-xs font-medium mb-1.5 block">Options</label>
            <div className="flex gap-2">
              {["Yes", "No", "Maybe"].map((opt) => (
                <div key={opt} className="flex-1 bg-[#2a2a2a] text-[#666] text-sm rounded-xl px-3 py-2.5 text-center">{opt}</div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[#aaa] text-xs font-medium mb-1.5 block">Time Limit</label>
              <select value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0066CC]">
                <option value="1h">1 hour</option>
                <option value="6h">6 hours</option>
                <option value="12h">12 hours</option>
                <option value="24h">24 hours</option>
                <option value="48h">48 hours</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[#aaa] text-xs font-medium mb-1.5 block">Channel</label>
              <select value={channel} onChange={(e) => setChannel(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0066CC]">
                {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button type="submit"
            className="bg-[#0066CC] hover:bg-[#0055aa] text-white font-semibold py-3 rounded-xl text-sm transition-colors">
            Create Poll
          </button>
        </form>
      </div>
    </div>
  )
}

function ThresholdBadge({ yes, no }) {
  const THRESHOLD = 6
  if (yes >= THRESHOLD) {
    return (
      <div className="flex items-center gap-1.5 mt-3">
        <span className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </span>
        <span className="text-[#10B981] text-xs font-medium">Threshold met — Event will be created</span>
      </div>
    )
  }
  if (no >= THRESHOLD) {
    return (
      <div className="flex items-center gap-1.5 mt-3">
        <span className="w-4 h-4 rounded-full bg-[#EF4444] flex items-center justify-center flex-shrink-0">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </span>
        <span className="text-[#EF4444] text-xs font-medium">Not enough interest</span>
      </div>
    )
  }
  return null
}

export default function PollsTab({ googleCalendarKey, calendarId, slackBotToken, slackChannelId }) {
  const [polls, setPolls] = useState(INITIAL_POLLS)
  const [showCreate, setShowCreate] = useState(false)
  const [toast, setToast] = useState(null)
  const [toastError, setToastError] = useState(false)
  const [animating, setAnimating] = useState(null)

  const showToast = (msg, isError = false) => {
    setToast(msg)
    setToastError(isError)
    setTimeout(() => setToast(null), 3500)
  }

  const handleVote = async (pollId, option) => {
    setAnimating({ id: pollId, opt: option })
    setTimeout(() => setAnimating(null), 400)

    let updatedPoll = null
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id !== pollId) return p
        const prev_vote = p.userVote
        const updated = { ...p }
        if (prev_vote) updated[prev_vote] = Math.max(0, updated[prev_vote] - 1)
        if (option !== prev_vote) {
          updated[option] += 1
          updated.userVote = option
        } else {
          updated.userVote = null
        }
        updatedPoll = updated
        return updated
      })
    )
    showToast("Vote recorded")

    // Create Google Calendar event when first yes vote lands and poll has a date
    if (option === "yes" && updatedPoll && updatedPoll.yes === 1 && updatedPoll.eventDate && !updatedPoll.calendarEventCreated) {
      try {
        await createCalendarEvent(googleCalendarKey, calendarId, {
          title: updatedPoll.question,
          date: updatedPoll.eventDate,
          description: `Created automatically by RoboSync poll.`,
        })
        setPolls((prev) => prev.map((p) => p.id === pollId ? { ...p, calendarEventCreated: true } : p))
        showToast("✅ Calendar event created on Google Calendar!")
      } catch (err) {
        showToast(`Calendar: ${err.message}`, true)
      }
    }
  }

  const handleCreatePoll = async (data) => {
    const newPoll = {
      id: Date.now(),
      ...data,
      yes: 0, no: 0, maybe: 0,
      userVote: null,
      active: true,
      calendarEventCreated: false,
    }
    setPolls((prev) => [newPoll, ...prev])
    showToast("Poll created in " + data.channel)

    // Post to Slack if channel starts with "Slack"
    if (data.channel.startsWith("Slack") && slackBotToken && slackChannelId) {
      try {
        const text = formatPollSlackMessage(data.question, data.channel) +
          (data.eventDate ? `\n📅 Event date: ${data.eventDate}` : "")
        await postSlackMessage(slackBotToken, slackChannelId, text)
        showToast("Poll posted to Slack ✓")
      } catch (err) {
        showToast(`Slack: ${err.message}`, true)
      }
    }
  }

  const active = polls.filter((p) => p.active)
  const past = polls.filter((p) => !p.active)

  const VoteButton = ({ poll, option }) => {
    const count = poll[option]
    const isVoted = poll.userVote === option
    const isAnim = animating?.id === poll.id && animating?.opt === option
    const colors = {
      yes: isVoted ? "bg-[#10B981] text-white" : "bg-[#2a2a2a] text-[#aaa] hover:bg-[#333]",
      no: isVoted ? "bg-[#EF4444] text-white" : "bg-[#2a2a2a] text-[#aaa] hover:bg-[#333]",
      maybe: isVoted ? "bg-[#FBBF24] text-black" : "bg-[#2a2a2a] text-[#aaa] hover:bg-[#333]",
    }
    const labels = { yes: "Yes", no: "No", maybe: "Maybe" }

    return (
      <button
        onClick={() => poll.active && handleVote(poll.id, option)}
        disabled={!poll.active}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${colors[option]} ${
          !poll.active ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${isAnim ? "scale-110" : "scale-100"}`}
      >
        <span>{labels[option]}</span>
        <span
          className={`font-bold tabular-nums transition-all ${isAnim ? "scale-125" : "scale-100"}`}
        >
          ({count})
        </span>
      </button>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      {toast && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 text-white text-sm px-4 py-2 rounded-full shadow-lg max-w-xs text-center ${toastError ? "bg-[#EF4444]" : "bg-[#10B981]"}`}>
          {toast}
        </div>
      )}

      {showCreate && (
        <CreatePollModal onClose={() => setShowCreate(false)} onSubmit={handleCreatePoll} />
      )}

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {/* Active Polls */}
        <div className="mb-6">
          <p className="text-[#aaa] text-xs font-medium uppercase tracking-wider mb-3">Active Polls</p>
          {active.length === 0 ? (
            <div className="bg-[#232323] rounded-xl p-6 text-center text-[#666] text-sm">
              No active polls right now
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {active.map((poll) => (
                <div key={poll.id} className="bg-[#232323] rounded-xl p-4">
                  <p className="text-white font-semibold text-sm mb-1">{poll.question}</p>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                    <span className="text-[#666] text-xs">{poll.timeLeft} left</span>
                    <span className="text-[#555] text-xs">•</span>
                    <span className="text-[#666] text-xs">{poll.channel}</span>
                    {poll.eventDate && (
                      <>
                        <span className="text-[#555] text-xs">•</span>
                        <span className="text-[#3B82F6] text-xs">📅 {poll.eventDate}</span>
                      </>
                    )}
                    {poll.calendarEventCreated && (
                      <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded-full">On Calendar ✓</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <VoteButton poll={poll} option="yes" />
                    <VoteButton poll={poll} option="no" />
                    <VoteButton poll={poll} option="maybe" />
                  </div>
                  <ThresholdBadge yes={poll.yes} no={poll.no} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Polls */}
        {past.length > 0 && (
          <div>
            <p className="text-[#aaa] text-xs font-medium uppercase tracking-wider mb-3">Past Polls</p>
            <div className="flex flex-col gap-3">
              {past.map((poll) => (
                <div key={poll.id} className="bg-[#1e1e1e] rounded-xl p-4 opacity-60">
                  <p className="text-[#888] font-semibold text-sm mb-1">{poll.question}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[#555] text-xs">{poll.channel}</span>
                  </div>
                  <div className="flex gap-2">
                    <VoteButton poll={poll} option="yes" />
                    <VoteButton poll={poll} option="no" />
                    <VoteButton poll={poll} option="maybe" />
                  </div>
                  <ThresholdBadge yes={poll.yes} no={poll.no} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowCreate(true)}
        className="absolute bottom-6 right-4 bg-[#0066CC] hover:bg-[#0055aa] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95"
        aria-label="Create poll"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>
    </div>
  )
}
