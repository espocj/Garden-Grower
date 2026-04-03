"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Leaf } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(error ? error.message : "Success! You can now sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#c4b396] p-4">
      <div className="max-w-md w-full bg-[#1c1a14]/95 backdrop-blur-md border border-[#7a9a6e]/30 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#3e2723] flex items-center justify-center shadow-md mb-4 border border-[#7a9a6e]/20">
            <Leaf className="w-6 h-6 text-[#94a77e]" />
          </div>
          <h1 className="font-display text-2xl text-[#f5f2e9]">Bedford Station</h1>
          <p className="font-mono text-xs text-[#7a9a6e] uppercase tracking-widest mt-2">Garden Tracker</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-[#7a9a6e] uppercase tracking-widest mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-[#7a9a6e]/30 rounded-lg px-4 py-3 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635] transition-colors"
              placeholder="gardener@example.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-[#7a9a6e] uppercase tracking-widest mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-[#7a9a6e]/30 rounded-lg px-4 py-3 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div className="text-center font-mono text-xs p-2 rounded bg-black/20 text-[#d4c49a] border border-[#d4c49a]/20">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-[#1c1a14] bg-[#7a9a6e] hover:bg-[#a3e635] transition-colors shadow-lg mt-4 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-mono text-[#7a9a6e] hover:text-[#f5f2e9] transition-colors"
          >
            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
