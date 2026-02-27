import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MetricCard from '../components/MetricCard';
import ReportGenerator from '../components/ReportGenerator';
import GapAnalysisCard from '../components/GapAnalysisCard';
import AnalyticsChart from '../components/AnalyticsChart';
import { Target, CheckCircle, Award, Plus, Share2, Check } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import StreakBanner from '../components/StreakBanner';

const Dashboard = () => {
    const { dashboardMetrics, profile, session, achievements } = useGlobalState();
    const navigate = useNavigate();
    const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
    const [copiedLink, setCopiedLink] = useState(false);

    const handleSharePortfolio = () => {
        const url = `${window.location.origin}/p/${session?.user?.id}`;
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
    };

    const currentData = dashboardMetrics[selectedYear] || { impactScore: 0, completionRate: '0%', awards: 0 };
    const displayName = profile?.full_name || 'New User';
    const displayTitle = profile?.target_role || 'Welcome to your portfolio';
    const displayGoal = profile?.target_goal ? ` • Target: ${profile.target_goal}` : '';

    const recentAchievements = achievements
        .filter(a => new Date(a.date).getFullYear() === parseInt(selectedYear))
        .slice(0, 3);

    return (
        <div className="page-container">
            <StreakBanner />
            <Header
                name={displayName}
                title={`${displayTitle}${displayGoal}`}
                year={selectedYear}
                onYearChange={setSelectedYear}
                avatarUrl={profile?.avatar_url}
            />

            {/* Two-column grid on desktop: left = actions, right = analytics */}
            <div className="dashboard-grid">
                {/* Left Column */}
                <div className="dashboard-left flex-col" style={{ gap: 'var(--space-6)' }}>
                    {/* Metric Cards — 3-col on md */}
                    <div className="grid-3">
                        <MetricCard title="Impact Score" value={currentData.impactScore} icon={Target} color="var(--color-accent)" />
                        <MetricCard title="Completion" value={currentData.completionRate} icon={CheckCircle} color="var(--color-primary)" />
                        <MetricCard title="Awards" value={currentData.awards} icon={Award} color="#3b82f6" />
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex-col" style={{ gap: 'var(--space-3)' }}>
                        <button className="btn-primary btn-full-width" style={{ padding: 'var(--space-4)' }} onClick={() => navigate('/log')}>
                            <Plus size={20} />
                            Log Achievement
                        </button>
                        <button
                            onClick={handleSharePortfolio}
                            style={{
                                width: '100%', padding: 'var(--space-3)',
                                backgroundColor: 'transparent', border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius-md)', color: copiedLink ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s'
                            }}
                        >
                            {copiedLink ? <Check size={16} /> : <Share2 size={16} />}
                            {copiedLink ? 'Portfolio Link Copied!' : 'Share My Portfolio'}
                        </button>
                        <ReportGenerator year={selectedYear} />
                    </div>

                    {/* Recent Highlights */}
                    <div className="flex-col gap-4">
                        <h2 className="text-lg font-semibold">Recent Highlights</h2>
                        {recentAchievements.length > 0 ? (
                            recentAchievements.map(a => (
                                <div key={a.id} className="card flex-col gap-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{a.category}</span>
                                        <span className="text-muted">{a.display_date || a.date}</span>
                                    </div>
                                    <p className="text-sm">{a.title}</p>
                                </div>
                            ))
                        ) : (
                            <div className="card text-center text-muted" style={{ padding: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
                                No achievements logged for {selectedYear} yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column — analytics */}
                <div className="dashboard-right flex-col" style={{ gap: 'var(--space-6)' }}>
                    <GapAnalysisCard year={selectedYear} />
                    <AnalyticsChart year={selectedYear} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
