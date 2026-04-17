'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../dash.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('av_auth') === '1') {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (email === 'teste@teste.com' && password === 'bonadioadv') {
        localStorage.setItem('av_auth', '1');
        router.push('/dashboard');
      } else {
        setError('E-mail ou senha incorretos.');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-text">AVESTRA</span>
          <span className="login-logo-sub">Painel de Agentes</span>
        </div>

        <h1 className="login-heading">Bem-vindo de volta</h1>
        <p className="login-sub">Acesse o painel de comando da sua empresa</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="login-spinner" />
            ) : (
              'Entrar no painel →'
            )}
          </button>
        </form>

        <p className="login-footer">
          © 2026 AVESTRA · Dr. Wladmir Bonadio Filho
        </p>
      </div>
    </div>
  );
}
