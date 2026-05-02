import { useState } from "react"
import MessagesTab from "./components/messages-tab"
import CalendarTab from "./components/calendar-tab"
import PollsTab from "./components/polls-tab"
import KnowledgeTab from "./components/knowledge-tab"
import SettingsDrawer from "./components/settings-drawer"

const NAV_ITEMS = [
  {
    id: "messages",
    label: "Messages",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "none" : "none"} stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    id: "polls",
    label: "Polls",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    id: "knowledge",
    label: "Knowledge",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.87-1.73 5.35-4.24 6.48L14 17H10l-.76-1.52A7 7 0 0 1 12 2z"/>
      </svg>
    ),
  },
]

const TAB_TITLES = {
  messages: "Messages",
  calendar: "Calendar",
  polls: "Polls",
  knowledge: "Knowledge",
}

export default function RoboSyncApp() {
  const [activeTab, setActiveTab] = useState("messages")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [teamNumber, setTeamNumber] = useState("8417")
  const [teamName, setTeamName] = useState("RoboRaptors")
  const [robotName, setRobotName] = useState("Artemis")
  const [googleCalendarKey, setGoogleCalendarKey] = useState(() => localStorage.getItem("googleCalendarKey") || process.env.REACT_APP_GOOGLE_CLIENT_EMAIL || "")
  const [googlePrivateKey, setGooglePrivateKey] = useState(() => localStorage.getItem("googlePrivateKey") || process.env.REACT_APP_GOOGLE_PRIVATE_KEY || "")
  const [calendarId, setCalendarId] = useState(() => localStorage.getItem("calendarId") || process.env.REACT_APP_GOOGLE_CALENDAR_ID || "")
  const [slackClientId, setSlackClientId] = useState(() => localStorage.getItem("slackClientId") || process.env.REACT_APP_SLACK_CLIENT_ID || "")
  const [slackClientSecret, setSlackClientSecret] = useState(() => localStorage.getItem("slackClientSecret") || process.env.REACT_APP_SLACK_CLIENT_SECRET || "")
  const [slackBotToken, setSlackBotToken] = useState(() => localStorage.getItem("slackBotToken") || "")
  const [slackChannelId, setSlackChannelId] = useState(() => localStorage.getItem("slackChannelId") || process.env.REACT_APP_SLACK_CHANNEL_IDS?.split(",")[0] || "")
  const [slackPollChannelId, setSlackPollChannelId] = useState(() => localStorage.getItem("slackPollChannelId") || process.env.REACT_APP_SLACK_POLL_CHANNEL_IDS?.split(",")[0] || "")

  return (
    <div className="flex h-dvh bg-[#1a1a1a] text-white overflow-hidden">
      {/* Desktop Left Sidebar Nav */}
      <nav className="hidden lg:flex flex-col w-56 border-r border-[#2a2a2a] bg-[#161616] flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0066CC] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM7.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">RoboSync</p>
              <p className="text-[#666] text-xs">Team {teamNumber}</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 py-3 px-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left w-full ${
                  isActive
                    ? "bg-[#0066CC] text-white"
                    : "text-[#888] hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                {item.icon(isActive)}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Team info */}
        <div className="px-3 pb-3 border-t border-[#2a2a2a] pt-3">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {teamName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{teamName}</p>
              <p className="text-[#666] text-xs">{robotName}</p>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-lg hover:bg-[#2a2a2a] transition-colors text-[#666] hover:text-white"
              aria-label="Open settings"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between px-4 py-3.5 border-b border-[#2a2a2a] flex-shrink-0">
          {/* Mobile: logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-7 h-7 bg-[#0066CC] rounded-lg flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM7.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
              </svg>
            </div>
            <span className="text-white font-bold text-sm">RoboSync</span>
          </div>

          {/* Desktop: current tab title */}
          <h1 className="hidden lg:block text-white font-semibold text-base">{TAB_TITLES[activeTab]}</h1>

          {/* Hamburger / settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-[#888] hover:text-white"
            aria-label="Open settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
        </header>

        {/* Tab content */}
        <main className="flex-1 overflow-hidden relative">
          <div className={activeTab === "messages" ? "h-full" : "hidden"}>
            <MessagesTab />
          </div>
          <div className={activeTab === "calendar" ? "h-full" : "hidden"}>
            <CalendarTab googleCalendarKey={googleCalendarKey} calendarId={calendarId} />
          </div>
          <div className={activeTab === "polls" ? "h-full" : "hidden"}>
            <PollsTab
              googleCalendarKey={googleCalendarKey}
              calendarId={calendarId}
              slackBotToken={slackBotToken}
              slackChannelId={slackPollChannelId || slackChannelId}
            />
          </div>
          <div className={activeTab === "knowledge" ? "h-full" : "hidden"}>
            <KnowledgeTab />
          </div>
        </main>

        {/* Mobile Bottom Tab Bar */}
        <nav className="lg:hidden flex border-t border-[#2a2a2a] bg-[#161616] flex-shrink-0">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors ${
                  isActive ? "text-[#0066CC]" : "text-[#555] hover:text-[#888]"
                }`}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                {item.icon(isActive)}
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Settings Drawer */}
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        teamNumber={teamNumber}
        setTeamNumber={setTeamNumber}
        teamName={teamName}
        setTeamName={setTeamName}
        robotName={robotName}
        setRobotName={setRobotName}
        googleCalendarKey={googleCalendarKey}
        setGoogleCalendarKey={(v) => { setGoogleCalendarKey(v); localStorage.setItem("googleCalendarKey", v) }}
        googlePrivateKey={googlePrivateKey}
        setGooglePrivateKey={(v) => { setGooglePrivateKey(v); localStorage.setItem("googlePrivateKey", v) }}
        calendarId={calendarId}
        setCalendarId={(v) => { setCalendarId(v); localStorage.setItem("calendarId", v) }}
        slackClientId={slackClientId}
        setSlackClientId={(v) => { setSlackClientId(v); localStorage.setItem("slackClientId", v) }}
        slackClientSecret={slackClientSecret}
        setSlackClientSecret={(v) => { setSlackClientSecret(v); localStorage.setItem("slackClientSecret", v) }}
        slackBotToken={slackBotToken}
        setSlackBotToken={(v) => { setSlackBotToken(v); localStorage.setItem("slackBotToken", v) }}
        slackChannelId={slackChannelId}
        setSlackChannelId={(v) => { setSlackChannelId(v); localStorage.setItem("slackChannelId", v) }}
        slackPollChannelId={slackPollChannelId}
        setSlackPollChannelId={(v) => { setSlackPollChannelId(v); localStorage.setItem("slackPollChannelId", v) }}
      />
    </div>
  )
}
