import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useGlobalState } from '../context/GlobalStateContext';

const AnalyticsChart = ({ year }) => {
    const { achievements } = useGlobalState();

    // Filter achievements by selected year
    const yearAchievements = achievements.filter(ach =>
        new Date(ach.date).getFullYear().toString() === year
    );

    // Aggregate by category
    const categoryCounts = yearAchievements.reduce((acc, ach) => {
        acc[ach.category] = (acc[ach.category] || 0) + 1;
        return acc;
    }, {});

    const data = Object.keys(categoryCounts).map(key => ({
        name: key,
        count: categoryCounts[key]
    }));

    // Beautiful colors for the chart
    const colors = ['var(--color-primary)', 'var(--color-accent)', '#3b82f6', '#f59e0b', '#10b981'];

    return (
        <div className="card flex-col gap-4">
            <h2 className="text-lg font-semibold">Achievements by Category</h2>
            {data.length > 0 ? (
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip
                                cursor={{ fill: 'var(--color-surface-hover)' }}
                                contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)' }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex items-center justify-center text-muted text-sm" style={{ height: 200, backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)' }}>
                    No data to display securely for {year}.
                </div>
            )}
        </div>
    );
};

export default AnalyticsChart;
