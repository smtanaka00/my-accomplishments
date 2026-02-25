import React, { useState, useEffect } from 'react';
import { Globe, Lock, FileText, Image as ImageIcon, ExternalLink, Copy, Check } from 'lucide-react';
import { supabase } from '../supabase';
import { useParams } from 'react-router-dom';

const PublicPortfolio = () => {
    const { userId } = useParams();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchPublicAchievements = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .eq('user_id', userId)
                .eq('is_public', true)
                .order('date', { ascending: false });

            if (error) {
                setError('This portfolio could not be found or has no public achievements.');
            } else {
                setAchievements(data || []);
            }
            setLoading(false);
        };

        if (userId) {
            fetchPublicAchievements();
        } else {
            setError('No portfolio ID provided.');
            setLoading(false);
        }
    }, [userId]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const categoryColor = (category) => {
        switch (category) {
            case 'Award': return 'var(--color-accent)';
            case 'Leadership': return '#3b82f6';
            case 'Publication': return 'var(--color-primary)';
            default: return 'var(--color-text-muted)';
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--color-text-muted)' }}>
                Loading portfolio...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '16px', padding: '32px', textAlign: 'center' }}>
                <Lock size={40} color="var(--color-text-muted)" />
                <h1 style={{ fontSize: '1.3rem', fontWeight: '600' }}>Portfolio Not Found</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px 48px', fontFamily: 'inherit' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
                    color: 'white', fontSize: '1.5rem', fontWeight: 'bold'
                }}>
                    ★
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>Professional Portfolio</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Globe size={14} /> Public achievements
                </p>
                <button
                    onClick={handleCopyLink}
                    style={{
                        marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '8px 16px', borderRadius: 'var(--border-radius-full)',
                        border: '1px solid var(--color-border)', fontSize: '13px',
                        color: 'var(--color-text-muted)', cursor: 'pointer', backgroundColor: 'transparent'
                    }}
                >
                    {copied ? <Check size={14} color="var(--color-primary)" /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                </button>
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                <div style={{ flex: 1, textAlign: 'center', padding: '16px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-primary)' }}>{achievements.length}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Achievements</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '16px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                        {achievements.filter(a => a.category === 'Award').length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Awards</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '16px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#3b82f6' }}>
                        {[...new Set(achievements.map(a => new Date(a.date).getFullYear()))].length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Years</div>
                </div>
            </div>

            {/* Achievements Timeline */}
            {achievements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                    No public achievements yet.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {achievements.map((ach, idx) => (
                        <div key={ach.id || idx} style={{
                            padding: '16px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)',
                            borderLeft: `3px solid ${categoryColor(ach.category)}`
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                                <span style={{
                                    fontSize: '12px', fontWeight: '600', color: categoryColor(ach.category),
                                    padding: '2px 8px', borderRadius: '999px', backgroundColor: `${categoryColor(ach.category)}22`
                                }}>
                                    {ach.category}
                                </span>
                                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{ach.display_date || ach.displayDate}</span>
                            </div>
                            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px', lineHeight: '1.3' }}>{ach.title}</h3>
                            {ach.impact && <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>{ach.impact}</p>}
                            {ach.tag && (
                                <div style={{ marginTop: '8px' }}>
                                    <span style={{
                                        fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
                                        border: '1px solid var(--color-border)', color: 'var(--color-text-muted)'
                                    }}>
                                        {ach.tag}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '48px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Powered by <strong style={{ color: 'var(--color-primary)' }}>My Achievements</strong>
            </div>
        </div>
    );
};

export default PublicPortfolio;
