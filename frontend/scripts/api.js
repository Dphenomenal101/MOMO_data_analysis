// API endpoint configuration
const API_BASE_URL = 'http://localhost:3000';

// Fetch all transactions
async function fetchTransactions() {
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return {
            incomingMoney: data.incomingMoney || [],
            codePayment: data.codePayment || [],
            transferredMoney: data.transferredMoney || [],
            bankDeposite: data.bankDeposite || [],
            airtime: data.airtime || [],
            cashPowerBill: data.cashPowerBill || [],
            thirdPartyInitiated: data.thirdPartyInitiated || [],
            withdrawal: data.withdrawal || [],
            bundles: data.bundles || [],
            internetBundle: data.internetBundle || [],
            bankTransfer: data.bankTransfer || []
        };
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return null;
    }
}

// Helper function to format transaction data
function formatTransactionData(transactions) {
    return transactions.map(transaction => ({
        date: transaction.Date || 'N/A',
        type: transaction.type || 'Unknown',
        amount: extractAmount(transaction.body) || 0,
        body: transaction.body || '',
    }));
}

// Helper function to extract amount from transaction body
function extractAmount(body) {
    if (!body) return 0;
    const match = body.match(/(\d+,?\d*) RWF/);
    if (match) {
        return parseInt(match[1].replace(',', ''));
    }
    return 0;
}

// Export functions for use in other scripts
window.api = {
    fetchTransactions,
    formatTransactionData
}; 