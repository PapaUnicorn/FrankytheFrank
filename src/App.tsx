import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Mic, 
  MoreVertical, 
  Search, 
  Phone, 
  Video, 
  CheckCheck, 
  Trash2,
  Lock,
  Flame
} from 'lucide-react';

interface ChatMessageItem {
  id: string;
  sender: 'user' | 'franky';
  text: string;
  time: string;
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [userClaimsLedger, setUserClaimsLedger] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: currentTime,
    };

    const nextLedger = [...userClaimsLedger, trimmed];
    const nextMessages = [...messages, userMsg];

    setMessages(nextMessages);
    setUserClaimsLedger(nextLedger);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          topic: nextLedger[0] || trimmed,
          history: nextMessages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
          userClaimsHistory: nextLedger,
          mode: 'pure_inquisitor',
          language: 'id',
        }),
      });

      const json = await res.json();
      const botText =
        json.data?.reply ||
        json.data?.rebuttal ||
        (json.data?.rhetoricalTrap
          ? `${json.data.rebuttal}\n\n${json.data.rhetoricalTrap}`
          : 'Argumen Anda sama sekali tidak memiliki dasar logika yang kokoh.');

      const frankyMsg: ChatMessageItem = {
        id: `franky-${Date.now()}`,
        sender: 'franky',
        text: botText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, frankyMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessageItem = {
        id: `franky-${Date.now()}`,
        sender: 'franky',
        text: 'Koneksi jaringan Anda rupanya sama rapuhnya dengan fondasi argumen Anda. Coba ulangi lagi.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setUserClaimsLedger([]);
    setShowMenu(false);
  };

  return (
    <div className="h-screen w-screen bg-[#0b141a] flex justify-center items-center overflow-hidden">
      {/* WhatsApp Window Container */}
      <div className="w-full h-full max-w-4xl flex flex-col bg-[#0b141a] border-x border-[#202c33]/40 shadow-2xl overflow-hidden relative">
        
        {/* WhatsApp Top Header Bar */}
        <header className="h-15 bg-[#202c33] px-4 flex items-center justify-between border-b border-[#2a3942] z-20 shrink-0">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-950 via-stone-800 to-black border border-red-700/50 flex items-center justify-center text-white font-bold shadow">
                <Flame className="w-5 h-5 text-red-500 fill-red-500" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00a884] border-2 border-[#202c33]" />
            </div>

            {/* Contact Details */}
            <div className="flex flex-col">
              <span className="text-[#e9edef] font-medium text-base leading-tight">
                Franky the Frank
              </span>
              <span className="text-xs text-[#8696a0] leading-tight mt-0.5">
                {isLoading ? (
                  <span className="text-[#00a884] font-medium animate-pulse">sedang mengetik...</span>
                ) : (
                  'online'
                )}
              </span>
            </div>
          </div>

          {/* Right Header Action Icons */}
          <div className="flex items-center gap-4 text-[#aebac1]">
            <button className="p-1 hover:text-[#e9edef] transition-colors" title="Video call">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-1 hover:text-[#e9edef] transition-colors" title="Voice call">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-1 hover:text-[#e9edef] transition-colors" title="Cari">
              <Search className="w-5 h-5" />
            </button>
            
            {/* 3 dots menu */}
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:text-[#e9edef] transition-colors"
                title="Menu"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-8 w-44 bg-[#233138] border border-[#2a3942] rounded-md shadow-xl py-1 text-sm text-[#d1d7db] z-30">
                  <button
                    onClick={handleClearChat}
                    className="w-full text-left px-4 py-2 hover:bg-[#182229] flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Bersihkan chat</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Chat Area Wallpaper */}
        <main 
          onClick={() => setShowMenu(false)}
          className="flex-1 overflow-y-auto px-4 md:px-8 py-3 space-y-3 wa-wallpaper"
        >
          {/* Date pill */}
          <div className="flex justify-center my-2">
            <span className="bg-[#182229] text-[#8696a0] text-xs px-3 py-1 rounded-md shadow-sm uppercase tracking-wider font-medium">
              HARI INI
            </span>
          </div>

          {/* WhatsApp Security Encryption pill */}
          <div className="flex justify-center mb-4">
            <div className="max-w-md bg-[#182229]/95 text-[#ffd279] text-xs px-3.5 py-2 rounded-lg text-center shadow-sm flex items-center justify-center gap-2 border border-[#ffd279]/15">
              <Lock className="w-3.5 h-3.5 shrink-0 text-[#ffd279]" />
              <span className="leading-snug">
                Pesan ini didebat secara langsung oleh <strong>Franky the Frank</strong>.
              </span>
            </div>
          </div>

          {/* Messages */}
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[70%] px-3 py-2 rounded-lg shadow-sm text-sm relative break-words whitespace-pre-wrap ${
                    isUser
                      ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                      : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
                  }`}
                >
                  <div className="leading-relaxed pr-14 text-[14.5px]">
                    {m.text}
                  </div>
                  
                  {/* Timestamp & checkmark bottom-right */}
                  <div className="absolute right-2 bottom-1.5 flex items-center gap-1 text-[11px] text-[#8696a0] select-none">
                    <span>{m.time}</span>
                    {isUser && (
                      <CheckCheck className="w-4 h-4 text-[#53bdeb]" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Franky typing bubble */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] px-3.5 py-2.5 rounded-lg rounded-tl-none shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#8696a0] animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 rounded-full bg-[#8696a0] animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 rounded-full bg-[#8696a0] animate-bounce" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* WhatsApp Bottom Input Bar */}
        <footer className="bg-[#202c33] px-3 py-2 flex items-center gap-2 z-20 shrink-0">
          {/* Emoji icon */}
          <button 
            type="button" 
            className="p-1.5 text-[#8696a0] hover:text-[#d1d7db] transition-colors"
            title="Emoji"
          >
            <Smile className="w-6 h-6" />
          </button>

          {/* Attach icon */}
          <button 
            type="button" 
            className="p-1.5 text-[#8696a0] hover:text-[#d1d7db] transition-colors"
            title="Lampirkan"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text input field */}
          <div className="flex-1 bg-[#2a3942] rounded-lg px-3.5 py-2 flex items-center">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ketik pesan..."
              className="w-full bg-transparent text-[#d1d7db] placeholder-[#8696a0] text-sm resize-none focus:outline-none max-h-28 overflow-y-auto leading-relaxed"
            />
          </div>

          {/* Send Button or Mic */}
          {input.trim() ? (
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#029070] text-white flex items-center justify-center shadow transition-all active:scale-95 disabled:opacity-50"
              title="Kirim pesan"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          ) : (
            <button 
              type="button" 
              className="p-2 text-[#8696a0] hover:text-[#d1d7db] transition-colors"
              title="Pesan suara"
            >
              <Mic className="w-6 h-6" />
            </button>
          )}
        </footer>

      </div>
    </div>
  );
}
