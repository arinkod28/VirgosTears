import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useId, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const GLSLHills = dynamic(
  () => import('../components/ui/glsl-hills').then((m) => ({ default: m.GLSLHills })),
  { ssr: false }
);

const CursorDrivenParticleTypography = dynamic(
  () => import('../components/ui/cursor-driven-particles-typography').then((m) => ({ default: m.CursorDrivenParticleTypography })),
  { ssr: false }
);

const PASSWORD = 'flipstingray';

export default function LoginPage() {
  const router = useRouter();
  const id = useId();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (password === PASSWORD) {
      setLoading(true);
      localStorage.setItem('cmmc_authed', 'true');
      await router.push('/');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden"
      style={{ background: '#05080f' }}
    >
      {/* Animated GLSL hills background */}
      <div className="absolute inset-0 z-0">
        <GLSLHills />
      </div>

      {/* Subtle vignette overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(5,8,15,0.7) 100%)',
        }}
      />

      {/* Login card */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg mb-12">
          {/* AuditX Particle Typography */}
          <div className="h-48">
            <CursorDrivenParticleTypography
              text="AuditX"
              fontSize={140}
              particleDensity={5}
              dispersionStrength={20}
              color="#60a5fa"
            />
          </div>
        </div>
        
        <div className="w-full max-w-sm">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <span
              className="rounded-full border px-3 py-1 text-xs font-semibold tracking-widest uppercase"
              style={{
                borderColor: 'rgba(59,130,246,0.4)',
                color: '#60a5fa',
                background: 'rgba(59,130,246,0.08)',
              }}
            >
              CMMC 2.0
            </span>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8 space-y-8"
            style={{
              background: 'rgba(10, 15, 30, 0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Compliance Dashboard
              </h1>
              <p className="text-sm" style={{ color: '#94a3b8' }}>
                Enter your access password to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor={id} className="text-slate-300">
                  Password
                </Label>
                <Input
                  id={id}
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  autoFocus
                  autoComplete="current-password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                />
                {error && (
                  <p className="text-sm" style={{ color: '#f87171' }}>
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={loading || password.length === 0}
              >
                {loading ? 'Unlocking…' : 'Unlock Access'}
              </Button>
            </form>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs" style={{ color: '#475569' }}>
            Microsoft Azure · 6 CMMC Level 2 Controls
          </p>
        </div>
      </div>
    </div>
  );
}
