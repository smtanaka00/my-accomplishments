import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Shield, TrendingUp, Award, FileText } from 'lucide-react';

const AUTH_FEATURES = [
    { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and only visible to you.' },
    { icon: TrendingUp, title: 'Track Career Progress', desc: 'Log achievements and watch your impact score grow.' },
    { icon: Award, title: 'Visa-Ready Evidence', desc: 'Automatically organise evidence for EB-2 NIW, O-1, and more.' },
    { icon: FileText, title: 'One-Click Reports', desc: 'Generate professional PDF reports for reviews and petitions.' },
];

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error) {
            setMessage(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Desktop brand panel — hidden on mobile */}
            <div className="auth-brand-panel">
                <div className="auth-brand-logo">My<br />Achievements</div>
                <p className="auth-brand-tagline">
                    Your professional story,<br />
                    built achievement by achievement.
                </p>
                <div className="auth-feature-list">
                    {AUTH_FEATURES.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="auth-feature-item">
                            <div className="auth-feature-icon">
                                <Icon size={18} />
                            </div>
                            <div className="auth-feature-text">
                                <h3>{title}</h3>
                                <p>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Login / signup form */}
            <div className="auth-form-panel">
                <div className="auth-card">
                    <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                    <p className="auth-subtitle">Log in to track your professional achievements</p>

                    <form onSubmit={handleAuth} className="auth-form">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Your password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-primary btn-full-width" disabled={loading}>
                            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
                        </button>
                    </form>

                    {message && <div className="auth-message">{message}</div>}

                    <button className="text-button" onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
