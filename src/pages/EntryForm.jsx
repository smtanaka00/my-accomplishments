import React, { useState } from 'react';
import { Upload, ChevronDown, Check } from 'lucide-react';

const EntryForm = () => {
    const [targetVisa, setTargetVisa] = useState('EB-2 NIW');
    const [category, setCategory] = useState('Publication');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Achievement logged securely!');
    };

    return (
        <div className="flex-col gap-6" style={{ paddingBottom: 'var(--space-8)' }}>
            <header className="flex-col gap-1">
                <h1 className="text-2xl">Log Achievement</h1>
                <p className="text-muted text-sm">Document your win while it's fresh.</p>
            </header>

            <form onSubmit={handleSubmit} className="flex-col gap-6">

                {/* Basic Info */}
                <div className="card flex-col gap-4">
                    <h2 className="font-semibold text-lg" style={{ color: 'var(--color-primary)' }}>Basics</h2>

                    <div className="flex-col gap-2">
                        <label className="text-sm font-medium">Achievement Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Published in Nature Journal..."
                            style={{
                                width: '100%', padding: '10px', backgroundColor: 'var(--color-base)',
                                border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)',
                                color: 'var(--color-text)', outline: 'none'
                            }}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-col gap-2" style={{ flex: 1 }}>
                            <label className="text-sm font-medium">Date</label>
                            <input
                                type="date"
                                style={{
                                    width: '100%', padding: '10px', backgroundColor: 'var(--color-base)',
                                    border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)',
                                    color: 'var(--color-text)', outline: 'none'
                                }}
                            />
                        </div>
                        <div className="flex-col gap-2" style={{ flex: 1 }}>
                            <label className="text-sm font-medium">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{
                                    width: '100%', padding: '10px', backgroundColor: 'var(--color-base)',
                                    border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)',
                                    color: 'var(--color-text)', outline: 'none'
                                }}
                            >
                                <option>Publication</option>
                                <option>Award</option>
                                <option>Leadership</option>
                                <option>Internal Project</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Visa & Career Alignment */}
                <div className="card flex-col gap-4">
                    <h2 className="font-semibold text-lg" style={{ color: 'var(--color-accent)' }}>Visa & Review Alignment</h2>
                    <p className="text-xs text-muted">Tagging helps build petition letters automatically.</p>

                    <div className="flex-col gap-2">
                        <label className="text-sm font-medium">Target Pathway</label>
                        <select
                            value={targetVisa}
                            onChange={(e) => setTargetVisa(e.target.value)}
                            style={{
                                width: '100%', padding: '10px', backgroundColor: 'var(--color-base)',
                                border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)',
                                color: 'var(--color-text)', outline: 'none'
                            }}
                        >
                            <option>EB-2 NIW (National Interest Waiver)</option>
                            <option>O-1 (Extraordinary Ability)</option>
                            <option>H-1B Extension</option>
                            <option>Annual Executive Review</option>
                        </select>
                    </div>

                    <div className="flex-col gap-2">
                        <label className="text-sm font-medium">Alignment Criteria</label>
                        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                            {['Original Contribution', 'Critical Role', 'High Salary', 'Display of Work'].map(tag => (
                                <div key={tag} className="flex gap-1 items-center" style={{
                                    padding: '4px 10px', borderRadius: 'var(--border-radius-full)', cursor: 'pointer',
                                    border: '1px solid var(--color-border)', fontSize: 'var(--font-size-xs)'
                                }}>
                                    <Check size={12} color="var(--color-text-muted)" />
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Impact & Evidence */}
                <div className="card flex-col gap-4">
                    <h2 className="font-semibold text-lg">Impact Statement</h2>
                    <textarea
                        rows="4"
                        placeholder="What was the result of this? e.g. Reduced lead time by 15%, increasing capacity..."
                        style={{
                            width: '100%', padding: '10px', backgroundColor: 'var(--color-base)',
                            border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)',
                            color: 'var(--color-text)', outline: 'none', resize: 'vertical'
                        }}
                    ></textarea>

                    <div
                        className="flex-col items-center justify-center gap-2"
                        style={{
                            padding: 'var(--space-6)', border: '2px dashed var(--color-border)',
                            borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--color-base)',
                            cursor: 'pointer'
                        }}
                    >
                        <Upload size={24} color="var(--color-text-muted)" />
                        <span className="text-sm font-medium text-muted">Tap to Upload Evidence</span>
                        <span className="text-xs text-muted">Supports PDF, JPG, PNG</span>
                    </div>
                </div>

                <button type="submit" className="btn-primary" style={{ padding: 'var(--space-4)', fontSize: '1.1rem' }}>
                    Save to Vault & Timeline
                </button>

            </form>
        </div>
    );
};

export default EntryForm;
