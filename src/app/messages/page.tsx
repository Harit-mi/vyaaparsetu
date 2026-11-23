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
  ArrowRight,
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
      content: `Inspection confirmed: "${meetingAgenda}" on ${meetingDate} at ${meetingTime}. Both parties remain bound by active bilateral non-disclosure agreements.`,
      timestamp: new Date().toISOString(),
      isRead: true,
      isSystemNotice: true,
    };

    MarketplaceStorage.addMessage(systemNotice);
    setIsSchedulingMeeting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="font-semibold text-slate-700">Deal Room Messenger</span>
            <span>•</span>
            <span className="text-slate-500">180-Day Attribution Protected</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            End-to-End Encrypted Audit Trail
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Negotiation Rooms
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Confidential deal communications. Time-stamped and preserved for transaction attribution.
            </p>
          </div>

          {/* Mobile Tab Toggle */}
          <div className="md:hidden flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMobileTab("threads")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                mobileTab === "threads"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Threads ({conversations.length})
            </button>
            <button
              onClick={() => setMobileTab("chat")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                mobileTab === "chat"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Active Room
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Terminal */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card grid grid-cols-1 md:grid-cols-3 min-h-[660px] overflow-hidden">
        {/* Left: Deal Room Thread Index */}
        <div
          className={`border-r border-slate-200 divide-y divide-slate-100 overflow-y-auto max-h-[660px] bg-slate-50/40 ${
            mobileTab === "threads" ? "block" : "hidden md:block"
          }`}
        >
          <div className="p-3.5 bg-slate-100/70 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            Active Rooms ({conversations.length})
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
                    ? "bg-white border-l-4 border-blue-600 shadow-xs"
                    : "border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    Room #{c.id}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {formatDate(c.lastMessageTime)}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm truncate">
                  {c.buyerName} ↔ {c.sellerName}
                </div>
                <p className="text-xs text-blue-600 font-medium truncate">{c.listingTitle}</p>
                <p className="text-xs text-slate-500 truncate line-clamp-1">&ldquo;{c.lastMessage}&rdquo;</p>
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
            <div className="p-5 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-blue-700 font-semibold bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    Target Opportunity
                  </span>
                  <span className="text-slate-400">Ref #{activeConv.listingId}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{activeConv.listingTitle}</h3>
                <div className="text-xs text-slate-500">
                  Seller: <strong className="text-slate-800 font-semibold">{activeConv.sellerName}</strong> • Buyer:{" "}
                  <strong className="text-slate-800 font-semibold">{activeConv.buyerName}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSchedulingMeeting(!isSchedulingMeeting)}
                  className="btn-brand btn-sm inline-flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Inspection</span>
                </button>
                <Link
                  href={`/businesses/${activeConv.listingId}`}
                  className="btn-secondary btn-sm p-2"
                  title="View Listing Details"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Scheduled Milestone Widget (if scheduled) */}
            {activeConv.meetingScheduled && (
              <div className="m-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase font-bold text-emerald-800 tracking-wider block">
                      Confirmed Due Diligence Milestone
                    </span>
                    <p className="font-semibold text-xs text-slate-900">
                      {activeConv.meetingScheduled.agenda}
                    </p>
                    <div className="text-xs text-emerald-700 flex flex-wrap items-center gap-3">
                      <span>Date: {activeConv.meetingScheduled.date}</span>
                      <span>Time: {activeConv.meetingScheduled.time}</span>
                      <span>Format: {activeConv.meetingScheduled.platform}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Meeting Scheduler Drawer */}
            {isSchedulingMeeting && (
              <form onSubmit={handleSaveMeeting} className="m-4 p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Schedule Plant Walkthrough or Diligence Call
                  </h4>
                  <p className="text-xs text-slate-500">
                    Log formal inspection details for diligence records.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Time (IST)
                    </label>
                    <input
                      type="text"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agenda & Location
                  </label>
                  <input
                    type="text"
                    value={meetingAgenda}
                    onChange={(e) => setMeetingAgenda(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsSchedulingMeeting(false)}
                    className="btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-brand btn-sm"
                  >
                    Confirm & Save Milestone
                  </button>
                </div>
              </form>
            )}

            {/* Message Thread History */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[420px] flex-1 bg-white">
              {convMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                const isSystem = msg.isSystemNotice;

                if (isSystem) {
                  return (
                    <div
                      key={msg.id}
                      className="my-4 p-4 bg-amber-50 rounded-xl border border-amber-200 text-center text-xs text-amber-900 leading-relaxed"
                    >
                      <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-800 mb-1">
                        Platform System Notice
                      </span>
                      {msg.content}
                      <span className="block text-[10px] text-amber-600 mt-1.5">
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
                    <span className="text-[11px] text-slate-400 mb-1 px-1 font-medium">
                      {msg.senderName} • {msg.senderRole}
                    </span>
                    <div
                      className={`max-w-md p-3.5 text-xs leading-relaxed rounded-2xl shadow-xs ${
                        isMe
                          ? "bg-blue-600 text-white rounded-br-xs"
                          : "bg-slate-100 text-slate-900 border border-slate-200/80 rounded-bl-xs"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type confidential acquisition message or regulatory query..."
                className="flex-1 p-2.5 border border-slate-300 rounded-lg bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="btn-brand inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="md:col-span-2 p-16 text-center space-y-3 bg-white">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No Deal Room Selected</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Select an active transaction thread from the left pane to inspect deal records and communicate.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
