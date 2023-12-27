document.addEventListener('DOMContentLoaded', function() {
  // Load the last two transactions as placeholders
  fetch('ledger.json')
    .then(response => response.json())
    .then(data => {
      const transactions = Object.values(data);
      displayTransactions(transactions.slice(-2)); // Display the last 2 transactions
    });

  // Enable the search input and button
  document.getElementById('search-input').disabled = false;
  document.getElementById('search-button').disabled = false;

  // Event listener for the search button
  document.getElementById('search-button').addEventListener('click', function() {
    const address = document.getElementById('search-input').value.trim();
    if (address) {
      searchTransactions(address);
    }
  });

  // Function to display transactions in the results box
  function displayTransactions(transactions) {
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = ''; // Clear previous results

    transactions.forEach(transaction => {
      const transactionElement = document.createElement('div');
      transactionElement.classList.add('transaction');
      transactionElement.innerHTML = `
        <div>Date: ${transaction.date}</div>
        <div>Amount: ${transaction.amount} ${transaction.asset}</div>
        <div>Protocol: ${transaction.protocol}</div>
        <div>From: ${transaction.fromAddress}</div>
        <div>To: ${transaction.toAddress}</div>
      `;
      resultsElement.appendChild(transactionElement);
    });
  }

  // Search function to find transactions that match the entered address
  function searchTransactions(address) {
    fetch('ledger.json')
      .then(response => response.json())
      .then(data => {
        const transactions = Object.values(data);
        const matchedTransactions = transactions.filter(transaction =>
          transaction.fromAddress.toLowerCase() === address.toLowerCase() ||
          transaction.toAddress.toLowerCase() === address.toLowerCase()
        );
        if (matchedTransactions.length === 0) {
          const resultsElement = document.getElementById('results');
          resultsElement.innerHTML = '<div>No transactions found.</div>';
        } else {
          displayTransactions(matchedTransactions);
        }
      })
      .catch(error => {
        console.error('Error fetching the transactions:', error);
      });
  }
});
