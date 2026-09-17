import { useState } from 'react';
import { Palette, Lock, Mail, User, ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type AdminLoginProps = {
  onSuccess: () => void;
  onBack: () => void;
};

export function AdminLogin({ onSuccess, onBack }: AdminLoginProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        // After signup, sign in immediately (email confirmation is off)
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onSuccess();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onSuccess();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      if (msg.includes('Invalid login credentials')) {
        setError('Wrong email or password. If you haven\'t created an account yet, switch to Sign Up.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-11 pr-4 py-3 rounded-xl bg-cream-50 border border-cream-300 text-charcoal-800 placeholder-charcoal-400 outline-none focus:ring-2 focus:ring-blush-300 focus:border-blush-300 transition-all';

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-800 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to website
        </button>

        <div className="bg-cream-50 rounded-3xl p-8 shadow-sm border border-cream-200">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-blush-500 flex items-center justify-center mx-auto mb-4">
              <Palette className="w-7 h-7 text-cream-50" />
            </div>
            <h1 className="font-serif text-2xl font-medium text-charcoal-900">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-charcoal-500 mt-2">
              {mode === 'signin'
                ? 'Sign in to manage your gallery'
                : 'Set up your artist account to get started'}
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-blush-50 text-blush-600 text-sm mb-5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-blush-500 text-cream-50 font-medium hover:bg-blush-600 transition-colors shadow-md disabled:opacity-60"
            >
              <User className="w-4 h-4" />
              {loading
                ? 'Please wait...'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="text-sm text-charcoal-500 hover:text-charcoal-800 transition-colors"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
