"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [id, setId] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim()) return;
    
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userId", id);
    router.push("/");
  };

  return (
    <div className="card p-8">
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-muted mb-2">
            User ID
          </label>
          <input
            id="userId"
            type="text"
            placeholder="Enter your user ID (e.g., 'rohit.shah')"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg px-4 py-3 text-[rgb(var(--text))] placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--bg))] focus:ring-[rgb(var(--accent))] transition-shadow"
          />
        </div>
        
        <button
          type="submit"
          disabled={!id.trim()}
          className="w-full btn-accent rounded-lg py-3 text-sm font-bold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Login
        </button>
      </form>
    </div>
  );
}
