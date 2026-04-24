import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const [loading, setLoading] = useState(false);
    const { signup, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user) {
            navigate('/');
        }
    }, [user, authLoading, navigate]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signup(email, password, name);
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
                    <h1 className="text-3xl font-bold text-white mb-2 neon-text-purple">
                        Join ToolStash
                    </h1>
                    <p className="text-text-secondary">Start your collection today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm text-center">{error}</div>}
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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
                        placeholder="Min 6 chars"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        className="w-full bg-neon-purple hover:bg-purple-600 hover:shadow-glow-purple"
                        size="lg"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up Free'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="text-neon-purple hover:text-purple-400 transition-colors">
                        Log in
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
