let currentUser = null;
let currentCalculation = null;
let carbonChart = null;

const quotes = [
    "The greatest threat to our planet is the belief that someone else will save it.",
    "We don't need a handful of people doing zero waste perfectly. We need millions of people doing it imperfectly.",
    "The Earth is what we all have in common.",
    "Every day is Earth Day.",
    "Small acts, when multiplied by millions of people, can transform the world.",
    "The climate crisis has already been solved. We already have all the facts and solutions.",
    "There is no planet B.",
    "Be the change you wish to see in the world."
];

function init() {
    loadTheme();
    checkLogin();
    setDailyQuote();
}

function setDailyQuote() {
    const quoteElement = document.getElementById('dailyQuote');
    if (quoteElement) {
        const today = new Date().getDate();
        const quoteIndex = today % quotes.length;
        quoteElement.textContent = `"${quotes[quoteIndex]}"`;
    }
}

function toggleAuthForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authMessage = document.getElementById('authMessage');
    
    authMessage.style.display = 'none';
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'flex';
    }
}

function showAuthMessage(message, type) {
    const authMessage = document.getElementById('authMessage');
    authMessage.textContent = message;
    authMessage.className = `auth-message ${type}`;
    authMessage.style.display = 'block';
}

function signup() {
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (!username || !password || !confirmPassword) {
        showAuthMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthMessage('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('ecotrack_users') || '{}');
    
    if (users[username]) {
        showAuthMessage('Username already exists', 'error');
        return;
    }
    
    users[username] = {
        password: password,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('ecotrack_users', JSON.stringify(users));
    showAuthMessage('Account created successfully! Please login.', 'success');
    
    setTimeout(() => {
        toggleAuthForm();
    }, 1500);
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showAuthMessage('Please fill in all fields', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('ecotrack_users') || '{}');
    
    if (!users[username]) {
        showAuthMessage('Username not found', 'error');
        return;
    }
    
    if (users[username].password !== password) {
        showAuthMessage('Incorrect password', 'error');
        return;
    }
    
    currentUser = username;
    localStorage.setItem('ecotrack_current_user', username);
    
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('currentUser').textContent = username;
    
    loadDashboard();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('ecotrack_current_user');
        
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
        
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('authMessage').style.display = 'none';
    }
}

function checkLogin() {
    const savedUser = localStorage.getItem('ecotrack_current_user');
    
    if (savedUser) {
        const users = JSON.parse(localStorage.getItem('ecotrack_users') || '{}');
        if (users[savedUser]) {
            currentUser = savedUser;
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            document.getElementById('currentUser').textContent = savedUser;
            loadDashboard();
        } else {
            localStorage.removeItem('ecotrack_current_user');
        }
    }
}

function calculateCarbon() {
    const transport = parseFloat(document.getElementById('transport').value) || 0;
    const meals = parseFloat(document.getElementById('meals').value) || 0;
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    
    if (transport === 0 && meals === 0 && electricity === 0) {
        alert('Please enter at least one value');
        return;
    }
    
    const totalCarbon = (transport * 0.21) + (meals * 2.5) + (electricity * 0.5);
    
    currentCalculation = {
        date: new Date().toISOString(),
        transport: transport,
        meals: meals,
        electricity: electricity,
        totalCarbon: parseFloat(totalCarbon.toFixed(2))
    };
    
    document.getElementById('carbonValue').textContent = totalCarbon.toFixed(2);
    
    generateTips(transport, meals, electricity);
    
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function generateTips(transport, meals, electricity) {
    const tips = [];
    
    if (transport > 50) {
        tips.push({
            icon: '🚆',
            text: 'Try carpooling or public transport to reduce emissions by up to 45%.'
        });
    } else if (transport > 20) {
        tips.push({
            icon: '🚴',
            text: 'Consider biking or walking for short distances.'
        });
    }
    
    if (meals > 3) {
        tips.push({
            icon: '🥗',
            text: 'Reduce meat-based meals to lower emissions. Plant-based options can reduce your food carbon footprint by up to 50%.'
        });
    } else if (meals > 0) {
        tips.push({
            icon: '🌱',
            text: 'Great job! Keep choosing sustainable meal options.'
        });
    }
    
    if (electricity > 20) {
        tips.push({
            icon: '💡',
            text: 'Use energy-efficient LED bulbs and turn off devices when not in use. You could reduce consumption by 25%.'
        });
    } else if (electricity > 10) {
        tips.push({
            icon: '🔌',
            text: 'Consider using smart power strips to eliminate phantom power drain.'
        });
    }
    
    if (tips.length === 0) {
        tips.push({
            icon: '🌟',
            text: 'Amazing! Your carbon footprint is very low. Keep up the great work!'
        });
    }
    
    const tipsContainer = document.getElementById('tipsContainer');
    tipsContainer.innerHTML = tips.map(tip => 
        `<div class="tip-item">${tip.icon} ${tip.text}</div>`
    ).join('');
}

async function saveToLocalStorage() {
    if (!currentCalculation) {
        alert('Please calculate your footprint first');
        return;
    }

    // 1️⃣ Save to localStorage (for dashboard display)
    const storageKey = `ecotrack_data_${currentUser}`;
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existingData.push(currentCalculation);
    localStorage.setItem(storageKey, JSON.stringify(existingData));

    // 2️⃣ Also save to database via backend API
    try {
        const res = await fetch('/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: currentUser, // logged in user
                name: "Carbon Calculation", // generic or dynamic name
                carbon_saved: currentCalculation.totalCarbon,
                date: currentCalculation.date
            })
        });

        const result = await res.json();
        if (result.success) {
            console.log(`✅ Data saved to database (ID: ${result.id})`);
        } else {
            console.error('❌ Error saving to database:', result.error);
        }
    } catch (error) {
        console.error('⚠️ Network error while saving to database:', error);
    }

    alert('Data saved successfully! Check your dashboard.');

    currentCalculation = null;
    document.getElementById('transport').value = '';
    document.getElementById('meals').value = '';
    document.getElementById('electricity').value = '';
    document.getElementById('results').style.display = 'none';

    loadDashboard();
    scrollToSection('dashboard');
}

function loadDashboard() {
    const storageKey = `ecotrack_data_${currentUser}`;
    const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    document.getElementById('totalEntries').textContent = data.length;
    
    if (data.length > 0) {
        const avgCarbon = data.reduce((sum, entry) => sum + entry.totalCarbon, 0) / data.length;
        document.getElementById('avgCarbon').textContent = avgCarbon.toFixed(2) + ' kg/day';
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyData = data.filter(entry => new Date(entry.date) >= oneWeekAgo);
        
        if (weeklyData.length > 0) {
            const weeklyAvg = weeklyData.reduce((sum, entry) => sum + entry.totalCarbon, 0) / weeklyData.length;
            document.getElementById('weeklyAvg').textContent = weeklyAvg.toFixed(2) + ' kg/day';
        } else {
            document.getElementById('weeklyAvg').textContent = '0 kg/day';
        }
        
        loadHistory(data);
        renderChart(data);
    } else {
        document.getElementById('avgCarbon').textContent = '0 kg/day';
        document.getElementById('weeklyAvg').textContent = '0 kg/day';
        document.getElementById('historyList').innerHTML = '<p style="text-align:center; color: var(--text-light);">No data yet. Start tracking your carbon footprint!</p>';
        
        if (carbonChart) {
            carbonChart.destroy();
            carbonChart = null;
        }
    }
}

function loadHistory(data) {
    const historyList = document.getElementById('historyList');
    
    const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    historyList.innerHTML = sortedData.map(entry => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="history-item">
                <div>
                    <div class="history-date">${formattedDate}</div>
                    <div style="font-size: 0.9rem; color: var(--text-light); margin-top: 4px;">
                        🚗 ${entry.transport}km | 🍔 ${entry.meals} meals | 💡 ${entry.electricity}kWh
                    </div>
                </div>
                <div class="history-value">${entry.totalCarbon} kg CO₂</div>
            </div>
        `;
    }).join('');
}

function renderChart(data) {
    const ctx = document.getElementById('carbonChart');
    
    if (!ctx) return;
    
    if (carbonChart) {
        carbonChart.destroy();
    }
    
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const labels = sortedData.map(entry => {
        const date = new Date(entry.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const carbonValues = sortedData.map(entry => entry.totalCarbon);
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#d1d5db' : '#6b7280';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    carbonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'CO₂ Emissions (kg/day)',
                data: carbonValues,
                borderColor: '#16a34a',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#16a34a',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: textColor,
                        font: {
                            family: 'Poppins',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    titleColor: isDark ? '#f9fafb' : '#1f2937',
                    bodyColor: isDark ? '#d1d5db' : '#6b7280',
                    borderColor: gridColor,
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return `CO₂: ${context.parsed.y} kg/day`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        font: {
                            family: 'Poppins'
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            family: 'Poppins'
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all your history? This action cannot be undone.')) {
        const storageKey = `ecotrack_data_${currentUser}`;
        localStorage.removeItem(storageKey);
        loadDashboard();
        alert('History cleared successfully');
    }
}

function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ecotrack_theme', newTheme);
    
    document.getElementById('themeIcon').textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    if (carbonChart) {
        const storageKey = `ecotrack_data_${currentUser}`;
        const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (data.length > 0) {
            renderChart(data);
        }
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('ecotrack_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', init);
