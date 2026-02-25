import React, { useState } from 'react';
import { Target, Plus, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';

const GoalCard = ({ goal, onComplete, onDelete }) => {
    const isCompleted = goal.status === 'completed';
    return (
        <div
            className="card flex gap-3 items-start"
            style={{
                padding: 'var(--space-4)',
                opacity: isCompleted ? 0.6 : 1,
                borderLeft: `3px solid ${isCompleted ? 'var(--color-primary)' : 'var(--color-accent)'}`
            }}
        >
            <button
                onClick={() => onComplete(goal.id, isCompleted ? 'in_progress' : 'completed')}
                style={{
                    width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                    border: `2px solid ${isCompleted ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: isCompleted ? 'var(--color-primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
            >
                {isCompleted && <Check size={14} color="white" strokeWidth={3} />}
            </button>
            <div className="flex-col gap-1" style={{ flex: 1, minWidth: 0 }}>
                <p className="font-semibold text-sm" style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
                    {goal.title}
                </p>
                {goal.description && (
                    <p className="text-xs text-muted">{goal.description}</p>
                )}
                {goal.target_date && (
                    <span className="text-xs" style={{ color: 'var(--color-accent)' }}>
                        Due: {new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                )}
            </div>
            <button
                onClick={() => onDelete(goal.id)}
                style={{ padding: '4px', cursor: 'pointer', color: 'var(--color-text-muted)', flexShrink: 0 }}
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
};

const Goals = () => {
    const { goals, addGoal, updateGoal, deleteGoal } = useGlobalState();

    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const activeGoals = goals.filter(g => g.status === 'in_progress');
    const completedGoals = goals.filter(g => g.status === 'completed');
    const [showCompleted, setShowCompleted] = useState(false);

    const inputStyle = {
        width: '100%', padding: '10px', backgroundColor: 'var(--color-base)',
        border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)',
        color: 'var(--color-text)', outline: 'none', fontSize: '14px'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setIsSubmitting(true);
        await addGoal({
            title: title.trim(),
            description: description.trim() || null,
            target_date: targetDate || null,
            status: 'in_progress'
        });
        setTitle('');
        setDescription('');
        setTargetDate('');
        setShowForm(false);
        setIsSubmitting(false);
    };

    return (
        <div className="flex-col gap-6" style={{ paddingBottom: 'var(--space-8)' }}>
            <header className="flex-col gap-1 text-center" style={{ marginTop: 'var(--space-2)' }}>
                <h1 className="text-2xl">Career Goals</h1>
                <p className="text-muted text-sm">Set milestones. Track progress. Win.</p>
            </header>

            {/* Stats Bar */}
            <div className="flex gap-3">
                <div className="card flex-col items-center" style={{ flex: 1, padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)' }}>
                    <span className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{activeGoals.length}</span>
                    <span className="text-xs text-muted">In Progress</span>
                </div>
                <div className="card flex-col items-center" style={{ flex: 1, padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)' }}>
                    <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{completedGoals.length}</span>
                    <span className="text-xs text-muted">Completed</span>
                </div>
                <div className="card flex-col items-center" style={{ flex: 1, padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)' }}>
                    <span className="text-2xl font-bold" style={{ color: goals.length > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                        {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
                    </span>
                    <span className="text-xs text-muted">Complete</span>
                </div>
            </div>

            {/* Add Goal Button / Form */}
            {!showForm ? (
                <button
                    className="btn-primary"
                    style={{ padding: 'var(--space-3)' }}
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={18} /> Add New Goal
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="card flex-col gap-3">
                    <h2 className="font-semibold text-base" style={{ color: 'var(--color-accent)' }}>New Goal</h2>
                    <div className="flex-col gap-1">
                        <label className="text-xs font-medium text-muted">Goal Title *</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="e.g. Obtain AWS Solutions Architect cert"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div className="flex-col gap-1">
                        <label className="text-xs font-medium text-muted">Description (optional)</label>
                        <textarea
                            rows={2}
                            placeholder="Why is this goal important?"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            style={{ ...inputStyle, resize: 'vertical' }}
                        />
                    </div>
                    <div className="flex-col gap-1">
                        <label className="text-xs font-medium text-muted">Target Date (optional)</label>
                        <input
                            type="date"
                            value={targetDate}
                            onChange={e => setTargetDate(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            style={{ flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '14px', cursor: 'pointer', backgroundColor: 'transparent' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim()}
                            className="btn-primary"
                            style={{ flex: 2, padding: 'var(--space-3)', fontSize: '14px' }}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Goal'}
                        </button>
                    </div>
                </form>
            )}

            {/* Active Goals */}
            <div className="flex-col gap-3">
                <h2 className="font-semibold text-base">Active Goals</h2>
                {activeGoals.length > 0 ? (
                    activeGoals.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onComplete={(id, status) => updateGoal(id, { status })}
                            onDelete={deleteGoal}
                        />
                    ))
                ) : (
                    <div
                        className="flex-col items-center gap-2 text-center text-muted"
                        style={{ padding: 'var(--space-8)', border: '2px dashed var(--color-border)', borderRadius: 'var(--border-radius-md)' }}
                    >
                        <Target size={28} color="var(--color-text-muted)" />
                        <p className="text-sm">No active goals yet. Add one above!</p>
                    </div>
                )}
            </div>

            {/* Completed Goals Collapsible */}
            {completedGoals.length > 0 && (
                <div className="flex-col gap-3">
                    <button
                        onClick={() => setShowCompleted(p => !p)}
                        className="flex justify-between items-center"
                        style={{ width: '100%', padding: 0, background: 'none', cursor: 'pointer' }}
                    >
                        <h2 className="font-semibold text-base text-muted">Completed ({completedGoals.length})</h2>
                        {showCompleted ? <ChevronUp size={18} color="var(--color-text-muted)" /> : <ChevronDown size={18} color="var(--color-text-muted)" />}
                    </button>
                    {showCompleted && completedGoals.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onComplete={(id, status) => updateGoal(id, { status })}
                            onDelete={deleteGoal}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Goals;
