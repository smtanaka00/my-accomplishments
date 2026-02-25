import React, { useState, useRef } from 'react';
import { Upload, ChevronDown, Check, FileType } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useNavigate } from 'react-router-dom';

const EntryForm = () => {
    const { addAchievement } = useGlobalState();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [impact, setImpact] = useState('');
    const [targetVisa, setTargetVisa] = useState('EB-2 NIW');
    const [category, setCategory] = useState('Publication');
    const [fileName, setFileName] = useState('');
    const [fileData, setFileData] = useState(null);
    const [isPublic, setIsPublic] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFileData(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !date) {
            alert('Please fill out the title and date.');
            return;
        }

        const newAchievement = {
            title,
            date,
            displayDate: new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            category,
            tag: targetVisa,
            impact: impact || 'No impact statement provided.',
            evidenceType: fileName ? (fileName.endsWith('.pdf') ? 'pdf' : 'image') : 'link',
            fileName,
            fileData,
            isPublic
        };

        addAchievement(newAchievement);
        alert('Achievement logged securely!');
        navigate('/timeline'); // Navigate to timeline to see the result
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
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
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
                        value={impact}
                        onChange={(e) => setImpact(e.target.value)}
                        style={{
                            width: '100%', padding: '10px', backgroundColor: 'var(--color-base)',
                            border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)',
                            color: 'var(--color-text)', outline: 'none', resize: 'vertical'
                        }}
                    ></textarea>

                    <div
                        className="flex-col items-center justify-center gap-2"
                        onClick={handleFileClick}
                        style={{
                            padding: 'var(--space-6)', border: '2px dashed var(--color-border)',
                            borderRadius: 'var(--border-radius-md)', backgroundColor: fileName ? 'var(--color-surface)' : 'var(--color-base)',
                            cursor: 'pointer'
                        }}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            accept=".pdf,image/png,image/jpeg,image/jpg"
                        />
                        {fileName ? (
                            <>
                                <FileType size={24} color="var(--color-primary)" />
                                <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>Attached: {fileName}</span>
                                <span className="text-xs text-muted">Tap to change</span>
                            </>
                        ) : (
                            <>
                                <Upload size={24} color="var(--color-text-muted)" />
                                <span className="text-sm font-medium text-muted">Tap to Upload Evidence</span>
                                <span className="text-xs text-muted">Supports PDF, JPG, PNG</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Visibility Toggle */}
                <div className="card flex justify-between items-center" style={{ padding: 'var(--space-4)' }}>
                    <div className="flex-col gap-1">
                        <span className="font-medium text-sm">Public Visibility</span>
                        <span className="text-xs text-muted">Show in your shareable portfolio link</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsPublic(p => !p)}
                        style={{
                            width: '48px', height: '26px', borderRadius: '13px',
                            backgroundColor: isPublic ? 'var(--color-primary)' : 'var(--color-border)',
                            position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s', flexShrink: 0
                        }}
                    >
                        <span style={{
                            position: 'absolute', top: '3px',
                            left: isPublic ? '25px' : '3px',
                            width: '20px', height: '20px', borderRadius: '50%',
                            backgroundColor: 'white', transition: 'left 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                        }} />
                    </button>
                </div>

                <button type="submit" className="btn-primary" style={{ padding: 'var(--space-4)', fontSize: '1.1rem' }}>
                    Save to Vault & Timeline
                </button>

            </form>
        </div>
    );
};

export default EntryForm;
