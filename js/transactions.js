/**
 * Alta Federal Credit Union - Transactions Controller
 */

let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
  AuthModule.checkAuthentication();
  if (document.getElementById('transactions-table-tbody')) {
    initTransactionsPage();
  }
});

function initTransactionsPage() {
  const searchInput = document.getElementById('trx-search');
  const catSelect = document.getElementById('trx-category-filter');
  const typeSelect = document.getElementById('trx-type-filter');
  const exportBtn = document.getElementById('export-csv-btn');

  let searchQuery = '';
  let selectedCategory = 'all';
  let selectedType = 'all';

  const render = () => {
    let list = DemoStorage.getTransactions();

    // Filtering
    if (selectedType === 'credit') list = list.filter(t => t.amount > 0);
    if (selectedType === 'debit') list = list.filter(t => t.amount < 0);
    if (selectedCategory !== 'all') list = list.filter(t => t.category.toLowerCase() === selectedCategory.toLowerCase());
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.date.includes(q));
    }

    // Pagination
    const totalPages = Math.ceil(list.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = list.slice(startIndex, startIndex + itemsPerPage);

    const tbody = document.getElementById('transactions-table-tbody');
    if (!tbody) return;

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:3rem;">No transactions found.</td></tr>`;
    } else {
      tbody.innerHTML = paginated.map(t => `
        <tr>
          <td style="color:var(--text-secondary); font-size:0.875rem;">${UIModule.formatDate(t.date)}</td>
          <td><strong style="color:var(--text-primary); font-size:0.9rem;">${t.description}</strong></td>
          <td><span class="badge badge-info">${t.category}</span></td>
          <td><span class="badge badge-secondary" style="text-transform:capitalize;">${t.type}</span></td>
          <td style="text-align:right;" class="${t.amount > 0 ? 'trx-amount-credit' : 'trx-amount-debit'}">
            ${t.amount > 0 ? '+' : ''}${UIModule.formatCurrency(t.amount)}
          </td>
          <td style="text-align:right; font-family:monospace; color:var(--text-secondary);">${UIModule.formatCurrency(t.balance)}</td>
          <td><span class="badge badge-success">${t.status}</span></td>
        </tr>
      `).join('');
    }

    // Pagination controls
    const paginationSlot = document.getElementById('pagination-controls');
    if (paginationSlot) {
      paginationSlot.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem; flex-wrap:wrap; gap:1rem;">
          <div style="font-size:0.875rem; color:var(--text-muted);">
            Showing ${list.length === 0 ? 0 : startIndex + 1} to ${Math.min(startIndex + itemsPerPage, list.length)} of ${list.length} transactions
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-sm" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(-1)">Previous</button>
            <span style="display:flex; align-items:center; padding:0 0.75rem; font-size:0.875rem; font-weight:600;">Page ${currentPage} of ${totalPages}</span>
            <button class="btn btn-secondary btn-sm" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(1)">Next</button>
          </div>
        </div>
      `;
    }
  };

  window.changePage = (delta) => {
    currentPage += delta;
    render();
  };

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    currentPage = 1;
    render();
  });

  catSelect?.addEventListener('change', (e) => {
    selectedCategory = e.target.value;
    currentPage = 1;
    render();
  });

  typeSelect?.addEventListener('change', (e) => {
    selectedType = e.target.value;
    currentPage = 1;
    render();
  });

  exportBtn?.addEventListener('click', () => {
    const list = DemoStorage.getTransactions();
    let csv = 'Date,Description,Category,Type,Amount,Balance,Status\n';
    list.forEach(t => {
      csv += `"${t.date}","${t.description}","${t.category}","${t.type}",${t.amount},${t.balance},"${t.status}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Wells_Fargo_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
    UIModule.showToast('Transactions exported as CSV', 'success');
  });

  render();
}
