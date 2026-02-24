import React, { useState } from 'react';
import Header from '../components/Header';
import MetricCard from '../components/MetricCard';
import { Target, CheckCircle, Award, Plus } from 'lucide-react';

const Dashboard = () => {
    const [selectedYear, setSelectedYear] = useState('2024');

    // Multi-year Mock Data
    const dashboardData = {
        '2024': { impactScore: 88, completionRate: '92%', awards: 4 },
        '2023': { impactScore: 75, completionRate: '85%', awards: 2 },
        '2022': { impactScore: 60, completionRate: '80%', awards: 1 }
    };

    const currentData = dashboardData[selectedYear];

    return (
        <div className="flex-col" style={{ gap: 'var(--space-6)', paddingBottom: 'var(--space-4)' }}>
            <Header
                name="Sarah Jenkins"
                title="Senior Scientist in Drug Manufacturing"
                year={selectedYear}
                onYearChange={setSelectedYear}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <MetricCard title="Overall Impact Score" value={currentData.impactScore} icon={Target} color="var(--color-accent)" />
                </div>
                <MetricCard title="Project Completion" value={currentData.completionRate} icon={CheckCircle} color="var(--color-primary)" />
                <MetricCard title="Certifications/Awards" value={currentData.awards} icon={Award} color="#3b82f6" />
            </div>

            <div style={{ marginTop: 'var(--space-2)' }}>
                <button className="btn-primary" style={{ padding: 'var(--space-4)' }}>
                    <Plus size={20} />
                    Log Achievement
                </button>
            </div>

            {/* Mini Recent Activity Feed - Preview */}
            <div className="flex-col gap-4" style={{ marginTop: 'var(--space-4)' }}>
                <h2 className="text-lg font-semibold">Recent Highlights</h2>
                <div className="card flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                        <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Process Optimization</span>
                        <span className="text-muted">Oct 24</span>
                    </div>
                    <p className="text-sm">Reduced production lead time by 15% via process optimization.</p>
                </div>
                <div className="card flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                        <span style={{ color: 'var(--color-accent)', fontWeight: '600' }}>Award</span>
                        <span className="text-muted">Sep 12</span>
                    </div>
                    <p className="text-sm">Excellence in Regulatory Compliance Award 2024.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
