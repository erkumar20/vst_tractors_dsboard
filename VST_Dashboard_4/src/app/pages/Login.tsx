import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import vstLogo from "figma:asset/84550712db20093bb22b1a7d935d642e734b68db.png";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    // Simulate authentication check
    setTimeout(() => {
      if (email === "vst@varnueai.com" && password === "varnueai@123") {
        setIsLoading(false);
        toast.success("Login successful!");
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        setIsLoading(false);
        toast.error("Invalid email or password");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#006847] to-[#004d35] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden rounded-3xl">
        <div className="p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-gray-100 overflow-hidden">
              <img src={vstLogo} alt="VST Tractors Logo" className="w-20 h-20 object-contain" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
              VST Analytics Hub
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Sign in to access your intelligence dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[#006847] ml-1">
                Business Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006847] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#006847]/10 focus:border-[#006847]/40 focus:bg-white transition-all text-sm font-bold"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-[#006847]">
                  Password
                </label>
                <button type="button" className="text-[10px] font-bold text-gray-400 hover:text-[#006847] transition-colors uppercase tracking-tight">
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006847] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#006847]/10 focus:border-[#006847]/40 focus:bg-white transition-all text-sm font-bold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#006847] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-[#006847] focus:ring-[#006847]" />
              <label htmlFor="remember" className="text-xs font-bold text-gray-500 cursor-pointer select-none">
                Remember this device for 30 days
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#006847] hover:bg-[#005538] text-white py-6 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span className="font-bold">Secure Login</span>
                  <LogIn className="w-5 h-5" />
                </>
              )}
            </Button>

            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                VST Tractors Secure Authentication Service<br />
                © 2024 VST Tillers Tractors Ltd.
              </p>
            </div>
          </form>
        </div>
      </Card>

      {/* Quick Help */}
      <div className="fixed bottom-8 left-0 right-0 text-center">
        <p className="text-[11px] text-white/40 font-bold uppercase tracking-[0.2em]">
          Powered by VarnueAI Business Solutions
        </p>
      </div>
    </div>
  );
}