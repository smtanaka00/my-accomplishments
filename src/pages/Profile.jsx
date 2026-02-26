import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';
import { useGlobalState } from '../context/GlobalStateContext';

const Profile = () => {
    const { profile, session, refreshProfile } = useGlobalState();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [targetRole, setTargetRole] = useState(profile?.target_role || '');
    const [targetGoal, setTargetGoal] = useState(profile?.target_goal || '');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setTargetRole(profile.target_role || '');
            setTargetGoal(profile.target_goal || '');
            setAvatarUrl(profile.avatar_url || null);
        }
    }, [profile]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);

            // Also update the profile immediately for better UX
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', session.user.id);

            if (updateError) throw updateError;

            refreshProfile();
            setMessage({ type: 'success', text: 'Profile picture updated!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

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

            refreshProfile();
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: 'var(--space-20)' }}>
            <div className="flex items-center gap-4" style={{ marginBottom: 'var(--space-6)' }}>
                <button onClick={() => navigate(-1)} className="p-2" style={{ color: 'var(--color-text-muted)' }}>
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold">Edit Profile</h2>
            </div>

            <div className="card flex-col gap-6">
                <div className="flex-col items-center gap-4">
                    <div
                        onClick={handleAvatarClick}
                        style={{
                            width: '100px', height: '100px', borderRadius: '50%',
                            backgroundColor: 'var(--color-surface-hover)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', position: 'relative', overflow: 'hidden',
                            border: '2px solid var(--color-border)'
                        }}
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                {fullName.charAt(0) || '?'}
                            </span>
                        )}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px',
                            display: 'flex', justifyContent: 'center', color: 'white'
                        }}>
                            <Camera size={16} />
                        </div>
                        {uploading && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Loader2 className="animate-spin" size={24} />
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    <p className="text-xs text-muted">Click to change profile picture</p>
                </div>

                <form onSubmit={handleSubmit} className="flex-col gap-4">
                    <div className="flex-col gap-2">
                        <label className="text-sm font-semibold text-muted">Full Name</label>
                        <input
                            type="text"
                            required
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
                        <label className="text-sm font-semibold text-muted">Target Goal</label>
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

                    {message.text && (
                        <div className="text-sm" style={{ color: message.type === 'error' ? '#ef4444' : '#22c55e' }}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={loading || uploading}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
