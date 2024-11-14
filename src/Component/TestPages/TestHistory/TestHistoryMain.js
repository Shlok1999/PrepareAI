import React, { useState, useEffect } from 'react';
import DailyHistory from './DailyHistory';
import BiweeklyHistory from './BiweeklyHistory';
import MonthlyTestHistory from './MonthlyTestHistory';
import '../../../Style/TestHistoryMain.css';

function TestHistoryMain() {
    const [selectedTab, setSelectedTab] = useState('daily');

    return (
        <div className="test-history-main">
            <div className="tab-container">
                <button 
                    className={`tab-button ${selectedTab === 'daily' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('daily')}
                >
                    Daily Test History
                </button>
                <button 
                    className={`tab-button ${selectedTab === 'biweekly' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('biweekly')}
                >
                    Biweekly Test History
                </button>
                <button 
                    className={`tab-button ${selectedTab === 'monthly' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('monthly')}
                >
                    Monthly Test History
                </button>
            </div>

            <div className="history-content">
                {selectedTab === 'daily' && <DailyHistory />}
                {selectedTab === 'biweekly' && <BiweeklyHistory />}
                {selectedTab === 'monthly' && <MonthlyTestHistory />}
            </div>
        </div>
    );
}

export default TestHistoryMain;
