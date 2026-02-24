import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';

class PrintableReport extends React.Component {
    render() {
        const { year, data, metrics } = this.props;
        return (
            <div style={{ padding: '40px', color: 'black', background: 'white', fontFamily: 'sans-serif' }}>
                <h1 style={{ fontSize: '24px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
                    My Achievements Report - {year}
                </h1>

                <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                    <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>Impact Score</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0 0 0' }}>{metrics.impactScore}</p>
                    </div>
                    <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>Completion Rate</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0 0 0' }}>{metrics.completionRate}</p>
                    </div>
                    <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>Awards</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0 0 0' }}>{metrics.awards}</p>
                    </div>
                </div>

                <h2 style={{ fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>Detailed Achievements</h2>
                {data.length === 0 ? (
                    <p>No achievements logged for this year.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {data.map(ach => (
                            <div key={ach.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', pageBreakInside: 'avoid' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <h4 style={{ margin: 0, fontSize: '16px' }}>{ach.title}</h4>
                                    <span style={{ color: '#666', fontSize: '14px' }}>{ach.displayDate}</span>
                                </div>
                                <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Category: {ach.category}</span>
                                    <span style={{ color: '#666' }}>Tag: {ach.tag}</span>
                                </div>
                                <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.5 }}>{ach.impact}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

const ReportGenerator = ({ year }) => {
    const { achievements, dashboardMetrics } = useGlobalState();
    const componentRef = useRef();

    // Using the modern react-to-print hook to avoid ESM default import issues
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Achievements_Report_${year}`
    });

    const yearAchievements = achievements.filter(ach => ach.date.startsWith(year));
    const metrics = dashboardMetrics[year] || { impactScore: 0, completionRate: '0%', awards: 0 };

    return (
        <div>
            <button
                className="btn-secondary"
                style={{ padding: 'var(--space-4)', width: '100%', marginTop: 'var(--space-2)' }}
                onClick={() => handlePrint()}
            >
                <Printer size={20} />
                Export {year} Report (PDF)
            </button>
            <div style={{ display: 'none' }}>
                <PrintableReport
                    ref={componentRef}
                    year={year}
                    data={yearAchievements}
                    metrics={metrics}
                />
            </div>
        </div>
    );
};

export default ReportGenerator;
