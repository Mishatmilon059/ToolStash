import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const { login, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user) {
            navigate('/');
        }
    }, [user, authLoading, navigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, password);
        if (!result.success) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[url('/grid.svg')] bg-center bg-fixed">
            <div className="absolute inset-0 bg-bg-dark/90 backdrop-blur-sm pointer-events-none" />

            <div className="relative w-full max-w-md p-8 rounded-2xl bg-bg-card border border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 neon-text-cyan">
                        Welcome Back
                    </h1>
                    <p className="text-text-secondary">Log into your ToolStash account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm text-center">{error}</div>}
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        className="w-full bg-neon-cyan hover:bg-cyan-500 hover:shadow-glow-cyan"
                        size="lg"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Log In'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-text-secondary">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-neon-cyan hover:text-cyan-400 transition-colors">
                        Sign up
                    </Link>
                </div>

                <div className="mt-4 text-center">
                    <Link to="/welcome" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
