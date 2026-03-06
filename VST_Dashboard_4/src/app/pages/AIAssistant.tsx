import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, ChevronRight, FileText, BarChart3, Clock, Sparkles, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  chart?: any;
  xlsx_path?: string;
  pdf_path?: string;
  download_url?: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to the **VarnuevedAI Analytics Hub**. I have successfully loaded your supply chain dataset. You can ask me to summarize performance, compare suppliers, or generate trend reports. What can I analyze for you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [queryInput, setQueryInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("vst_recent_queries");
    if (saved) setRecentQueries(JSON.parse(saved));
  }, []);

  const saveQuery = (query: string) => {
    setRecentQueries(prev => {
      const filtered = prev.filter(q => q !== query);
      const updated = [query, ...filtered].slice(0, 5);
      localStorage.setItem("vst_recent_queries", JSON.stringify(updated));
      return updated;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (overrideQuery?: string) => {
    const activeQuery = overrideQuery || queryInput;
    if (!activeQuery.trim()) return;

    saveQuery(activeQuery);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: activeQuery,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQueryInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: activeQuery }),
      });
      // ... rest of handleSendMessage logic ...

      if (!response.ok) throw new Error('Backend error');

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I couldn't process that query. Please try rephrasing.",
        sender: 'ai',
        timestamp: new Date(),
        chart: data.chart,
        xlsx_path: data.xlsx_path,
        pdf_path: data.pdf_path,
        download_url: data.download_url
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      toast.error("AI Assistant is offline. Please check the backend.");
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `🚨 **Connection Error**: I cannot reach the backend analytics server. Please ensure the Python server is running on ${import.meta.env.VITE_API_BASE_URL}.`,
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

    // Transform chart data for recharts
    const formattedData = chartData.labels.map((label: string, index: number) => {
      const entry: any = { name: label };
      chartData.datasets.forEach((ds: any) => {
        entry[ds.label] = ds.data[index];
      });
      return entry;
    });

    const colors = ["#006847", "#f59e0b", "#3b82f6", "#ef4444"];

    return (
      <Card className="mt-4 p-4 border border-gray-100 bg-white">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              fontSize={10}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              fontSize={10}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            {chartData.datasets.map((ds: any, idx: number) => (
              <Line
                key={ds.label}
                type="monotone"
                dataKey={ds.label}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>
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
      <div className="mt-4 p-4 bg-[#006847]/5 border border-[#006847]/10 rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5 text-[#006847]" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-gray-900">Report Generated</h5>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Excel Spreadsheet • Ready for download</p>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-[#006847] hover:bg-[#005538] text-white gap-2 h-9 px-4 rounded-lg shadow-md"
          onClick={() => window.open(url, '_blank')}
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden flex flex-col font-sans bg-gray-50/50">
      <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] h-full w-full overflow-hidden">
        {/* Sidebar Info - Scrollable if content exceeds */}
        <div className="hidden lg:flex flex-col p-6 pr-0 gap-6 overflow-hidden">
          <Card className="p-6 bg-[#006847] text-white overflow-hidden relative border-none shadow-xl shrink-0">
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-40 animate-pulse" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-green-300" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">VarnuevedAI</h2>
              </div>
              <p className="text-green-50 text-[11px] leading-relaxed opacity-80 font-medium">
                Your intelligent companion for multi-dimensional supply chain analysis.
              </p>
            </div>
          </Card>

          <div className="flex-1 space-y-6 overflow-y-auto pr-6 no-scrollbar pb-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <BarChart3 className="w-3 h-3" />
                Analysis Presets
              </h4>
              <div className="space-y-2">
                {[
                  "Show trend of PO Price over time",
                  "Give me the excel sheet for V.R. Foundries",
                  "Top 5 suppliers by accepted qty",
                  "Compare rejection reason vs quantity"
                ].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleSendMessage(cmd)}
                    className="w-full text-left p-4 rounded-2xl border border-gray-100 bg-white hover:border-[#006847]/40 hover:bg-green-50/50 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
                  >
                    <span className="text-[12px] text-gray-600 group-hover:text-gray-900 font-bold leading-tight line-clamp-2">{cmd}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#006847] shrink-0 translate-x-1 group-hover:translate-x-2 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {recentQueries.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Recent Questions
                </h4>
                <div className="space-y-2">
                  {recentQueries.map((q, idx) => (
                    <button
                      key={`${q}-${idx}`}
                      onClick={() => handleSendMessage(q)}
                      className="w-full text-left p-4 rounded-2xl border border-dashed border-gray-200 bg-white/50 hover:border-[#006847]/40 hover:bg-green-50/50 transition-all flex items-center justify-between group shadow-sm"
                    >
                      <span className="text-[12px] text-gray-500 group-hover:text-gray-900 font-bold line-clamp-1">{q}</span>
                      <Clock className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#006847] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex flex-col flex-1 h-full min-w-0 bg-white shadow-2xl overflow-hidden relative border-l border-gray-100">

          {/* Header */}
          <div className="p-5 lg:p-7 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 flex-none">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#006847]/10 rounded-2xl flex items-center justify-center border border-[#006847]/5">
                <Bot className="w-7 h-7 text-[#006847]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Intelligence Hub</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.1em]">Engine Active • V1.4.2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Canvas */}
          <div className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-8 bg-gray-50/40">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-[#006847] text-white' : 'bg-white border border-gray-200'
                  }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5 text-[#006847]" />}
                </div>
                <div className={`max-w-[90%] lg:max-w-[80%] space-y-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-5 rounded-2xl text-[14px] leading-[1.6] shadow-md border ${msg.sender === 'user'
                    ? 'bg-[#006847] text-white border-transparent rounded-tr-none'
                    : 'bg-white border-gray-100 text-gray-800 rounded-tl-none [&_table]:my-4 [&_table]:border-collapse [&_th]:bg-gray-50 [&_th]:p-2 [&_td]:p-2 [&_th]:border [&_td]:border [&_th]:text-[12px] [&_td]:text-[12px]'
                    }`}>
                    <p className="whitespace-pre-line font-medium">{msg.text}</p>

                    {/* Render Chart if available */}
                    {msg.sender === 'ai' && msg.chart && renderChart(msg.chart)}

                    {/* Render File Action if available */}
                    {msg.sender === 'ai' && (msg.xlsx_path || msg.pdf_path || msg.download_url) && renderFileAction(msg)}
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2 justify-end px-1">
                    <Clock className="w-2.5 h-2.5" />
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-[#006847]" />
                </div>
                <div className="bg-white border border-gray-100 p-5 rounded-2xl rounded-tl-none shadow-md flex gap-1.5 items-center">
                  {[0, 150, 300].map((delay) => (
                    <span key={delay} className="w-2 h-2 bg-[#006847] rounded-full animate-bounce opacity-40" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 lg:p-8 bg-white border-t border-gray-100 flex-none relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-30 pointer-events-none" />
            <div className="max-w-4xl mx-auto relative z-10 space-y-4">

              {/* Quick Suggestion Bar */}
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {/* Always show presets if no history, or merge them */}
                {([...recentQueries, "Summary", "Top Suppliers", "Excel Report"]).slice(0, 10).map((q, idx) => (
                  <button
                    key={`${q}-${idx}`}
                    onClick={() => handleSendMessage(q)}
                    className="whitespace-nowrap px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[11px] text-gray-500 hover:text-[#006847] hover:bg-green-50 hover:border-[#006847]/30 transition-all shadow-sm font-bold flex items-center gap-2 group shrink-0"
                  >
                    <Sparkles className="w-3 h-3 text-[#006847]/40 group-hover:text-[#006847]" />
                    {q}
                  </button>
                ))}
              </div>

              <div className="relative group shadow-2xl rounded-2xl">
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                  placeholder="Analyze metrics, compare suppliers, or generate reports..."
                  className="w-full pl-7 pr-20 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#006847]/10 focus:border-[#006847]/40 focus:bg-white transition-all text-sm font-medium"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!queryInput.trim() || isTyping}
                    size="icon"
                    className="h-12 w-12 bg-[#006847] hover:bg-[#005538] text-white rounded-xl shadow-xl shadow-green-900/20 transition-all hover:scale-105 active:scale-95 disabled:grayscale"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-center text-gray-400 mt-5 font-black uppercase tracking-[0.2em] opacity-60">
              VarnuevedAI Analytics • Secure Engine v1.4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}