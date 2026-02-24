import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useGlobalState } from '../context/GlobalStateContext';

const ProfileSetup = ({ onComplete }) => {
    const { session } = useGlobalState();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [targetGoal, setTargetGoal] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    target_role: targetRole,
                    target_goal: targetGoal
                })
                .eq('id', session.user.id);

            if (updateError) throw updateError;

            // Trigger refresh in GlobalStateContext or callback
            if (onComplete) onComplete();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.9)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'var(--space-4)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-xl" style={{ marginBottom: 'var(--space-2)' }}>Welcome to My Achievements!</h2>
                <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-4)' }}>
                    Let's set up your profile to personalize your dashboard and gap analysis.
                </p>

                <form onSubmit={handleSubmit} className="flex-col gap-4">
                    <div className="flex-col gap-2">
                        <label className="text-sm font-semibold text-muted">Full Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Sarah Jenkins"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            style={{
                                padding: 'var(--space-3)', borderRadius: 'var(--border-radius-md)',
                                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-base)',
                                color: 'var(--color-text)'
                            }}
                        />
                    </div>

                    <div className="flex-col gap-2">
                        <label className="text-sm font-semibold text-muted">Current / Target Role</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Senior Scientist"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            style={{
                                padding: 'var(--space-3)', borderRadius: 'var(--border-radius-md)',
                                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-base)',
                                color: 'var(--color-text)'
                            }}
                        />
                    </div>

                    <div className="flex-col gap-2">
                        <label className="text-sm font-semibold text-muted">Target Goal (Visa / Promotion)</label>
                        <select
                            required
                            value={targetGoal}
                            onChange={(e) => setTargetGoal(e.target.value)}
                            style={{
                                padding: 'var(--space-3)', borderRadius: 'var(--border-radius-md)',
                                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-base)',
                                color: 'var(--color-text)'
                            }}
                        >
                            <option value="">Select a goal...</option>
                            <option value="EB2 NIW">EB-2 NIW Visa</option>
                            <option value="O1 Visa">O-1 Visa</option>
                            <option value="H1B Visa">H-1B Visa</option>
                            <option value="Promotion">Promotion</option>
                            <option value="Grad School">Graduate School Application</option>
                        </select>
                    </div>

                    {error && <div className="text-sm" style={{ color: '#ef4444' }}>{error}</div>}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
                        {loading ? 'Saving...' : 'Complete Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;
