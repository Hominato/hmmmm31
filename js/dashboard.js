/**
 * Alta Federal Credit Union - Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthModule.checkAuthentication();
  renderDashboardData();
});

function renderDashboardData() {
  const user = DemoStorage.getUser();
  const accounts = DemoStorage.getAccounts();
  const transactions = DemoStorage.getTransactions();

  const welcomeSub = document.querySelector('.page-subtitle');
  if (welcomeSub && user) {
    welcomeSub.textContent = `Welcome back, ${user.name}! Here is your financial overview.`;
  }

  // Balances
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const availableBalance = accounts.reduce((sum, a) => sum + a.availableBalance, 0);
  const checkingAccount = accounts.find(a => a.type === 'checking') || accounts[0];
  const savingsAccount = accounts.find(a => a.type === 'savings') || accounts[1];

  // Element Binds
  const elTotal = document.getElementById('dash-total-balance');
  const elAvail = document.getElementById('dash-available-balance');
  const elChecking = document.getElementById('dash-checking-balance');
  const elSavings = document.getElementById('dash-savings-balance');

  if (elTotal) elTotal.textContent = UIModule.formatCurrency(totalBalance);
  if (elAvail) elAvail.textContent = UIModule.formatCurrency(availableBalance);
  if (elChecking) elChecking.textContent = UIModule.formatCurrency(checkingAccount ? checkingAccount.balance : 0);
  if (elSavings) elSavings.textContent = UIModule.formatCurrency(savingsAccount ? savingsAccount.balance : 0);

  // Recent Transactions List
  const trxListSlot = document.getElementById('recent-transactions-list');
  if (trxListSlot) {
    const recent = transactions.slice(0, 5);
    if (recent.length === 0) {
      trxListSlot.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:2rem;">No recent transactions.</td></tr>`;
    } else {
      trxListSlot.innerHTML = recent.map(t => `
        <tr>
          <td>
            <div style="display:flex; align-items:center;">
              <span class="trx-merchant-icon">${t.description[0]}</span>
              <div>
                <strong style="color:var(--text-primary); font-size:0.925rem;">${t.description}</strong>
                <div style="font-size:0.775rem; color:var(--text-muted);">${t.category}</div>
              </div>
            </div>
          </td>
          <td style="color:var(--text-secondary); font-size:0.875rem;">${UIModule.formatDate(t.date)}</td>
          <td><span class="badge badge-success">${t.status}</span></td>
          <td style="text-align:right;" class="${t.amount > 0 ? 'trx-amount-credit' : 'trx-amount-debit'}">
            ${t.amount > 0 ? '+' : ''}${UIModule.formatCurrency(t.amount)}
          </td>
        </tr>
      `).join('');
    }
  }
}
