"use client"

import { useState } from "react"

const RESULTS_BY_QUERY = {
  "intake system": [
    {
      id: 1,
      type: "ai",
      title: "Intake System Design — AI Answer",
      description:
        "An intake system in FTC typically uses compliant wheels or rubber rollers to grab game elements. Key considerations include motor torque (torque > speed for heavy elements), roller diameter (larger = more forgiving), and funnel geometry. Teams often use a 'polycord' or 'belt' intake for flat game pieces. Consider adding a sensor (color or distance) to detect when an element is secured. Gear ratio of 3:1 to 5:1 on a 40rpm motor is a common starting point.",
      url: "#",
      bookmarked: false,
    },
    {
      id: 2,
      type: "discord",
      title: "FTC Tech Discord",
      description: "#intake-designs has 200+ robot intake photos and build logs from thousands of teams worldwide.",
      url: "https://discord.gg/ftc",
      bookmarked: false,
    },
    {
      id: 3,
      type: "github",
      title: "FTCLib / FTCLib",
      description: "Community FTC library with intake motor abstractions, motor wrappers, and subsystem patterns. Stars: 342",
      url: "https://github.com/FTCLib/FTCLib",
      bookmarked: false,
    },
  ],
  "autonomous": [
    {
      id: 4,
      type: "ai",
      title: "Autonomous Programming — AI Answer",
      description:
        "FTC autonomous runs for 30 seconds and often determines match outcomes. Start with odometry (two or three dead-wheel pods) for reliable position tracking. RoadRunner is the gold-standard library for trajectory following. Use a finite state machine (FSM) pattern to sequence actions. Always add sensor verification before moving to the next state — never rely on pure dead reckoning for scoring positions.",
      url: "#",
      bookmarked: false,
    },
    {
      id: 5,
      type: "discord",
      title: "FTC Programming Discord",
      description: "#roadrunner and #odometry channels with tuning guides, quickstart repos, and community support.",
      url: "https://discord.gg/ftc-programming",
      bookmarked: false,
    },
    {
      id: 6,
      type: "github",
      title: "acmerobotics / road-runner",
      description: "Motion profile generator for FTC autonomous. Used by thousands of teams for smooth, accurate paths. Stars: 1.2k",
      url: "https://github.com/acmerobotics/road-runner",
      bookmarked: false,
    },
  ],
  "wiring": [
    {
      id: 7,
      type: "ai",
      title: "Robot Wiring — AI Answer",
      description:
        "FTC robots use a 12V lithium battery (REV Slim Battery recommended). The Control Hub or Expansion Hub manage motor and servo ports. Use Anderson PowerPole connectors for main power runs. Keep signal wires (encoder, servo) away from high-current motor wires. REV recommends 18AWG for motor power and 22AWG for signal. Label every connector — inspectors and your future self will thank you.",
      url: "#",
      bookmarked: false,
    },
    {
      id: 8,
      type: "discord",
      title: "FTC Discord #electrical",
      description: "Wiring diagrams, REV Control Hub setup guides, and common fault diagnosis for FTC electrical systems.",
      url: "https://discord.gg/ftc",
      bookmarked: false,
    },
    {
      id: 9,
      type: "github",
      title: "REVrobotics / REVHubInterface",
      description: "Official REV Control Hub and Expansion Hub software and documentation. Stars: 89",
      url: "https://github.com/REVrobotics/REV-Software-Binaries",
      bookmarked: false,
    },
  ],
}

const SUGGESTIONS = ["intake system", "autonomous", "wiring", "PID tuning", "odometry", "servo control"]

const INITIAL_HISTORY = [
  { id: 1, query: "servo control" },
  { id: 2, query: "drive motor specs" },
]

export default function KnowledgeTab() {
  const [query, setQuery] = useState("")
  const [submittedQuery, setSubmittedQuery] = useState("intake system")
  const [results, setResults] = useState(RESULTS_BY_QUERY["intake system"])
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [showHistory, setShowHistory] = useState(false)
  const [toast, setToast] = useState(null)
  const [bookmarks, setBookmarks] = useState(new Set())
  const [isSearching, setIsSearching] = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSearch = (q) => {
    if (!q.trim()) return
    setIsSearching(true)
    setTimeout(() => {
      const key = Object.keys(RESULTS_BY_QUERY).find((k) => q.toLowerCase().includes(k)) || "intake system"
      setResults(RESULTS_BY_QUERY[key])
      setSubmittedQuery(q)
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.query !== q)
        return [{ id: Date.now(), query: q }, ...filtered].slice(0, 8)
      })
      setIsSearching(false)
      setShowHistory(false)
    }, 600)
  }

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        showToast("Bookmark removed")
      } else {
        next.add(id)
        showToast("Bookmarked")
      }
      return next
    })
  }

  const typeIcon = (type) => {
    if (type === "ai") {
      return (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066CC] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM7.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
          </svg>
        </div>
      )
    }
    if (type === "discord") {
      return (
        <div className="w-8 h-8 rounded-lg bg-[#5865F2] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </div>
      )
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-[#24292F] border border-[#444] flex items-center justify-center flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:flex flex-col w-12 border-r border-[#2a2a2a] items-center py-4 gap-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`p-2.5 rounded-lg transition-colors ${showHistory ? "bg-[#0066CC] text-white" : "text-[#666] hover:bg-[#2a2a2a] hover:text-white"}`}
          title="Search history"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
        </button>
        <button
          className="p-2.5 rounded-lg text-[#666] hover:bg-[#2a2a2a] hover:text-white transition-colors"
          title="Bookmarks"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {toast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#10B981] text-white text-sm px-4 py-2 rounded-full shadow-lg">
            {toast}
          </div>
        )}

        {/* Search */}
        <div className="px-4 pt-4 pb-3">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch(query)
            }}
          >
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowHistory(true)}
                placeholder="Ask about FTC, CAD, wiring..."
                className="w-full bg-[#2a2a2a] text-white placeholder-[#666] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0066CC]"
              />
            </div>
          </form>

          {/* Suggestions */}
          <div className="flex gap-2 mt-2.5 overflow-x-auto scrollbar-hide pb-0.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); handleSearch(s) }}
                className="px-2.5 py-1 bg-[#2a2a2a] hover:bg-[#333] text-[#aaa] rounded-lg text-xs whitespace-nowrap transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* History panel (mobile) */}
        {showHistory && history.length > 0 && (
          <div className="mx-4 mb-3 bg-[#232323] rounded-xl overflow-hidden">
            {history.map((item, i) => (
              <button
                key={item.id}
                onClick={() => { setQuery(item.query); handleSearch(item.query) }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#aaa] hover:bg-[#2a2a2a] transition-colors text-left ${i > 0 ? "border-t border-[#2a2a2a]" : ""}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                {item.query}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-4 pb-4" onClick={() => setShowHistory(false)}>
          {isSearching ? (
            <div className="flex flex-col gap-3">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-[#232323] rounded-xl p-4 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2a2a2a]" />
                    <div className="flex-1">
                      <div className="h-3 bg-[#2a2a2a] rounded mb-2 w-2/3" />
                      <div className="h-2 bg-[#2a2a2a] rounded w-full" />
                      <div className="h-2 bg-[#2a2a2a] rounded w-4/5 mt-1.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="text-[#aaa] text-xs font-medium uppercase tracking-wider mb-3">
                Results for &quot;{submittedQuery}&quot;
              </p>
              <div className="flex flex-col gap-3">
                {results.map((r) => (
                  <div key={r.id} className="bg-[#232323] rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      {typeIcon(r.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-white font-semibold text-sm leading-snug">{r.title}</p>
                          <button
                            onClick={() => toggleBookmark(r.id)}
                            className="flex-shrink-0 p-1 rounded transition-colors hover:bg-[#333]"
                            aria-label={bookmarks.has(r.id) ? "Remove bookmark" : "Bookmark"}
                          >
                            <svg
                              width="16" height="16" viewBox="0 0 24 24"
                              fill={bookmarks.has(r.id) ? "#0066CC" : "none"}
                              stroke={bookmarks.has(r.id) ? "#0066CC" : "#666"}
                              strokeWidth="2"
                            >
                              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                            </svg>
                          </button>
                        </div>
                        <p className="text-[#888] text-xs leading-relaxed mt-1">{r.description}</p>
                        {r.url !== "#" && (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#0066CC] text-xs mt-2 hover:underline"
                          >
                            Open link
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
