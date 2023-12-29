document.addEventListener('DOMContentLoaded', function() {
  loadInitialTransactions();
  
  document.getElementById('search-input').disabled = false;
  document.getElementById('search-button').disabled = false;


  document.getElementById('search-button').addEventListener('click', performSearch);


  document.getElementById('search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      performSearch();
    }
  });

  document.querySelector('.faq-toggle').addEventListener('click', function() {
    const faqContent = document.getElementById('faq-content');
    faqContent.style.display = faqContent.style.display === 'block' ? 'none' : 'block';
  });

  function performSearch() {
    const address = document.getElementById('search-input').value.trim();
    if (address) {
      searchTransactions(address);
    }
  }

  function displayTransactions(transactions) {
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = '';

    transactions.forEach(([txHash, transaction]) => {
      const transactionElement = document.createElement('div');
      transactionElement.classList.add('transaction');
      const dateOnly = transaction.date.split('T')[0];

      transactionElement.innerHTML = `
        <div>Tx Hash: <a href="https://etherscan.io/tx/${txHash}" target="_blank">${txHash}</a></div>
        <div>Date: ${dateOnly}</div>
        <div>Amount: ${transaction.amount} ${transaction.asset}</div>
        <div>Protocol: ${transaction.protocol}</div>
        <div>From: ${transaction.fromAddress}</div>
        <div>To: <a href="https://metasleuth.io/result/eth/${transaction.toAddress}" target="_blank">${transaction.toAddress}</a></div>
      `;
      resultsElement.appendChild(transactionElement);
    });
  }

  function loadInitialTransactions() {
    fetch('ledger.json')
      .then(response => response.json())
      .then(data => {
        const transactions = Object.entries(data);
        displayTransactions(transactions.slice(-2));
      });
  }
  document.getElementById('date-button').addEventListener('click', function() {
    const selectedDate = document.getElementById('date-input').value;
    if (selectedDate) {
      searchTransactionsByDate(selectedDate);
    }
  });
  
  function searchTransactionsByDate(selectedDate) {
    fetch('ledger.json')
      .then(response => response.json())
      .then(data => {
        const transactions = Object.entries(data);
        const dateFormatted = new Date(selectedDate).toISOString().split('T')[0];
        const matchedTransactions = transactions.filter(([txHash, transaction]) =>
          transaction.date.startsWith(dateFormatted)
        );
        displayTransactions(matchedTransactions);
      })
      .catch(error => {
        console.error('Error fetching the transactions:', error);
      });
  }

  function searchTransactions(address) {
    fetch('ledger.json')
      .then(response => response.json())
      .then(data => {
        const transactions = Object.entries(data);
        const matchedTransactions = transactions.filter(([txHash, transaction]) =>
          transaction.fromAddress.toLowerCase() === address.toLowerCase() ||
          transaction.toAddress.toLowerCase() === address.toLowerCase()
        );
        displayTransactions(matchedTransactions);
      })
      .catch(error => {
        console.error('Error fetching the transactions:', error);
      });
  }

  
});
