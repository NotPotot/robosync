"use client"

import { useState } from "react"

const MESSAGES = [
  {
    id: 1,
    platform: "slack",
    sender: "Alex",
    avatar: "AL",
    preview: "Hey team, I finished the intake CAD revision. The new geometry should give us way better ground clearance...",
    full: "Hey team, I finished the intake CAD revision. The new geometry should give us way better ground clearance on the field tiles. I've uploaded the STEP files to GrabCAD. Can someone do a quick design review before we send to print on Thursday?",
    time: "2h ago",
  },
  {
    id: 2,
    platform: "discord",
    sender: "Jordan",
    avatar: "JO",
    preview: "Reminder: practice is at 4pm Saturday in the school shop. Coach Lin confirmed the room is booked...",
    full: "Reminder: practice is at 4pm Saturday in the school shop. Coach Lin confirmed the room is booked until 9pm. We're focusing on autonomous tuning and driver practice. Please bring your drive team controllers if you have them.",
    time: "5h ago",
  },
  {
    id: 3,
    platform: "github",
    sender: "Casey",
    avatar: "CA",
    preview: "Opened PR #47: Refactor TeleOp drive code to use roadrunner-style motor abstraction. This should make it...",
    full: "Opened PR #47: Refactor TeleOp drive code to use roadrunner-style motor abstraction. This should make it much easier to tune PID constants without touching the main control loop. Needs review from at least two team members before merge.",
    time: "1d ago",
  },
  {
    id: 4,
    platform: "imessage",
    sender: "Team",
    avatar: "TM",
    preview: "Just confirmed — we're registered for the scrimmage at Jefferson High on Nov 2nd! Bring your A-game...",
    full: "Just confirmed — we're registered for the scrimmage at Jefferson High on Nov 2nd! Bring your A-game. It's a great chance to test autonomous before Regionals. Departure time is 7:30am from school. Let Coach know if you need a ride.",
    time: "2d ago",
  },
]

const PLATFORM_COLORS = {
  slack: "#4A154B",
  discord: "#5865F2",
  github: "#24292F",
  imessage: "#34C759",
  all: "#0066CC",
}

const PLATFORM_LABELS = {
  slack: "Slack",
  discord: "Discord",
  github: "GitHub",
  imessage: "iMessage",
  all: "All",
}

function PlatformIcon({ platform, size = 32 }) {
  const style = {
    width: size,
    height: size,
    backgroundColor: PLATFORM_COLORS[platform],
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }

  const iconMap = {
    slack: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    ),
    discord: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
    github: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    imessage: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19c-1.035 0-2.035-.167-2.969-.47l-3.328 1.109 1.109-3.328C6.167 15.035 6 14.035 6 13c0-3.866 2.686-7 6-7s6 3.134 6 7-2.686 6-6 6z"/>
      </svg>
    ),
    all: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
      </svg>
    ),
  }

  return <div style={style}>{iconMap[platform]}</div>
}

export default function MessagesTab() {
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [expandedId, setExpandedId] = useState(null)

  const filtered = MESSAGES.filter((m) => {
    const matchesPlatform = activeFilter === "all" || m.platform === activeFilter
    const matchesSearch =
      search === "" ||
      m.sender.toLowerCase().includes(search.toLowerCase()) ||
      m.preview.toLowerCase().includes(search.toLowerCase())
    return matchesPlatform && matchesSearch
  })

  const platforms = ["all", "slack", "discord", "github", "imessage"]

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full bg-[#2a2a2a] text-white placeholder-[#666] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0066CC]"
          />
        </div>
      </div>

      {/* Platform filters */}
      <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setActiveFilter(p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeFilter === p
                ? "bg-[#0066CC] text-white"
                : "bg-[#2a2a2a] text-[#aaa] hover:bg-[#333]"
            }`}
          >
            {p !== "all" && (
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: PLATFORM_COLORS[p] }}
              />
            )}
            {PLATFORM_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-[#666] text-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            No messages found
          </div>
        ) : (
          <>
            <p className="text-xs text-[#666] font-medium mb-3 uppercase tracking-wider">This Week</p>
            <div className="flex flex-col gap-2">
              {filtered.map((msg) => {
                const isExpanded = expandedId === msg.id
                return (
                  <button
                    key={msg.id}
                    onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                    className="w-full text-left bg-[#232323] hover:bg-[#2a2a2a] rounded-xl p-3.5 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Platform icon */}
                      <div className="mt-0.5 cursor-pointer" onClick={(e) => { e.stopPropagation(); setActiveFilter(msg.platform) }}>
                        <PlatformIcon platform={msg.platform} size={32} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-2">
                            {/* Avatar */}
                            <span className="w-5 h-5 rounded-full bg-[#0066CC] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                              {msg.avatar}
                            </span>
                            <span className="text-white text-sm font-semibold">{msg.sender}</span>
                          </div>
                          <span className="text-[#666] text-xs flex-shrink-0">{msg.time}</span>
                        </div>
                        <p className={`text-[#aaa] text-sm leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
                          {isExpanded ? msg.full : msg.preview}
                        </p>
                      </div>

                      {/* Platform label */}
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: PLATFORM_COLORS[msg.platform] + "33",
                          color: PLATFORM_COLORS[msg.platform] === "#24292F" ? "#aaa" : PLATFORM_COLORS[msg.platform],
                        }}
                      >
                        {PLATFORM_LABELS[msg.platform]}
                      </span>
                    </div>
                    {isExpanded && (
                      <p className="text-[#0066CC] text-xs mt-2 text-right">Tap to collapse</p>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
