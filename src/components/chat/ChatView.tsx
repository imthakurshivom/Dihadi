import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Phone,
  Send,
  ArrowLeft,
  ShieldAlert,
  MoreVertical,
  CheckCheck,
  MapPin,
  Clock,
  Sparkles,
  Lock,
  CheckCircle2,
  Check,
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    currentUser,
    setReportTarget,
    workers,
    hirings,
    releaseEscrowPayment,
    setIsEscrowBookingModalOpen,
    setSelectedWorkerForEscrow,
    setSelectedJobIdForEscrow,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [releaseSuccessMsg, setReleaseSuccessMsg] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  const matchedWorker = activeConv
    ? workers.find(
        (w) =>
          w.id === activeConv.participantWorkerId ||
          w.name.toLowerCase() === activeConv.participantWorkerName.toLowerCase()
      )
    : undefined;

  const linkedHiring = activeConv
    ? hirings.find(
        (h) =>
          (h.workerId === activeConv.participantWorkerId ||
            h.workerName.toLowerCase() === activeConv.participantWorkerName.toLowerCase()) &&
          (h.status === 'in_progress' || h.status === 'scheduled' || h.paymentStatus === 'locked')
      )
    : undefined;

  const quickReplies = [
    'Haan, kal 8:30 AM par aa jaunga.',
    'Main abhi available hoon.',
    'Dihadi ₹900/day confirm hai?',
    'Site ki exact location share karein.',
    'Mujhe call karein.',
    'Material aur cement site par aa gaya?',
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;
    sendMessage(activeConversationId, inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    if (!activeConversationId) return;
    sendMessage(activeConversationId, text);
  };

  // If no conversation selected on desktop/mobile, or list view
  if (!activeConv) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
        <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-600" />
          <span>Aapki Baat-Cheet (Chat)</span>
        </h2>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 text-stone-500">
            <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-2" />
            <p className="font-bold text-stone-800">Abhi koi chat shuru nahi hui hai</p>
            <p className="text-xs text-stone-400 mt-1">
              Kisi bhi job ya worker card par "Chat" button dabayein
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200/90 divide-y divide-stone-100 overflow-hidden shadow-xs">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className="p-4 flex items-center justify-between gap-3 hover:bg-stone-50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={conv.participantWorkerAvatar}
                      alt={conv.participantWorkerName}
                      className="w-12 h-12 rounded-2xl object-cover border border-stone-200"
                    />
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 leading-snug">
                      {conv.participantWorkerName}
                    </h3>
                    {conv.jobTitle && (
                      <p className="text-[11px] font-semibold text-orange-700 truncate max-w-[220px]">
                        {conv.jobTitle}
                      </p>
                    )}
                    <p className="text-xs text-stone-500 truncate max-w-[240px] mt-0.5 font-medium">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] text-stone-400 font-medium">
                    {conv.lastMessageTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white sm:rounded-3xl border sm:border-stone-200/90 shadow-xs overflow-hidden sm:my-3">
      {/* Active Chat Header */}
      <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveConversationId(null)}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/70"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <img
            src={activeConv.participantWorkerAvatar}
            alt={activeConv.participantWorkerName}
            className="w-10 h-10 rounded-xl object-cover border border-stone-200"
          />

          <div>
            <h3 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
              {activeConv.participantWorkerName}
            </h3>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 relative">
          {/* Quick Escrow Booking Trigger */}
          {matchedWorker && (!linkedHiring || linkedHiring.status === 'completed') && (
            <button
              onClick={() => {
                setSelectedWorkerForEscrow(matchedWorker);
                setSelectedJobIdForEscrow(activeConv.jobId);
                setIsEscrowBookingModalOpen(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs shadow-sm hover:from-orange-500 hover:to-amber-500 transition active:scale-95 cursor-pointer whitespace-nowrap"
              title="Book Worker with Escrow Payment Lock"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Book & Lock 🔒</span>
            </button>
          )}

          <a
            href={`tel:${activeConv.participantWorkerPhone}`}
            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </a>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-stone-100 p-1 z-50 animate-in fade-in">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setReportTarget({
                      id: activeConv.id,
                      title: activeConv.participantWorkerName,
                      type: 'worker',
                    });
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Report / Shikayat
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Context Job Reference Banner */}
      {activeConv.jobTitle && (
        <div className="bg-orange-50/80 px-4 py-2 border-b border-orange-200/50 flex items-center justify-between text-xs text-orange-950 font-medium">
          <div className="truncate max-w-[85%]">
            <span className="font-bold text-orange-800">Kaam: </span>
            {activeConv.jobTitle}
          </div>
          <span className="text-[10px] bg-orange-200/60 text-orange-800 font-bold px-1.5 py-0.5 rounded">
            Linked Job
          </span>
        </div>
      )}

      {/* Live Escrow Payment Milestone Banner */}
      {linkedHiring && linkedHiring.isEscrowLocked && (
        <div className="bg-stone-900 text-white p-3 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-inner">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">
                  Dihadi Suraksha: ₹{linkedHiring.amount} Locked
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.2 rounded-full">
                  ESCROW ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Kaam complete hone par payment worker ke account me release karein.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {linkedHiring.completionOtp && (
              <span className="text-[10px] text-stone-400 bg-black/40 px-2 py-1 rounded-lg border border-stone-700">
                OTP: <strong className="text-orange-300 font-mono">{linkedHiring.completionOtp}</strong>
              </span>
            )}
            <button
              onClick={() => {
                const res = releaseEscrowPayment(linkedHiring.id, 5);
                setReleaseSuccessMsg(res.message);
                setTimeout(() => setReleaseSuccessMsg(''), 4000);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Kaam Done (Release ₹{linkedHiring.amount})</span>
            </button>
          </div>
        </div>
      )}

      {/* Release Success Banner */}
      {releaseSuccessMsg && (
        <div className="bg-emerald-600 text-white text-xs font-bold p-2.5 text-center flex items-center justify-center gap-1.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{releaseSuccessMsg}</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/50">
        <div className="text-center my-1">
          <span className="bg-stone-200/60 text-stone-600 text-[10px] font-semibold px-2.5 py-1 rounded-full">
            Dihadi Surakshit Chat (No Advance Payments)
          </span>
        </div>

        {activeMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed font-medium shadow-2xs ${
                  isMe
                    ? 'bg-orange-600 text-white rounded-tr-xs'
                    : 'bg-white text-stone-900 border border-stone-200/80 rounded-tl-xs'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-[9px] text-stone-400 px-1">
                <span>{msg.timestamp}</span>
                {isMe && <CheckCheck className="w-3 h-3 text-orange-500" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Replies Carousel */}
      <div className="bg-white border-t border-stone-100 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-stone-400 flex items-center gap-0.5 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-amber-500" /> Quick:
        </span>
        {quickReplies.map((reply) => (
          <button
            key={reply}
            onClick={() => handleQuickReply(reply)}
            className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-orange-50 text-stone-700 hover:text-orange-700 text-[11px] font-medium whitespace-nowrap border border-stone-200/60 transition"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Apna sandesh likhein (Type message)..."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-100 text-xs font-semibold text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-200"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-md active:scale-95 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
