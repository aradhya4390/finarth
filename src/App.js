// App.js - Complete Self-Contained Finance Application
import React, { useState, useEffect } from 'react';
import './App.css';


// WelcomePage Component
const WelcomePage = ({ onEnterApp }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEnterApp = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onEnterApp();
    }, 800);
  };

  return (
    <div className={`welcome-container ${isAnimating ? 'fade-out' : ''}`} style={welcomeStyles.container}>
      <div style={welcomeStyles.content}>
        <div style={welcomeStyles.logoSection}>
          <div style={welcomeStyles.logo}></div>
          <h1 style={welcomeStyles.title}>Finarth</h1>
          <p style={welcomeStyles.subtitle}>Your Complete Personal Finance Management Solution</p>
        </div>
        
        

        <button onClick={handleEnterApp} style={welcomeStyles.button}>
          Enter Application →
        </button>
      </div>
    </div>
  );
};

// FileUploadAnalysis Component
const FileUploadAnalysis = ({ onDataExtracted }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualText, setManualText] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setUploadedFile(file);
    setLoading(true);
    
    // Simulate file processing
    setTimeout(() => {
      const mockAnalysis = {
        transactions: [
          { amount: 1200, description: 'Salary', category: 'Income', type: 'income', date: '2024-01-15' },
          { amount: -300, description: 'Groceries', category: 'Food', type: 'expense', date: '2024-01-10' },
          { amount: -150, description: 'Gas', category: 'Transport', type: 'expense', date: '2024-01-08' }
        ],
        summary: {
          totalIncome: 1200,
          totalExpenses: 450,
          netAmount: 750,
          transactionCount: 3
        }
      };
      
      setAnalysisResult(mockAnalysis);
      onDataExtracted && onDataExtracted(mockAnalysis);
      setLoading(false);
    }, 2000);
  };

  const analyzeText = () => {
    if (!manualText.trim()) return;
    
    setLoading(true);
    // Simple text analysis
    const amounts = manualText.match(/\d+\.?\d*/g) || [];
    const transactions = amounts.map((amount, index) => ({
      amount: parseFloat(amount),
      description: `Text entry ${index + 1}`,
      category: 'Other',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    }));

    const analysis = {
      transactions,
      summary: {
        totalIncome: 0,
        totalExpenses: transactions.reduce((sum, t) => sum + t.amount, 0),
        netAmount: -transactions.reduce((sum, t) => sum + t.amount, 0),
        transactionCount: transactions.length
      }
    };

    setAnalysisResult(analysis);
    onDataExtracted && onDataExtracted(analysis);
    setLoading(false);
  };

  return (
    <div style={componentStyles.container}>
      <h2>📁 File Upload & Analysis</h2>
      
      <div 
        style={{...componentStyles.uploadArea, ...(dragActive ? componentStyles.uploadAreaActive : {})}}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div style={componentStyles.uploadIcon}>📤</div>
        <p>Drag & drop your files here</p>
        <p style={componentStyles.uploadFormats}>Supports: PDF, Excel, Word, Text files</p>
        <input 
          type="file" 
          onChange={handleFileInput}
          style={{ display: 'none' }}
          id="file-input"
          accept=".pdf,.xlsx,.xls,.docx,.txt"
        />
        <label htmlFor="file-input" style={componentStyles.button}>
          Choose File
        </label>
      </div>

      <div style={componentStyles.manualSection}>
        <h3>Or Enter Text Manually</h3>
        <textarea
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Enter your financial data or text to analyze..."
          rows="4"
          style={componentStyles.textarea}
        />
        <button onClick={analyzeText} style={componentStyles.button}>
          Analyze Text
        </button>
      </div>

      {loading && (
        <div style={componentStyles.loading}>
          <div style={componentStyles.spinner}></div>
          <p>Processing your file...</p>
        </div>
      )}

      {analysisResult && (
        <div style={componentStyles.results}>
          <h3>📊 Analysis Results</h3>
          <div style={componentStyles.summaryCards}>
            <div style={componentStyles.summaryCard}>
              <h4>💰 Total Income</h4>
              <p>${analysisResult.summary.totalIncome.toFixed(2)}</p>
            </div>
            <div style={componentStyles.summaryCard}>
              <h4>💸 Total Expenses</h4>
              <p>${analysisResult.summary.totalExpenses.toFixed(2)}</p>
            </div>
            <div style={componentStyles.summaryCard}>
              <h4>📈 Net Amount</h4>
              <p style={{ color: analysisResult.summary.netAmount >= 0 ? '#28a745' : '#dc3545' }}>
                ${analysisResult.summary.netAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// MoneyReceivedEntry Component
const MoneyReceivedEntry = ({ onEntriesChange }) => {
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Salary'
  });
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('moneyReceivedEntries');
    if (saved) {
      const parsed = JSON.parse(saved);
      setEntries(parsed);
      onEntriesChange && onEntriesChange(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moneyReceivedEntries', JSON.stringify(entries));
    onEntriesChange && onEntriesChange(entries);
  }, [entries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.source || !formData.reason) {
      alert('Please fill all required fields');
      return;
    }

    const entry = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    setEntries(prev => [entry, ...prev]);
    setFormData({
      amount: '',
      source: '',
      reason: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Salary'
    });
    setShowForm(false);
  };

  const deleteEntry = (id) => {
    if (window.confirm('Delete this entry?')) {
      setEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const totalReceived = entries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div style={componentStyles.container}>
      <div style={componentStyles.header}>
        <h2>💰 Money Received</h2>
        <div style={componentStyles.totalDisplay}>
          Total: <span style={{ color: '#28a745', fontSize: '1.5rem' }}>${totalReceived.toFixed(2)}</span>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={componentStyles.button}>
          {showForm ? 'Cancel' : '+ Add Entry'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={componentStyles.form}>
          <div style={componentStyles.formRow}>
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              style={componentStyles.input}
              step="0.01"
              required
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              style={componentStyles.input}
              required
            />
          </div>
          <div style={componentStyles.formRow}>
            <input
              type="text"
              placeholder="Source (e.g., ABC Company)"
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              style={componentStyles.input}
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={componentStyles.input}
            >
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Investment">Investment</option>
              <option value="Gift">Gift</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Reason (e.g., Monthly salary)"
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            style={componentStyles.input}
            required
          />
          <button type="submit" style={componentStyles.submitButton}>Add Entry</button>
        </form>
      )}

      <div style={componentStyles.entriesList}>
        {entries.length === 0 ? (
          <p style={componentStyles.noEntries}>No entries yet. Add your first income entry!</p>
        ) : (
          entries.map(entry => (
            <div key={entry.id} style={componentStyles.entryCard}>
              <div style={componentStyles.entryHeader}>
                <span style={{ color: '#28a745', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  ${entry.amount.toFixed(2)}
                </span>
                <span style={{ color: '#666' }}>{new Date(entry.date).toLocaleDateString()}</span>
              </div>
              <div><strong>From:</strong> {entry.source}</div>
              <div><strong>Reason:</strong> {entry.reason}</div>
              <div><strong>Category:</strong> {entry.category}</div>
              <button 
                onClick={() => deleteEntry(entry.id)}
                style={componentStyles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// MoneyGivenEntry Component
const MoneyGivenEntry = ({ onEntriesChange }) => {
  const [formData, setFormData] = useState({
    amount: '',
    recipient: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food'
  });
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('moneyGivenEntries');
    if (saved) {
      const parsed = JSON.parse(saved);
      setEntries(parsed);
      onEntriesChange && onEntriesChange(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moneyGivenEntries', JSON.stringify(entries));
    onEntriesChange && onEntriesChange(entries);
  }, [entries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.recipient || !formData.reason) {
      alert('Please fill all required fields');
      return;
    }

    const entry = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    setEntries(prev => [entry, ...prev]);
    setFormData({
      amount: '',
      recipient: '',
      reason: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Food'
    });
    setShowForm(false);
  };

  const deleteEntry = (id) => {
    if (window.confirm('Delete this entry?')) {
      setEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const totalGiven = entries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div style={componentStyles.container}>
      <div style={componentStyles.header}>
        <h2>💸 Money Given</h2>
        <div style={componentStyles.totalDisplay}>
          Total: <span style={{ color: '#dc3545', fontSize: '1.5rem' }}>${totalGiven.toFixed(2)}</span>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={componentStyles.button}>
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={componentStyles.form}>
          <div style={componentStyles.formRow}>
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              style={componentStyles.input}
              step="0.01"
              required
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              style={componentStyles.input}
              required
            />
          </div>
          <div style={componentStyles.formRow}>
            <input
              type="text"
              placeholder="Recipient (e.g., Walmart, John)"
              value={formData.recipient}
              onChange={(e) => setFormData({...formData, recipient: e.target.value})}
              style={componentStyles.input}
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={componentStyles.input}
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Reason (e.g., Groceries, Gas)"
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            style={componentStyles.input}
            required
          />
          <button type="submit" style={componentStyles.submitButton}>Add Expense</button>
        </form>
      )}

      <div style={componentStyles.entriesList}>
        {entries.length === 0 ? (
          <p style={componentStyles.noEntries}>No expenses yet. Add your first expense!</p>
        ) : (
          entries.map(entry => (
            <div key={entry.id} style={componentStyles.entryCard}>
              <div style={componentStyles.entryHeader}>
                <span style={{ color: '#dc3545', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  ${entry.amount.toFixed(2)}
                </span>
                <span style={{ color: '#666' }}>{new Date(entry.date).toLocaleDateString()}</span>
              </div>
              <div><strong>To:</strong> {entry.recipient}</div>
              <div><strong>For:</strong> {entry.reason}</div>
              <div><strong>Category:</strong> {entry.category}</div>
              <button 
                onClick={() => deleteEntry(entry.id)}
                style={componentStyles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// SummaryDashboard Component
const SummaryDashboard = ({ receivedEntries = [], givenEntries = [] }) => {
  const totalReceived = receivedEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalGiven = givenEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const netAmount = totalReceived - totalGiven;

  return (
    <div style={componentStyles.container}>
      <h2>📊 Financial Summary</h2>
      
      <div style={componentStyles.summaryGrid}>
        <div style={{...componentStyles.summaryCard, backgroundColor: '#e8f5e8'}}>
          <h3>💰 Total Received</h3>
          <div style={{ fontSize: '2rem', color: '#28a745' }}>${totalReceived.toFixed(2)}</div>
          <small>{receivedEntries.length} transactions</small>
        </div>
        
        <div style={{...componentStyles.summaryCard, backgroundColor: '#ffe8e8'}}>
          <h3>💸 Total Given</h3>
          <div style={{ fontSize: '2rem', color: '#dc3545' }}>${totalGiven.toFixed(2)}</div>
          <small>{givenEntries.length} transactions</small>
        </div>
        
        <div style={{...componentStyles.summaryCard, backgroundColor: netAmount >= 0 ? '#e8f5e8' : '#ffe8e8'}}>
          <h3>📈 Net Amount</h3>
          <div style={{ fontSize: '2rem', color: netAmount >= 0 ? '#28a745' : '#dc3545' }}>
            ${netAmount.toFixed(2)}
          </div>
          <small>{netAmount >= 0 ? 'Profit' : 'Loss'}</small>
        </div>
      </div>

      <div style={componentStyles.recentSection}>
        <h3>Recent Transactions</h3>
        <div style={componentStyles.transactionsList}>
          {[...receivedEntries, ...givenEntries]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5)
            .map(entry => (
              <div key={entry.id} style={componentStyles.transactionItem}>
                <span style={{ color: entry.amount > 0 ? '#28a745' : '#dc3545' }}>
                  {entry.source ? '+' : '-'}${Math.abs(entry.amount).toFixed(2)}
                </span>
                <span>{entry.source || entry.recipient}</span>
                <span>{entry.reason}</span>
                <span>{new Date(entry.date).toLocaleDateString()}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// Other Components (simplified versions)
const LoanManagement = () => (
  <div style={componentStyles.container}>
    <h2>🏦 Loan Management</h2>
    <p>Track loans with interest calculations</p>
    <div style={componentStyles.comingSoon}>Feature coming soon!</div>
  </div>
);

const DailyExpenses = () => (
  <div style={componentStyles.container}>
    <h2>⚡ Daily Expenses</h2>
    <p>Quick expense entry system</p>
    <div style={componentStyles.comingSoon}>Feature coming soon!</div>
  </div>
);
                                                                                                                          
const FinancialInsights = ({ receivedEntries = [], givenEntries = [] }) => {
  const totalIncome = receivedEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = givenEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;

  return (
    <div style={componentStyles.container}>
      <h2>💡 Financial Insights</h2>
      <div style={componentStyles.insightsGrid}>
        <div style={componentStyles.insightCard}>
          <h3>💰 Savings Rate</h3>
          <div style={{ fontSize: '2rem', color: savingsRate > 20 ? '#28a745' : '#ffc107' }}>
            {savingsRate}%
          </div>
          <p>{savingsRate > 20 ? 'Excellent!' : 'Room for improvement'}</p>
        </div>
        <div style={componentStyles.insightCard}>
          <h3>📊 Financial Status</h3>
          <div style={{ fontSize: '1.5rem', color: totalIncome > totalExpenses ? '#28a745' : '#dc3545' }}>
            {totalIncome > totalExpenses ? '✅ Positive' : '⚠️ Negative'}
          </div>
          <p>{totalIncome > totalExpenses ? 'You\'re saving money!' : 'Review your expenses'}</p>
        </div>
      </div>
    </div>
  );
};

const SavingsTracker = ({ receivedEntries = [], givenEntries = [] }) => {
  const netSavings = receivedEntries.reduce((sum, entry) => sum + entry.amount, 0) - 
                   givenEntries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div style={componentStyles.container}>
      <h2>🎯 Savings Tracker</h2>
      <div style={componentStyles.savingsStatus}>
        <h3>Current Status</h3>
        <div style={{ fontSize: '3rem' }}>
          {netSavings > 0 ? '📈 Profit' : netSavings < 0 ? '📉 Loss' : '➡️ Neutral'}
        </div>
        <div style={{ fontSize: '2rem', color: netSavings >= 0 ? '#28a745' : '#dc3545' }}>
          ${Math.abs(netSavings).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

const DataVisualization = ({ receivedEntries = [], givenEntries = [] }) => (
  <div style={componentStyles.container}>
    <h2>📈 Data Visualization</h2>
    <p>Charts and graphs for your financial data</p>
    <div style={componentStyles.chartPlaceholder}>
      📊 Interactive charts will be displayed here
    </div>
  </div>
);

const Settings = ({ darkMode, setDarkMode }) => (
  <div style={componentStyles.container}>
    <h2>⚙️ Settings</h2>
    <div style={componentStyles.settingItem}>
      <label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
        />
        Dark Mode
      </label>
    </div>
    <button 
      onClick={() => {
        if (window.confirm('Clear all data?')) {
          localStorage.clear();
          window.location.reload();
        }
      }}
      style={{...componentStyles.button, backgroundColor: '#dc3545'}}
    >
      Clear All Data
    </button>
  </div>
);

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [receivedEntries, setReceivedEntries] = useState([]);
  const [givenEntries, setGivenEntries] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'file-upload', name: 'File Analysis', icon: '📁' },
    { id: 'money-received', name: 'Money Received', icon: '💰' },
    { id: 'money-given', name: 'Money Given', icon: '💸' },
    { id: 'loan-management', name: 'Loan Management', icon: '🏦' },
    { id: 'daily-expenses', name: 'Daily Expenses', icon: '⚡' },
    { id: 'financial-insights', name: 'Financial Insights', icon: '💡' },
    { id: 'savings-tracker', name: 'Savings Tracker', icon: '🎯' },
    { id: 'data-visualization', name: 'Charts & Graphs', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const handleEnterApp = () => setCurrentPage('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage onEnterApp={handleEnterApp} />;
      case 'dashboard':
        return <SummaryDashboard receivedEntries={receivedEntries} givenEntries={givenEntries} />;
      case 'file-upload':
        return <FileUploadAnalysis onDataExtracted={() => {}} />;
      case 'money-received':
        return <MoneyReceivedEntry onEntriesChange={setReceivedEntries} />;
      case 'money-given':
        return <MoneyGivenEntry onEntriesChange={setGivenEntries} />;
      case 'loan-management':
        return <LoanManagement />;
      case 'daily-expenses':
        return <DailyExpenses />;
      case 'financial-insights':
        return <FinancialInsights receivedEntries={receivedEntries} givenEntries={givenEntries} />;
      case 'savings-tracker':
        return <SavingsTracker receivedEntries={receivedEntries} givenEntries={givenEntries} />;
      case 'data-visualization':
        return <DataVisualization receivedEntries={receivedEntries} givenEntries={givenEntries} />;
      case 'settings':
        return <Settings darkMode={darkMode} setDarkMode={setDarkMode} />;
      default:
        return <WelcomePage onEnterApp={handleEnterApp} />;
    }
  };

  if (currentPage === 'welcome') {
    return renderCurrentPage();
  }

  return (
    <div style={{...appStyles.container, ...(darkMode ? appStyles.dark : {})}}>
      {/* Sidebar */}
      <div style={{...appStyles.sidebar, width: sidebarOpen ? '280px' : '70px'}}>
        <div style={appStyles.sidebarHeader}>
          <div style={appStyles.logo}>
            <span style={appStyles.logoIcon}>💰 </span>
            {sidebarOpen && <span>Finarth</span>}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            style={appStyles.toggleButton}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav style={appStyles.nav}>
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                ...appStyles.navItem,
                ...(currentPage === item.id ? appStyles.navItemActive : {})
              }}
            >
              <span>{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{...appStyles.mainContent, marginLeft: sidebarOpen ? '280px' : '70px'}}>
        <header style={appStyles.header}>
          <h1>{navigationItems.find(item => item.id === currentPage)?.name || 'Dashboard'}</h1>
          <div style={appStyles.stats}>
            <div>
              Received: <span style={{ color: '#28a745' }}>
                ${receivedEntries.reduce((sum, entry) => sum + entry.amount, 0).toFixed(2)}
              </span>
            </div>
            <div>
              Given: <span style={{ color: '#dc3545' }}>
                ${givenEntries.reduce((sum, entry) => sum + entry.amount, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </header>

        <main style={appStyles.pageContent}>
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

// Styles
const welcomeStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center'
  },
  content: {
    padding: '2rem',
    maxWidth: '800px'
  },
  logoSection: {
    marginBottom: '3rem'
  },
  logo: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    margin: 0
  },
  subtitle: {
    fontSize: '1.2rem',
    opacity: 0.9,
    margin: 0
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  button: {
    background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
    border: 'none',
    padding: '1rem 3rem',
    borderRadius: '50px',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

const componentStyles = {
  container: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    margin: '1rem 0',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  totalDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#f8f9fa',
    padding: '0.8rem 1.5rem',
    borderRadius: '25px'
  },
  button: {
    background: 'linear-gradient(45deg, #007bff, #0056b3)',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  form: {
    background: '#f8f9fa',
    padding: '2rem',
    borderRadius: '12px',
    marginBottom: '2rem'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem'
  },
  input: {
    padding: '0.8rem',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '1rem'
  },
  submitButton: {
    background: 'linear-gradient(45deg, #28a745, #20c997)',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    width: '100%'
  },
  entriesList: {
    display: 'grid',
    gap: '1rem'
  },
  entryCard: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    position: 'relative'
  },
  entryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  deleteButton: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.3rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    position: 'absolute',
    top: '1rem',
    right: '1rem'
  },
  noEntries: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6c757d',
    background: '#f8f9fa',
    borderRadius: '12px'
  },
  uploadArea: {
    border: '2px dashed #ddd',
    borderRadius: '12px',
    padding: '3rem 2rem',
    textAlign: 'center',
    background: '#fafafa',
    marginBottom: '2rem'
  },
  uploadAreaActive: {
    borderColor: '#4CAF50',
    background: '#f0f8f0'
  },
  uploadIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    opacity: 0.6
  },
  uploadFormats: {
    color: '#666',
    fontSize: '0.9rem',
    margin: '0.5rem 0'
  },
  manualSection: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '10px',
    marginBottom: '2rem'
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    resize: 'vertical',
    marginBottom: '1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4CAF50',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem'
  },
  results: {
    background: '#f0f8ff',
    padding: '1.5rem',
    borderRadius: '10px'
  },
  summaryCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  summaryCard: {
    padding: '1.5rem',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid #e9ecef'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  recentSection: {
    marginTop: '2rem'
  },
  transactionsList: {
    background: '#f8f9fa',
    borderRadius: '10px',
    padding: '1rem'
  },
  transactionItem: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr 1fr auto',
    gap: '1rem',
    padding: '0.8rem',
    borderBottom: '1px solid #e9ecef',
    alignItems: 'center'
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  insightCard: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid #e9ecef'
  },
  savingsStatus: {
    textAlign: 'center',
    background: '#f8f9fa',
    padding: '2rem',
    borderRadius: '12px'
  },
  chartPlaceholder: {
    background: '#f8f9fa',
    padding: '4rem',
    textAlign: 'center',
    borderRadius: '12px',
    border: '2px dashed #dee2e6',
    fontSize: '1.2rem',
    color: '#6c757d'
  },
  comingSoon: {
    background: '#fff3cd',
    color: '#856404',
    padding: '2rem',
    textAlign: 'center',
    borderRadius: '10px',
    border: '1px solid #ffeaa7',
    fontSize: '1.1rem'
  },
  settingItem: {
    marginBottom: '1rem',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '8px'
  }
};

const appStyles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f5f6fa'
  },
  dark: {
    background: '#1a1a2e',
    color: '#eee'
  },
  sidebar: {
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    transition: 'all 0.3s ease',
    position: 'fixed',
    height: '100vh',
    left: 0,
    top: 0,
    zIndex: 1000,
    overflowY: 'auto'
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  },
  logoIcon: {
    fontSize: '2rem'
  },
  toggleButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    padding: '0.5rem',
    borderRadius: '50%',
    cursor: 'pointer'
  },
  nav: {
    padding: '1rem 0'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    width: '100%',
    padding: '1rem 1.5rem',
    background: 'none',
    border: 'none',
    color: 'white',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.95rem'
  },
  navItemActive: {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRight: '4px solid white'
  },
  mainContent: {
    flex: 1,
    transition: 'all 0.3s ease',
    minHeight: '100vh'
  },
  header: {
    background: 'white',
    padding: '1rem 2rem',
    boxShadow: '0 2px 10px rgba(0,0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  stats: {
    display: 'flex',
    gap: '2rem'
  },
  pageContent: {
    padding: '2rem',
    background: '#f5f6fa',
    minHeight: 'calc(100vh - 80px)'
  }
};

export default App;