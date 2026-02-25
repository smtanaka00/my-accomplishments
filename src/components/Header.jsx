import React from 'react';
import { LogOut } from 'lucide-react';
import { supabase } from '../supabase';

const Header = ({ name, title, year, onYearChange }) => {
    return (
        <header className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="flex gap-4 items-center">
                <div style={{
                    width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-base)',
                    fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0
                }}>
                    {name.charAt(0)}
                </div>
                <div className="flex-col">
                    <h1 className="text-xl" style={{ lineHeight: '1.2' }}>{name}</h1>
                    <p className="text-sm" style={{ color: 'var(--color-primary)', marginTop: '2px' }}>{title}</p>
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <select
                    value={year}
                    onChange={(e) => onYearChange(e.target.value)}
                    style={{
                        backgroundColor: 'var(--color-surface)', color: 'var(--color-text)',
                        border: '1px solid var(--color-border)', padding: 'var(--space-2)',
                        borderRadius: 'var(--border-radius-md)', outline: 'none',
                        fontSize: 'var(--font-size-sm)', cursor: 'pointer'
                    }}
                >
                    {Array.from({ length: 6 }, (_, i) => {
                        const y = new Date().getFullYear() - i;
                        return <option key={y} value={String(y)}>{y}</option>;
                    })}
                </select>
                <button
                    onClick={() => supabase.auth.signOut()}
                    title="Sign Out"
                    style={{ padding: '6px', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
};

export default Header;
