import React from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { Flame, Bell } from 'lucide-react';

const StreakBanner = () => {
    const { achievements, profile } = useGlobalState();

    // Calculate days since the most recent achievement
    const lastLogged = profile?.last_logged_date
        ? new Date(profile.last_logged_date)
        : achievements.length > 0
            ? new Date(achievements[0].date)  // achievements are sorted desc
            : null;

    if (!lastLogged) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastLogged.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysSince = Math.floor((today - lastLogged) / msPerDay);

    // Green banner if logged within 30 days, amber nudge if > 30 days
    const isStreak = daysSince <= 30;
    const streakDays = 30 - daysSince;

    if (isStreak) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px',
                backgroundColor: '#10b98120',
                border: '1px solid #10b98150',
                borderRadius: 'var(--border-radius-md)',
                marginBottom: 'var(--space-2)'
            }}>
                <Flame size={18} color="#10b981" style={{ flexShrink: 0 }} />
                <div>
                    <p className="text-sm font-medium" style={{ color: '#10b981' }}>
                        You're on a roll! 🔥
                    </p>
                    <p className="text-xs text-muted">
                        Keep logging — your last entry was {daysSince === 0 ? 'today' : `${daysSince} day${daysSince > 1 ? 's' : ''} ago`}.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px',
            backgroundColor: '#f59e0b20',
            border: '1px solid #f59e0b50',
            borderRadius: 'var(--border-radius-md)',
            marginBottom: 'var(--space-2)'
        }}>
            <Bell size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
            <div>
                <p className="text-sm font-medium" style={{ color: '#f59e0b' }}>
                    Time to log an achievement!
                </p>
                <p className="text-xs text-muted">
                    You haven't logged in {daysSince} days — try to log at least once a month.
                </p>
            </div>
        </div>
    );
};

export default StreakBanner;
