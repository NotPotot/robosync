"use client"

import { useState } from "react"

const INITIAL_MEMBERS = [
  { id: 1, name: "Alex Chen", role: "Lead Engineer" },
  { id: 2, name: "Jordan Park", role: "Drive Coach" },
  { id: 3, name: "Casey Williams", role: "Programmer" },
  { id: 4, name: "Morgan Lee", role: "CAD Designer" },
  { id: 5, name: "Sam Torres", role: "Build Lead" },
]

const CONNECTED_ACCOUNTS = [
  {
    name: "Slack",
    connected: true,
    color: "#4A154B",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    ),
  },
  {
    name: "Discord",
    connected: true,
    color: "#5865F2",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
  {
    name: "Google",
    connected: true,
    color: "#EA4335",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  {
    name: "GitHub",
    connected: false,
    color: "#24292F",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
]

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors flex-shrink-0 ${
        value ? "bg-[#0066CC]" : "bg-[#333]"
      }`}
      role="switch"
      aria-checked={value}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  )
}

export default function SettingsDrawer({ open, onClose }) {
  const [teamNumber, setTeamNumber] = useState("8417")
  const [teamName, setTeamName] = useState("RoboRaptors")
  const [robotName, setRobotName] = useState("Artemis")
  const [members, setMembers] = useState(INITIAL_MEMBERS)
  const [editingMember, setEditingMember] = useState(null)
  const [newMemberName, setNewMemberName] = useState("")
  const [pollReminders, setPollReminders] = useState(true)
  const [eventReminders, setEventReminders] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [reminderTiming, setReminderTiming] = useState("15m")
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const addMember = () => {
    if (!newMemberName.trim()) return
    setMembers((prev) => [...prev, { id: Date.now(), name: newMemberName.trim(), role: "Member" }])
    setNewMemberName("")
  }

  const deleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const updateRole = (id, role) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)))
  }

  const handleSave = () => {
    showToast("Team info updated")
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-[#1e1e1e] flex flex-col h-full overflow-y-auto z-10 shadow-2xl">
        {toast && (
          <div className="fixed top-4 right-4 z-50 bg-[#10B981] text-white text-sm px-4 py-2 rounded-full shadow-lg">
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <h2 className="text-white font-semibold text-base">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-[#888]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 px-5 py-5 flex flex-col gap-6">
          {/* Team Info */}
          <section>
            <p className="text-[#666] text-xs font-medium uppercase tracking-wider mb-3">Team Info</p>
            <div className="bg-[#232323] rounded-xl p-4 flex flex-col gap-3">
              <div>
                <label className="text-[#888] text-xs mb-1 block">Team Number</label>
                <input
                  value={teamNumber}
                  onChange={(e) => setTeamNumber(e.target.value)}
                  className="w-full bg-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#0066CC]"
                />
              </div>
              <div>
                <label className="text-[#888] text-xs mb-1 block">Team Name</label>
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#0066CC]"
                />
              </div>
              <div>
                <label className="text-[#888] text-xs mb-1 block">Robot Name</label>
                <input
                  value={robotName}
                  onChange={(e) => setRobotName(e.target.value)}
                  className="w-full bg-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#0066CC]"
                />
              </div>
            </div>
          </section>

          {/* Members */}
          <section>
            <p className="text-[#666] text-xs font-medium uppercase tracking-wider mb-3">Members ({members.length})</p>
            <div className="flex flex-col gap-2">
              {members.map((m) => (
                <div key={m.id} className="bg-[#232323] rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{m.name}</p>
                    {editingMember === m.id ? (
                      <input
                        value={m.role}
                        onChange={(e) => updateRole(m.id, e.target.value)}
                        onBlur={() => setEditingMember(null)}
                        autoFocus
                        className="w-full bg-[#2a2a2a] text-[#aaa] text-xs rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-[#0066CC] mt-0.5"
                      />
                    ) : (
                      <button
                        onClick={() => setEditingMember(m.id)}
                        className="text-[#888] text-xs hover:text-[#aaa] transition-colors"
                      >
                        {m.role}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => deleteMember(m.id)}
                    className="p-1.5 rounded-lg hover:bg-[#333] transition-colors text-[#555] hover:text-[#EF4444]"
                    aria-label="Remove member"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                    </svg>
                  </button>
                </div>
              ))}

              {/* Add member */}
              <div className="flex gap-2 mt-1">
                <input
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMember()}
                  placeholder="Add member name..."
                  className="flex-1 bg-[#2a2a2a] text-white placeholder-[#555] rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#0066CC]"
                />
                <button
                  onClick={addMember}
                  className="px-3 py-2 bg-[#0066CC] hover:bg-[#0055aa] text-white rounded-lg text-sm transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </section>

          {/* Connected Accounts */}
          <section>
            <p className="text-[#666] text-xs font-medium uppercase tracking-wider mb-3">Connected Accounts</p>
            <div className="bg-[#232323] rounded-xl overflow-hidden">
              {CONNECTED_ACCOUNTS.map((acc, i) => (
                <div
                  key={acc.name}
                  className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-[#2a2a2a]" : ""}`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: acc.color }}
                  >
                    {acc.icon}
                  </div>
                  <span className="flex-1 text-white text-sm">{acc.name}</span>
                  {acc.connected ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span className="text-[#10B981] text-xs">Connected</span>
                    </div>
                  ) : (
                    <button className="text-[#0066CC] text-xs font-medium hover:underline">Connect</button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section>
            <p className="text-[#666] text-xs font-medium uppercase tracking-wider mb-3">Notifications</p>
            <div className="bg-[#232323] rounded-xl overflow-hidden">
              {[
                { label: "Poll reminders", value: pollReminders, onChange: setPollReminders },
                { label: "Event reminders", value: eventReminders, onChange: setEventReminders },
                { label: "Push notifications", value: pushNotifications, onChange: setPushNotifications },
              ].map((item, i) => (
                <div key={item.label} className={`flex items-center justify-between px-4 py-3.5 ${i > 0 ? "border-t border-[#2a2a2a]" : ""}`}>
                  <span className="text-white text-sm">{item.label}</span>
                  <Toggle value={item.value} onChange={item.onChange} />
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2a2a]">
                <span className="text-white text-sm">Remind me</span>
                <select
                  value={reminderTiming}
                  onChange={(e) => setReminderTiming(e.target.value)}
                  className="bg-[#2a2a2a] text-white rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#0066CC]"
                >
                  <option value="15m">15m before</option>
                  <option value="30m">30m before</option>
                  <option value="1h">1h before</option>
                  <option value="2h">2h before</option>
                  <option value="1d">1 day before</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Save button */}
        <div className="px-5 py-4 border-t border-[#2a2a2a]">
          <button
            onClick={handleSave}
            className="w-full bg-[#0066CC] hover:bg-[#0055aa] text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
