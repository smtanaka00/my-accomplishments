import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ name, title, year, onYearChange, avatarUrl }) => {
    return (
        <header className="dashboard-header">
            <Link to="/profile" className="flex gap-4 items-center" style={{ color: 'inherit', textDecoration: 'none' }}>
                <div className="avatar-circle">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        name.charAt(0)
                    )}
                </div>
                <div className="flex-col">
                    <h1 className="header-name">{name}</h1>
                    <p className="header-title">{title}</p>
                </div>
            </Link>
            <div className="flex gap-2 items-center">
                <select
                    value={year}
                    onChange={(e) => onYearChange(e.target.value)}
                    className="year-select"
                >
                    {Array.from({ length: 6 }, (_, i) => {
                        const y = new Date().getFullYear() - i;
                        return <option key={y} value={String(y)}>{y}</option>;
                    })}
                </select>
            </div>
        </header>
    );
};

export default Header;
