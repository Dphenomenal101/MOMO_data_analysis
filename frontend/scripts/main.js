
let transactionData = null;
let filteredTransactions = [];

// Initialize the dashboard
async function initializeDashboard() {
    showLoading();
    
    // Fetch data from API
    transactionData = await window.api.fetchTransactions();
    if (!transactionData) {
        showError('Failed to load transaction data');
        return;
    }

    // Initialize charts
    window.charts.createTransactionTypeChart(transactionData);
    window.charts.createMonthlyChart(transactionData);

    // Initialize transaction list
    updateTransactionList();

    // Setup event listeners
    setupEventListeners();

    hideLoading();
}

// Setup event listeners for filters and modal
function setupEventListeners() {
    // Filter listeners
    document.getElementById('searchInput').addEventListener('input', handleFilters);
    document.getElementById('typeFilter').addEventListener('change', handleFilters);
    document.getElementById('dateFilter').addEventListener('change', handleFilters);
    document.getElementById('amountFilter').addEventListener('input', handleFilters);

    // Modal close button
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('detailsModal').style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('detailsModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Handle all filters
function handleFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const amountFilter = parseInt(document.getElementById('amountFilter').value) || 0;

    // Combine all transactions
    let allTransactions = [];
    Object.entries(transactionData).forEach(([key, transactions]) => {
        const type = key.replace(/([A-Z])/g, ' $1').trim(); // Convert camelCase to spaces
        transactions.forEach(t => {
            allTransactions.push({
                ...t,
                type: type,
                amount: window.api.extractAmount(t.body)
            });
        });
    });

    // Apply filters
    filteredTransactions = allTransactions.filter(transaction => {
        const matchesSearch = transaction.body.toLowerCase().includes(searchTerm);
        const matchesType = typeFilter === 'all' || transaction.type.toLowerCase().includes(typeFilter.toLowerCase());
        const matchesDate = !dateFilter || transaction.Date.includes(dateFilter);
        const matchesAmount = !amountFilter || transaction.amount >= amountFilter;

        return matchesSearch && matchesType && matchesDate && matchesAmount;
    });

    updateTransactionList();
}

// Update the transaction list in the UI
function updateTransactionList() {
    const tbody = document.getElementById('transactionsList');
    tbody.innerHTML = '';

    const transactions = filteredTransactions.length > 0 ? filteredTransactions : getAllTransactions();
    
    transactions.slice(0, 50).forEach(transaction => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${transaction.Date || 'N/A'}</td>
            <td>${transaction.type || 'Unknown'}</td>
            <td>${transaction.amount} RWF</td>
            <td>
                <button onclick="showTransactionDetails('${encodeURIComponent(JSON.stringify(transaction))}')">
                    View Details
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Get all transactions as a single array
function getAllTransactions() {
    let all = [];
    Object.entries(transactionData).forEach(([key, transactions]) => {
        const type = key.replace(/([A-Z])/g, ' $1').trim();
        transactions.forEach(t => {
            all.push({
                ...t,
                type: type,
                amount: window.api.extractAmount(t.body)
            });
        });
    });
    return all;
}

// Show transaction details in modal
function showTransactionDetails(transactionJson) {
    const transaction = JSON.parse(decodeURIComponent(transactionJson));
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h3>Transaction Details</h3>
        <p><strong>Date:</strong> ${transaction.Date || 'N/A'}</p>
        <p><strong>Type:</strong> ${transaction.type || 'Unknown'}</p>
        <p><strong>Amount:</strong> ${transaction.amount} RWF</p>
        <p><strong>Message:</strong> ${transaction.body || 'No message'}</p>
    `;

    document.getElementById('detailsModal').style.display = 'block';
}

// Loading indicator functions
function showLoading() {
    // Add loading indicator if needed
    console.log('Loading...');
}

function hideLoading() {
    // Remove loading indicator if needed
    console.log('Loading complete');
}

function showError(message) {
    console.error(message);
    alert(message);
}

// Make showTransactionDetails available globally
window.showTransactionDetails = showTransactionDetails;

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', initializeDashboard); 