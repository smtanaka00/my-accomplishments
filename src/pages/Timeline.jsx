import React, { useState } from 'react';
import TimelineEntry from '../components/TimelineEntry';
import { useGlobalState } from '../context/GlobalStateContext';
import { Search, X } from 'lucide-react';

const CATEGORIES = [
    'All', 'Publication', 'Award', 'Leadership', 'Internal Project',
    'Certification / License', 'Speaking / Conference', 'Mentorship / Coaching'
];

const Timeline = () => {
    const { achievements, deleteAchievement } = useGlobalState();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const currentYear = new Date().getFullYear();
    const yearOptions = ['All', ...Array.from({ length: 6 }, (_, i) => String(currentYear - i))];

    const filtered = achievements.filter(item => {
        const matchesSearch =
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.impact?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesYear = selectedYear === 'All' || (item.date && item.date.startsWith(selectedYear));
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesYear && matchesCategory;
    });

    return (
        <div className="flex-col gap-6" style={{ paddingBottom: 'var(--space-8)' }}>
            <header className="flex-col gap-1">
                <h1 className="text-2xl">Professional Timeline</h1>
                <p className="text-muted text-sm">A narrative of your career impact.</p>
            </header>

            {/* Search bar */}
            <div style={{ position: 'relative' }}>
                <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                    type="text"
                    placeholder="Search achievements..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%', padding: '11px 36px 11px 40px',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--border-radius-full)',
                        color: 'var(--color-text)', outline: 'none'
                    }}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Filters row */}
            <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    style={{
                        padding: '6px 10px', backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)',
                        color: 'var(--color-text)', outline: 'none', fontSize: 'var(--font-size-sm)'
                    }}
                >
                    {yearOptions.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
                </select>

                <div className="flex gap-2" style={{ overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: '4px' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                flexShrink: 0,
                                padding: '4px 12px',
                                borderRadius: 'var(--border-radius-full)',
                                fontSize: 'var(--font-size-xs)',
                                whiteSpace: 'nowrap',
                                fontWeight: selectedCategory === cat ? '600' : '400',
                                backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-surface)',
                                color: selectedCategory === cat ? 'var(--color-base)' : 'var(--color-text-muted)',
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count */}
            {(searchQuery || selectedYear !== 'All' || selectedCategory !== 'All') && (
                <p className="text-xs text-muted" style={{ marginTop: '-12px' }}>
                    {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
                </p>
            )}

            {/* Timeline entries */}
            <div style={{ marginTop: 'var(--space-2)' }}>
                {filtered.length === 0 ? (
                    <div className="text-center text-muted" style={{ padding: 'var(--space-8)' }}>
                        {achievements.length === 0
                            ? "No achievements logged yet. Tap 'Log Achievement' to start!"
                            : 'No achievements match your filters.'}
                    </div>
                ) : (
                    filtered.map((item) => (
                        <TimelineEntry
                            key={item.id}
                            item={item}
                            onDelete={deleteAchievement}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Timeline;
