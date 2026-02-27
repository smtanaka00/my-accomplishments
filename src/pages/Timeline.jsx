import React, { useState } from 'react';
import TimelineEntry from '../components/TimelineEntry';
import { useGlobalState } from '../context/GlobalStateContext';
import { Search, X, Filter } from 'lucide-react';

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

    const chipStyle = (cat) => ({
        padding: '6px 14px',
        borderRadius: 'var(--border-radius-full)',
        fontSize: 'var(--font-size-xs)',
        whiteSpace: 'nowrap',
        fontWeight: selectedCategory === cat ? '600' : '400',
        backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-surface)',
        color: selectedCategory === cat ? 'var(--color-base)' : 'var(--color-text-muted)',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        display: 'block',
    });

    const mobilChipStyle = (cat) => ({
        ...chipStyle(cat),
        width: 'auto',
        flexShrink: 0,
    });

    const FiltersContent = ({ vertical = false }) => (
        <>
            <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="year-select"
                style={{ width: '100%' }}
            >
                {yearOptions.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
            </select>

            <div className={vertical ? 'category-chips-vertical' : 'flex gap-2'} style={!vertical ? { overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: '4px' } : {}}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={vertical ? chipStyle(cat) : mobilChipStyle(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </>
    );

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Professional Timeline</h1>
                <p>A narrative of your career impact.</p>
            </div>

            {/* Search bar — always visible */}
            <div style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>
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
                        color: 'var(--color-text)', outline: 'none',
                        fontFamily: 'inherit',
                    }}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="timeline-layout">
                {/* Desktop: sticky filter sidebar */}
                <div className="timeline-filters-desktop">
                    <div className="flex items-center gap-2" style={{ marginBottom: 'var(--space-2)' }}>
                        <Filter size={14} color="var(--color-text-muted)" />
                        <span className="text-xs text-muted font-semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filters</span>
                    </div>
                    <FiltersContent vertical={true} />
                    {(selectedYear !== 'All' || selectedCategory !== 'All') && (
                        <p className="text-xs text-muted" style={{ marginTop: 'var(--space-2)' }}>
                            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
                        </p>
                    )}
                </div>

                {/* Timeline entries column */}
                <div>
                    {/* Mobile: inline filters */}
                    <div className="timeline-filters-mobile">
                        <FiltersContent vertical={false} />
                        {(searchQuery || selectedYear !== 'All' || selectedCategory !== 'All') && (
                            <p className="text-xs text-muted">
                                {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
                            </p>
                        )}
                    </div>

                    <div style={{ marginTop: 'var(--space-2)' }}>
                        {filtered.length === 0 ? (
                            <div className="text-center text-muted" style={{ padding: 'var(--space-8)' }}>
                                {achievements.length === 0
                                    ? "No achievements logged yet. Click 'Log Achievement' to start!"
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
            </div>
        </div>
    );
};

export default Timeline;
