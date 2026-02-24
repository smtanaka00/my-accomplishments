import React from 'react';

const MetricCard = ({ title, value, icon: Icon, color = 'var(--color-primary)' }) => {
    return (
        <div className="card flex-col gap-2">
            <div className="flex justify-between items-center">
                <span className="text-sm text-muted">{title}</span>
                <div style={{ backgroundColor: `${color}20`, padding: '6px', borderRadius: '50%', display: 'flex' }}>
                    <Icon size={18} color={color} />
                </div>
            </div>
            <div className="text-3xl">{value}</div>
        </div>
    );
};

export default MetricCard;
