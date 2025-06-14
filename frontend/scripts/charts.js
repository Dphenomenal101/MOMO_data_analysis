// Chart color palette
const CHART_COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF99CC'
];

// Create transaction type distribution chart
function createTransactionTypeChart(data) {
    const ctx = document.getElementById('transactionTypeChart');
    
    // Calculate total transactions per type
    const transactionCounts = {
        'Incoming Money': data.incomingMoney.length,
        'Code Payments': data.codePayment.length,
        'Mobile Transfers': data.transferredMoney.length,
        'Bank Deposits': data.bankDeposite.length,
        'Airtime': data.airtime.length,
        'Cash Power': data.cashPowerBill.length,
        'Third Party': data.thirdPartyInitiated.length,
        'Withdrawals': data.withdrawal.length,
        'Bundles': data.bundles.length,
        'Internet': data.internetBundle.length
    };

    // Create the chart
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(transactionCounts),
            datasets: [{
                data: Object.values(transactionCounts),
                backgroundColor: CHART_COLORS,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Transaction Distribution by Type'
                }
            }
        }
    });
}

// Create monthly transaction summary chart
function createMonthlyChart(data) {
    const ctx = document.getElementById('monthlyChart');
    
    // Combine all transactions
    const allTransactions = [
        ...data.incomingMoney,
        ...data.codePayment,
        ...data.transferredMoney,
        ...data.bankDeposite,
        ...data.airtime,
        ...data.cashPowerBill,
        ...data.thirdPartyInitiated,
        ...data.withdrawal,
        ...data.bundles,
        ...data.internetBundle
    ];

    // Group transactions by month
    const monthlyData = allTransactions.reduce((acc, transaction) => {
        const date = new Date(transaction.Date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
        return acc;
    }, {});

    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
        const [monthA, yearA] = a.split('/');
        const [monthB, yearB] = b.split('/');
        return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });

    // Create the chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedMonths,
            datasets: [{
                label: 'Number of Transactions',
                data: sortedMonths.map(month => monthlyData[month]),
                backgroundColor: '#36A2EB',
                borderColor: '#2693e6',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Transactions'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month/Year'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Transaction Volume'
                }
            }
        }
    });
}

// Export functions for use in other scripts
window.charts = {
    createTransactionTypeChart,
    createMonthlyChart
}; 