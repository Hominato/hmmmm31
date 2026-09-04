/**
 * Alta Federal Credit Union - Bills Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthModule.checkAuthentication();

  if (document.getElementById('bills-table-tbody')) {
    renderBillsList();
  }

  if (document.getElementById('add-biller-btn')) {
    initAddBillerModal();
  }
});

function renderBillsList() {
  const tbody = document.getElementById('bills-table-tbody');
  const bills = DemoStorage.getBills();
  const accounts = DemoStorage.getAccounts();

  if (!tbody) return;

  if (bills.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:3rem;">No active billers found.</td></tr>`;
    return;
  }

  tbody.innerHTML = bills.map(b => `
    <tr>
      <td>
        <strong style="color:var(--text-primary); font-size:0.95rem;">${b.biller}</strong>
        <div style="font-size:0.775rem; color:var(--text-muted);">${b.accountNumber} • ${b.category}</div>
      </td>
      <td style="color:var(--text-secondary); font-size:0.875rem;">${UIModule.formatDate(b.dueDate)}</td>
      <td style="font-weight:700; font-size:0.95rem;">${UIModule.formatCurrency(b.amount)}</td>
      <td>
        <span class="badge ${b.status === 'Paid' ? 'badge-success' : 'badge-warning'}">${b.status}</span>
      </td>
      <td>
        <span class="badge ${b.autoPay ? 'badge-info' : 'badge-secondary'}">${b.autoPay ? 'AutoPay ON' : 'Manual'}</span>
      </td>
      <td style="text-align:right;">
        ${b.status !== 'Paid' ? `
          <button class="btn btn-primary btn-sm" onclick="openPayBillModal('${b.id}')">Pay Now</button>
        ` : `
          <button class="btn btn-secondary btn-sm" disabled>Paid</button>
        `}
      </td>
    </tr>
  `).join('');
}

window.openPayBillModal = (billId) => {
  const bills = DemoStorage.getBills();
  const bill = bills.find(b => b.id === billId);
  const accounts = DemoStorage.getAccounts();

  if (!bill) return;

  let modal = document.getElementById('pay-bill-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pay-bill-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">Pay Bill</h3>
          <button class="modal-close-btn" onclick="UIModule.closeModal('pay-bill-modal')">&times;</button>
        </div>
        <form id="pay-bill-form">
          <div class="modal-body">
            <div style="background:var(--bg-secondary); padding:1rem; border-radius:var(--radius-lg); margin-bottom:1rem;">
              <div style="font-size:0.8rem; color:var(--text-muted);">Pay To</div>
              <h4 id="pay-bill-name" style="margin-bottom:0.25rem;">Biller Name</h4>
              <div style="font-size:1.5rem; font-weight:800; color:var(--accent);" id="pay-bill-amount">$0.00</div>
            </div>

            <div class="form-group">
              <label class="form-label">Pay From Account</label>
              <select id="pay-bill-account" class="form-control form-select">
                ${accounts.map(a => `<option value="${a.id}">${a.name} (${a.accountNumber}) — Avail: ${UIModule.formatCurrency(a.availableBalance)}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="UIModule.closeModal('pay-bill-modal')">Cancel</button>
            <button type="submit" class="btn btn-primary">Confirm Payment</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById('pay-bill-name').textContent = bill.biller;
  document.getElementById('pay-bill-amount').textContent = UIModule.formatCurrency(bill.amount);

  const form = document.getElementById('pay-bill-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const accountId = document.getElementById('pay-bill-account').value;

    try {
      DemoStorage.payBill(bill.id, accountId);
      UIModule.closeModal('pay-bill-modal');
      UIModule.showToast(`✓ Bill Payment of ${UIModule.formatCurrency(bill.amount)} to ${bill.biller} successful!`, 'success');
      setTimeout(() => location.reload(), 800);
    } catch (err) {
      UIModule.showToast(err.message, 'error');
    }
  };

  UIModule.openModal('pay-bill-modal');
};

function initAddBillerModal() {
  const addBtn = document.getElementById('add-biller-btn');
  addBtn.addEventListener('click', () => {
    let modal = document.getElementById('add-biller-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'add-biller-modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">Add Biller</h3>
            <button class="modal-close-btn" onclick="UIModule.closeModal('add-biller-modal')">&times;</button>
          </div>
          <form id="add-biller-form">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Biller Name</label>
                <input type="text" id="new-biller-name" class="form-control" placeholder="e.g. City Gas Co" required>
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <select id="new-biller-category" class="form-control form-select">
                  <option value="Utilities">Utilities</option>
                  <option value="Internet">Internet</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Mobile Phone">Mobile Phone</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Biller Account Number</label>
                <input type="text" id="new-biller-account" class="form-control" placeholder="e.g. ACC-9941" required>
              </div>
              <div class="form-group">
                <label class="form-label">Monthly Bill Amount ($)</label>
                <input type="number" step="0.01" id="new-biller-amount" class="form-control" placeholder="75.00" required>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="UIModule.closeModal('add-biller-modal')">Cancel</button>
              <button type="submit" class="btn btn-primary">Add Biller</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('add-biller-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const bills = DemoStorage.getBills();
        bills.push({
          id: 'bill_' + Date.now(),
          biller: document.getElementById('new-biller-name').value,
          category: document.getElementById('new-biller-category').value,
          accountNumber: document.getElementById('new-biller-account').value,
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          amount: parseFloat(document.getElementById('new-biller-amount').value),
          status: 'Unpaid',
          autoPay: false
        });
        DemoStorage.set(STORAGE_KEYS.BILLS, bills);
        UIModule.closeModal('add-biller-modal');
        UIModule.showToast('Biller added successfully!', 'success');
        setTimeout(() => location.reload(), 800);
      });
    }

    UIModule.openModal('add-biller-modal');
  });
}
