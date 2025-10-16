"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = 'http://10.145.228.129:8000/api';

export default function LoginForm() {
  const [id, setId] = useState("");
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the new authentication endpoint
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }), // Send just the user ID
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // On successful login, save user info and token to local storage
      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('userId', data.id);
      localStorage.setItem('loggedIn', 'true');

      router.push('/');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
            placeholder="e.g., rohit.shah or anita.p."
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full"
            required
          />
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={isLoading || !id.trim()}
          className="w-full btn-accent rounded-lg py-3 text-sm font-bold transition-opacity"
        >
          {isLoading ? 'Logging In...' : 'Login'}
        </button>
      </form>
    </div>
  );
}