'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const handleGitHubLogin = async () => {
    await signIn('github', { redirectTo: '/dashboard' });
  };

  const handleGoogleLogin = async () => {
    await signIn('google', { redirectTo: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900">
          GPT Maker Dashboard
        </h1>
        <p className="text-center text-slate-600 mb-8">
          Sign in to your account
        </p>

        <div className="space-y-4">
          <button
            onClick={handleGitHubLogin}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition"
          >
            Sign in with GitHub
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Sign in with Google
          </button>
        </div>

        <p className="text-xs text-slate-500 text-center mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
