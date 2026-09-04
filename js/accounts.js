/**
 * Alta Federal Credit Union - Accounts Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthModule.checkAuthentication();

  if (document.getElementById('accounts-list-container')) {
    renderAccountsOverview();
  }

  if (document.getElementById('account-details-container')) {
    renderAccountDetails();
  }
});

function renderAccountsOverview() {
  const container = document.getElementById('accounts-list-container');
  const accounts = DemoStorage.getAccounts();

  if (!container) return;

  container.innerHTML = accounts.map(acc => `
    <div class="account-card card-hover">
      <div class="account-card-header">
        <div class="account-type-badge">
          <div class="brand-icon" style="width:30px; height:30px; font-size:0.85rem;">${acc.type[0].toUpperCase()}</div>
          <span>${acc.name}</span>
        </div>
        <span class="account-number-masked">${acc.accountNumber}</span>
      </div>

      <div class="account-balance-amount">${UIModule.formatCurrency(acc.balance)}</div>
      <div class="account-balance-avail">Available Balance: <strong>${UIModule.formatCurrency(acc.availableBalance)}</strong></div>
      
      <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.5rem; display:flex; justify-content:space-between;">
        <span>APY Interest Rate: <strong>${acc.apy}</strong></span>
        <span>Routing: <strong>${acc.routingNumber}</strong></span>
      </div>

      <div class="account-card-actions">
        <a href="account-details.html?id=${acc.id}" class="btn btn-secondary btn-sm" style="flex:1;">View Details</a>
        <a href="transfers.html?from=${acc.id}" class="btn btn-outline btn-sm" style="flex:1;">Transfer</a>
        <a href="statements.html" class="btn btn-outline btn-sm">Statements</a>
      </div>
    </div>
  `).join('');
}

function renderAccountDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('id') || 'acc_checking';
  const account = DemoStorage.getAccountById(accountId) || DemoStorage.getAccounts()[0];

  // Fill Header Data
  document.getElementById('acc-detail-name').textContent = account.name;
  document.getElementById('acc-detail-number').textContent = `Account ${account.accountNumber} • Routing: ${account.routingNumber}`;
  document.getElementById('acc-detail-balance').textContent = UIModule.formatCurrency(account.balance);
  document.getElementById('acc-detail-avail').textContent = UIModule.formatCurrency(account.availableBalance);
  document.getElementById('acc-detail-apy').textContent = account.apy;

  let currentFilter = 'all';
  let searchQuery = '';

  const filterSelect = document.getElementById('trx-filter-type');
  const searchInput = document.getElementById('trx-search-input');

  const renderTransactions = () => {
    const transactions = DemoStorage.getTransactions().filter(t => t.accountId === account.id || !t.accountId);
    
    const filtered = transactions.filter(t => {
      // Type Filter
      if (currentFilter === 'deposits' && t.amount <= 0) return false;
      if (currentFilter === 'withdrawals' && t.amount >= 0) return false;
      if (currentFilter === 'transfers' && t.category !== 'Transfers') return false;
      if (currentFilter === 'bills' && t.category !== 'Utilities') return false;
      
      // Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      }
      return true;
    });

    const tbody = document.getElementById('account-trx-tbody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:2rem;">No matching transactions found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(t => `
      <tr>
        <td style="color:var(--text-secondary);">${UIModule.formatDate(t.date)}</td>
        <td>
          <strong style="color:var(--text-primary); font-size:0.9rem;">${t.description}</strong>
        </td>
        <td><span class="badge badge-info">${t.category}</span></td>
        <td><span class="badge badge-success">${t.status}</span></td>
        <td style="text-align:right;" class="${t.amount > 0 ? 'trx-amount-credit' : 'trx-amount-debit'}">
          ${t.amount > 0 ? '+' : ''}${UIModule.formatCurrency(t.amount)}
        </td>
      </tr>
    `).join('');
  };

  filterSelect?.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderTransactions();
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTransactions();
  });

  document.getElementById('export-statement-btn')?.addEventListener('click', () => {
    UIModule.showToast('Statement exported successfully as CSV.', 'success');
  });

  renderTransactions();
}
