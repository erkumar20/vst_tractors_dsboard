import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Download, FileText, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import avatarImg from '../../assets/505de5ebbef16a3159273a63c54957dba1747b68.png';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  chart?: any;
  download_url?: string;
  xlsx_path?: string;
  pdf_path?: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your VST Analytics Assistant. I can analyze metrics, generate charts, and provide reports. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("vst_recent_queries_small");
    if (saved) setRecentQueries(JSON.parse(saved));
  }, []);

  const saveQuery = (query: string) => {
    setRecentQueries(prev => {
      const filtered = prev.filter(q => q !== query);
      const updated = [query, ...filtered].slice(0, 3);
      localStorage.setItem("vst_recent_queries_small", JSON.stringify(updated));
      return updated;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (overrideQuery?: string) => {
    const activeInput = overrideQuery || inputValue;
    if (!activeInput.trim()) return;

    saveQuery(activeInput);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: activeInput,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: activeInput }),
      });
      // ... rest of handleSendMessage logic ...

      if (!response.ok) throw new Error('Backend error');

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I couldn't process that. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
        chart: data.chart,
        download_url: data.download_url,
        xlsx_path: data.xlsx_path
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      toast.error("AI Assistant is offline.");
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'm having trouble connecting to the analytics engine. Please ensure the backend server is running on ${import.meta.env.VITE_API_BASE_URL}.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderChart = (chartData: any) => {
    if (!chartData || !chartData.labels || !chartData.datasets) return null;

    const formattedData = chartData.labels.map((label: string, index: number) => {
      const entry: any = { name: label };
      chartData.datasets.forEach((ds: any) => {
        entry[ds.label] = ds.data[index];
      });
      return entry;
    });

    const colors = ["#006847", "#f59e0b", "#3b82f6"];

    return (
      <div className="mt-3 p-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" fontSize={8} axisLine={false} tickLine={false} />
            <YAxis fontSize={8} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
            {chartData.datasets.map((ds: any, idx: number) => (
              <Line
                key={ds.label}
                type="monotone"
                dataKey={ds.label}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderFileAction = (msg: Message) => {
    let url = "";
    if (msg.xlsx_path) {
      url = `${import.meta.env.VITE_API_BASE_URL}/api/reports/download-excel?path=${encodeURIComponent(msg.xlsx_path)}`;
    } else if (msg.pdf_path) {
      url = `${import.meta.env.VITE_API_BASE_URL}/api/reports/download?path=${encodeURIComponent(msg.pdf_path)}`;
    } else if (msg.download_url) {
      const base = msg.download_url.startsWith('http') ? '' : import.meta.env.VITE_API_BASE_URL;
      url = `${base}${msg.download_url}`;
    }

    if (!url) return null;

    return (
      <div className="mt-3 p-3 bg-[#006847]/5 border border-[#006847]/10 rounded-xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-[#006847] shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-gray-900 truncate">Report Ready</p>
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-tighter">Excel Export</p>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-[#006847] hover:bg-[#005538] text-white h-7 px-2 text-[10px] rounded-lg"
          onClick={() => window.open(url, '_blank')}
        >
          <Download className="w-3 h-3 mr-1" />
          Get File
        </Button>
      </div>
    );
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none border-4 border-white overflow-hidden group"
        >
          <img
            src={avatarImg}
            alt="AI Assistant"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=AI&background=006847&color=fff";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#006847]/40 to-transparent"></div>
          <div className="absolute bottom-1 w-full text-center">
            <span className="text-[8px] text-white font-black uppercase tracking-widest leading-none shadow-sm">AI Active</span>
          </div>
        </button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[600px] shadow-2xl flex flex-col overflow-hidden border-none rounded-3xl animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="bg-gradient-to-br from-[#006847] to-[#005538] text-white p-6 flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                <img
                  src={avatarImg}
                  alt="AI Assistant"
                  className="w-12 h-12 rounded-2xl border-2 border-white/20 object-cover shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=AI&background=006847&color=fff";
                  }}
                />
                <span className="absolute bottom-[-2px] right-[-2px] w-3.5 h-3.5 bg-emerald-400 border-2 border-[#006847] rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">VarnuevedAI</h3>
                <p className="text-[10px] text-green-100 font-bold uppercase tracking-widest opacity-80">Intelligence Hub • v1.4</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${message.sender === 'user' ? 'bg-[#006847] text-white' : 'bg-white border border-gray-200'
                  }`}>
                  {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[#006847]" />}
                </div>
                <div className={`max-w-[85%] space-y-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm border ${message.sender === 'user'
                      ? 'bg-[#006847] text-white border-transparent rounded-tr-none'
                      : 'bg-white text-gray-800 border-gray-100 rounded-tl-none [&_table]:my-2 [&_table]:border-collapse [&_th]:bg-gray-50 [&_th]:p-1.5 [&_td]:p-1.5 [&_th]:border [&_td]:border [&_th]:text-[10px] [&_td]:text-[10px]'
                      }`}
                  >
                    <p className="whitespace-pre-line font-medium">{message.text}</p>
                    {message.sender === 'ai' && message.chart && renderChart(message.chart)}
                    {message.sender === 'ai' && (message.download_url || message.xlsx_path) && renderFileAction(message)}
                  </div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter px-1 opacity-60">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#006847]" />
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  {[0, 150, 300].map((delay) => (
                    <span key={delay} className="w-1.5 h-1.5 bg-[#006847]/40 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }}></span>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex-none space-y-3">
            {recentQueries.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-2 px-2">
                {recentQueries.map((q, idx) => (
                  <button
                    key={`${q}-${idx}`}
                    onClick={() => handleSendMessage(q)}
                    className="whitespace-nowrap px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] text-gray-500 hover:text-[#006847] hover:bg-green-50 transition-colors shrink-0 font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Ask intelligence..."
                className="flex-1 pl-4 pr-12 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#006847]/20 focus:bg-white text-[13px] font-medium transition-all"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-1 top-1 bottom-1 bg-[#006847] hover:bg-[#005538] text-white rounded-xl aspect-square p-0 shadow-lg shadow-green-900/10 transition-transform active:scale-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}