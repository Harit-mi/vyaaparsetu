"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MarketplaceStorage } from "@/lib/storage";
import { Conversation, MessageItem } from "@/types/marketplace";
import { formatINR, formatDate } from "@/lib/utils";
import {
  MessageSquare,
  Send,
  Calendar,
  Clock,
  ShieldCheck,
  Building,
  User,
  ArrowUpRight,
  Video,
  MapPin,
  CheckCircle2,
  FileCheck,
  Check,
} from "lucide-react";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const currentUser = MarketplaceStorage.getCurrentUser();

  // Meeting schedule simulation
  const [isSchedulingMeeting, setIsSchedulingMeeting] = useState(false);
  const [meetingDate, setMeetingDate] = useState("2024-03-28");
  const [meetingTime, setMeetingTime] = useState("11:30 AM IST");
  const [meetingAgenda, setMeetingAgenda] = useState("Facility inspection & plant walkthrough at Chakan Phase II");
  const [mobileTab, setMobileTab] = useState<"threads" | "chat">("chat");

  useEffect(() => {
    const sync = () => {
      const convs = MarketplaceStorage.getConversations();
      setConversations(convs);
      if (convs.length > 0 && !activeConvId) {
        setActiveConvId(convs[0].id);
      }
      setMessages(MarketplaceStorage.getMessages());
    };
    sync();
    window.addEventListener("vyapaarsetu_state_changed", sync);
    return () => window.removeEventListener("vyapaarsetu_state_changed", sync);
  }, [activeConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const convMessages = messages.filter((m) => m.conversationId === activeConv?.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      conversationId: activeConv.id,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      content: inputText,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    MarketplaceStorage.addMessage(newMsg);
    setInputText("");
  };

  const handleSaveMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv) return;

    activeConv.meetingScheduled = {
      date: meetingDate,
      time: meetingTime,
      agenda: meetingAgenda,
      platform: "In-Person Meeting",
      status: "scheduled",
    };

    // Add a system notice message into the thread
    const systemNotice: MessageItem = {
      id: `msg-sys-${Date.now()}`,
      conversationId: activeConv.id,
      senderId: "system",
      senderName: "VyapaarSetu Protocol Desk",
      senderRole: "system",
      content: `COMMERCIAL PROTOCOL NOTICE: In-person inspection confirmed for "${meetingAgenda}" on ${meetingDate} at ${meetingTime}. Both parties remain bound by active bilateral non-disclosure covenants.`,
      timestamp: new Date().toISOString(),
      isRead: true,
      isSystemNotice: true,
    };

    MarketplaceStorage.addMessage(systemNotice);
    setIsSchedulingMeeting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Editorial Masthead */}
      <div className="border-b border-[#e2dfd6] pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-600 inline-block" />
            <span>SECURE DEAL ROOM TERMINAL</span>
            <span>&bull;</span>
            <span className="text-navy-950 font-bold">180-DAY ATTRIBUTION PROTOCOL</span>
          </div>
          <span className="text-slate-400">ENCRYPTED BILATERAL LOG</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              Acquisition Communications
            </h1>
            <p className="font-mono text-xs text-slate-500 mt-1">
              Statutory deal channel. All commercial discussions are time-stamped and preserved for transaction attribution.
            </p>
          </div>

          {/* Mobile Tab Toggle */}
          <div className="md:hidden flex items-center gap-2 bg-[#f5f4ef] p-1 border border-[#e2dfd6]">
            <button
              onClick={() => setMobileTab("threads")}
              className={`px-3 py-1.5 font-mono text-xs uppercase font-bold transition ${
                mobileTab === "threads"
                  ? "bg-white text-navy-950 border border-[#e2dfd6] shadow-xs"
                  : "text-slate-600"
              }`}
            >
              THREADS ({conversations.length})
            </button>
            <button
              onClick={() => setMobileTab("chat")}
              className={`px-3 py-1.5 font-mono text-xs uppercase font-bold transition ${
                mobileTab === "chat"
                  ? "bg-white text-navy-950 border border-[#e2dfd6] shadow-xs"
                  : "text-slate-600"
              }`}
            >
              ACTIVE ROOM
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Terminal */}
      <div className="bg-white border border-[#e2dfd6] grid grid-cols-1 md:grid-cols-3 min-h-[660px] overflow-hidden">
        {/* Left: Deal Room Thread Index */}
        <div
          className={`border-r border-[#e2dfd6] divide-y divide-[#e2dfd6] overflow-y-auto max-h-[660px] bg-[#fbfbf9] ${
            mobileTab === "threads" ? "block" : "hidden md:block"
          }`}
        >
          <div className="p-3 bg-[#f5f4ef] font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-[#e2dfd6]">
            ACTIVE DEAL ROOMS [{conversations.length}]
          </div>

          {conversations.map((c) => {
            const isSelected = activeConv?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveConvId(c.id);
                  setMobileTab("chat");
                }}
                className={`w-full text-left p-4 hover:bg-white transition-colors flex flex-col gap-1.5 ${
                  isSelected
                    ? "bg-white border-l-4 border-navy-950 shadow-xs"
                    : "border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    DEAL ROOM #{c.id.toUpperCase()}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 tabular-nums">
                    {formatDate(c.lastMessageTime)}
                  </span>
                </div>
                <div className="font-display font-bold text-navy-950 text-xs truncate">
                  {c.buyerName} &harr; {c.sellerName}
                </div>
                <p className="font-mono text-[11px] text-teal-800 font-semibold truncate">{c.listingTitle}</p>
                <p className="text-[11px] text-slate-500 truncate font-sans italic">&ldquo;{c.lastMessage}&rdquo;</p>
              </button>
            );
          })}
        </div>

        {/* Right 2 Cols: Active Deal Room Chat & Milestones */}
        {activeConv ? (
          <div
            className={`md:col-span-2 flex flex-col justify-between bg-white ${
              mobileTab === "threads" ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Thread Header with Deal Reference */}
            <div className="p-5 bg-[#fbfbf9] border-b border-[#e2dfd6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-teal-800 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 uppercase tracking-wider">
                    TARGET ASSET MEMORANDUM
                  </span>
                  <span className="text-slate-400">MANDATE REF #{activeConv.listingId}</span>
                </div>
                <h3 className="font-display font-bold text-navy-950 text-base">{activeConv.listingTitle}</h3>
                <div className="font-mono text-xs text-slate-500">
                  SELLER: <strong className="text-navy-900">{activeConv.sellerName}</strong> &bull; BUYER:{" "}
                  <strong className="text-navy-900">{activeConv.buyerName}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSchedulingMeeting(!isSchedulingMeeting)}
                  className="btn-primary btn-sm"
                >
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  <span>SCHEDULE INSPECTION</span>
                </button>
                <Link
                  href={`/businesses/${activeConv.listingId}`}
                  className="btn-secondary btn-sm p-2"
                  title="View Listing Teaser"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Scheduled Milestone Widget (if scheduled) */}
            {activeConv.meetingScheduled && (
              <div className="m-4 p-4 bg-teal-50/70 border border-teal-200 text-xs text-teal-950 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-teal-900 tracking-wider block">
                      CONFIRMED DUE DILIGENCE MILESTONE
                    </span>
                    <p className="font-sans font-semibold text-xs text-teal-950">
                      {activeConv.meetingScheduled.agenda}
                    </p>
                    <div className="font-mono text-[11px] text-teal-800 flex flex-wrap items-center gap-3">
                      <span>DATE: {activeConv.meetingScheduled.date}</span>
                      <span>TIME: {activeConv.meetingScheduled.time}</span>
                      <span>FORMAT: {activeConv.meetingScheduled.platform.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Meeting Scheduler Drawer */}
            {isSchedulingMeeting && (
              <form onSubmit={handleSaveMeeting} className="m-4 p-5 bg-[#fbfbf9] border border-[#e2dfd6] space-y-3 text-xs">
                <div className="border-b border-[#e2dfd6] pb-2">
                  <h4 className="font-display font-bold text-navy-950 text-sm">
                    SCHEDULE PHYSICAL INSPECTION OR VIRTUAL AUDIT
                  </h4>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Log formal inspection details for confirmatory due diligence records.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-600 mb-1 font-bold">
                      TARGET DATE
                    </label>
                    <input
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full p-2 border border-[#e2dfd6] bg-white text-navy-950 font-mono text-xs focus:ring-1 focus:ring-navy-950 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-600 mb-1 font-bold">
                      TIME (IST)
                    </label>
                    <input
                      type="text"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="w-full p-2 border border-[#e2dfd6] bg-white text-navy-950 font-mono text-xs focus:ring-1 focus:ring-navy-950 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-600 mb-1 font-bold">
                    AGENDA & PHYSICAL / VIRTUAL LOCATION
                  </label>
                  <input
                    type="text"
                    value={meetingAgenda}
                    onChange={(e) => setMeetingAgenda(e.target.value)}
                    className="w-full p-2 border border-[#e2dfd6] bg-white text-navy-950 text-xs focus:ring-1 focus:ring-navy-950 focus:outline-hidden font-sans"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#e2dfd6]">
                  <button
                    type="button"
                    onClick={() => setIsSchedulingMeeting(false)}
                    className="btn-secondary btn-sm"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="btn-teal btn-sm"
                  >
                    CONFIRM & RECORD PROTOCOL EVENT
                  </button>
                </div>
              </form>
            )}

            {/* Message Thread History */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[420px] flex-1 bg-[#fbfbf9]/40">
              {convMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                const isSystem = msg.isSystemNotice;

                if (isSystem) {
                  return (
                    <div
                      key={msg.id}
                      className="my-4 p-4 bg-amber-50/90 border border-amber-300 text-center text-xs text-amber-950 leading-relaxed font-sans"
                    >
                      <span className="font-mono font-bold block text-[10px] uppercase tracking-wider text-amber-900 mb-1">
                        STATUTORY PROTOCOL NOTICE
                      </span>
                      {msg.content}
                      <span className="block font-mono text-[10px] text-amber-700 mt-1.5 tabular-nums">
                        {formatDate(msg.timestamp)}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <span className="font-mono text-[10px] text-slate-500 mb-1 uppercase tracking-wider px-1">
                      {msg.senderName} &bull; {msg.senderRole}
                    </span>
                    <div
                      className={`max-w-md p-4 text-xs leading-relaxed border ${
                        isMe
                          ? "bg-navy-950 text-white border-navy-950"
                          : "bg-white text-navy-950 border-[#e2dfd6] shadow-2xs"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 mt-1 px-1 tabular-nums">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#e2dfd6] flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type confidential acquisition message or regulatory query..."
                className="flex-1 p-2.5 border border-[#e2dfd6] bg-[#fbfbf9] text-xs text-navy-950 placeholder:text-slate-400 focus:ring-1 focus:ring-navy-950 focus:outline-hidden font-sans"
              />
              <button
                type="submit"
                className="btn-primary"
              >
                <Send className="w-3.5 h-3.5 text-teal-400" />
                <span>SEND</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="md:col-span-2 p-16 text-center space-y-3 bg-white">
            <div className="w-12 h-12 border border-[#e2dfd6] bg-[#fbfbf9] flex items-center justify-center mx-auto text-slate-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-navy-950 text-base">NO DEAL ROOM SELECTED</h3>
            <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
              Select an active transaction thread from the index to inspect deal records and communicate.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
