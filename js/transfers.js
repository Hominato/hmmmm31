/**
 * Alta Federal Credit Union - Transfers Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthModule.checkAuthentication();

  if (document.getElementById('transfer-form')) {
    initTransferForm();
  }

  if (document.getElementById('add-beneficiary-btn')) {
    initBeneficiaryManagement();
  }
});

function initTransferForm() {
  const form = document.getElementById('transfer-form');
  const fromSelect = document.getElementById('transfer-from');
  const toSelect = document.getElementById('transfer-to');
  const amountInput = document.getElementById('transfer-amount');

  const accounts = DemoStorage.getAccounts();
  const beneficiaries = DemoStorage.getBeneficiaries();

  // Populate From Dropdown
  fromSelect.innerHTML = accounts.map(a => `
    <option value="${a.id}">${a.name} (${a.accountNumber}) — ${UIModule.formatCurrency(a.availableBalance)}</option>
  `).join('');

  // Populate To Dropdown
  const updateToOptions = () => {
    const fromId = fromSelect.value;
    let html = '<optgroup label="My Accounts">';
    accounts.filter(a => a.id !== fromId).forEach(a => {
      html += `<option value="account_${a.id}">${a.name} (${a.accountNumber})</option>`;
    });
    html += '</optgroup><optgroup label="Saved Beneficiaries">';
    beneficiaries.forEach(b => {
      html += `<option value="ben_${b.id}">${b.name} (${b.nickname}) — ${b.accountNumberMasked}</option>`;
    });
    html += '</optgroup>';
    toSelect.innerHTML = html;
  };

  fromSelect.addEventListener('change', updateToOptions);
  updateToOptions();

  // Handle Form Submit (Open Confirmation Modal)
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fromId = fromSelect.value;
    const toValue = toSelect.value;
    const amount = parseFloat(amountInput.value);
    const date = document.getElementById('transfer-date')?.value || 'Today';
    const memo = document.getElementById('transfer-memo')?.value || 'Transfer';

    const sourceAccount = DemoStorage.getAccountById(fromId);

    // Validation
    if (isNaN(amount) || amount <= 0) {
      UIModule.showToast('Please enter a valid transfer amount greater than $0.00', 'error');
      return;
    }

    if (amount > sourceAccount.availableBalance) {
      UIModule.showToast(`Insufficient balance. Available: ${UIModule.formatCurrency(sourceAccount.availableBalance)}`, 'error');
      return;
    }

    let recipientName = '';
    let isInternal = false;
    let targetAccountId = null;

    if (toValue.startsWith('account_')) {
      isInternal = true;
      targetAccountId = toValue.replace('account_', '');
      const targetAcc = DemoStorage.getAccountById(targetAccountId);
      recipientName = `${targetAcc.name} (${targetAcc.accountNumber})`;
    } else {
      const benId = toValue.replace('ben_', '');
      const ben = beneficiaries.find(b => b.id === benId);
      recipientName = `${ben.name} (${ben.accountNumberMasked})`;
    }

    // Render Confirmation Screen
    showTransferConfirmationModal({
      fromAccount: sourceAccount,
      toName: recipientName,
      amount,
      date,
      memo,
      isInternal,
      targetAccountId
    });
  });
}

function showTransferConfirmationModal(data) {
  let modal = document.getElementById('transfer-confirm-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'transfer-confirm-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">Confirm Transfer Details</h3>
          <button class="modal-close-btn" onclick="UIModule.closeModal('transfer-confirm-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <div style="text-align:center; margin-bottom:1.5rem;">
            <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase;">Amount to Transfer</div>
            <div style="font-size:2.25rem; font-weight:800; color:var(--accent);" id="confirm-trx-amount">$0.00</div>
          </div>

          <div style="background-color:var(--bg-secondary); border-radius:var(--radius-lg); padding:1rem; display:flex; flex-direction:column; gap:0.75rem; font-size:0.9rem;">
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">From Account:</span>
              <strong id="confirm-trx-from">Checking</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">To Recipient:</span>
              <strong id="confirm-trx-to">Savings</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">Transfer Date:</span>
              <strong id="confirm-trx-date">Today</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">Memo:</span>
              <span id="confirm-trx-memo">Transfer</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="UIModule.closeModal('transfer-confirm-modal')">Cancel</button>
          <button class="btn btn-primary" id="execute-transfer-btn">Confirm Transfer</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById('confirm-trx-amount').textContent = UIModule.formatCurrency(data.amount);
  document.getElementById('confirm-trx-from').textContent = `${data.fromAccount.name} (${data.fromAccount.accountNumber})`;
  document.getElementById('confirm-trx-to').textContent = data.toName;
  document.getElementById('confirm-trx-date').textContent = data.date;
  document.getElementById('confirm-trx-memo').textContent = data.memo;

  const executeBtn = document.getElementById('execute-transfer-btn');
  executeBtn.onclick = () => {
    UIModule.closeModal('transfer-confirm-modal');
    executeTransfer(data);
  };

  UIModule.openModal('transfer-confirm-modal');
}

function executeTransfer(data) {
  const refCode = 'TRX-' + Math.floor(100000 + Math.random() * 900000);

  // Deduct source
  DemoStorage.updateAccountBalance(data.fromAccount.id, -data.amount);
  DemoStorage.addTransaction({
    description: `Transfer to ${data.toName}`,
    category: 'Transfers',
    type: 'debit',
    amount: -data.amount,
    balance: data.fromAccount.balance - data.amount,
    accountId: data.fromAccount.id,
    refCode: refCode
  });

  // Credit target if internal
  if (data.isInternal && data.targetAccountId) {
    const targetAcc = DemoStorage.getAccountById(data.targetAccountId);
    DemoStorage.updateAccountBalance(data.targetAccountId, data.amount);
    DemoStorage.addTransaction({
      description: `Transfer from ${data.fromAccount.name}`,
      category: 'Transfers',
      type: 'credit',
      amount: data.amount,
      balance: targetAcc.balance + data.amount,
      accountId: data.targetAccountId,
      refCode: refCode
    });
  }

  UIModule.showToast(`✓ Transfer Successful! Ref: ${refCode}`, 'success');

  setTimeout(() => {
    window.location.href = `transfer-confirmation.html?ref=${refCode}&amount=${data.amount}&to=${encodeURIComponent(data.toName)}`;
  }, 1000);
}

function initBeneficiaryManagement() {
  const addBtn = document.getElementById('add-beneficiary-btn');
  addBtn.addEventListener('click', () => {
    let modal = document.getElementById('add-ben-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'add-ben-modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">Add Beneficiary</h3>
            <button class="modal-close-btn" onclick="UIModule.closeModal('add-ben-modal')">&times;</button>
          </div>
          <form id="add-ben-form">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Beneficiary Full Name</label>
                <input type="text" id="ben-name" class="form-control" placeholder="e.g. Jane Doe" required>
              </div>
              <div class="form-group">
                <label class="form-label">Nickname</label>
                <input type="text" id="ben-nickname" class="form-control" placeholder="e.g. Sister Jane" required>
              </div>
              <div class="form-group">
                <label class="form-label">Bank Name</label>
                <input type="text" id="ben-bank" class="form-control" placeholder="e.g. Chase Bank" required>
              </div>
              <div class="form-group">
                <label class="form-label">Account Number (Masked)</label>
                <input type="text" id="ben-account" class="form-control" placeholder="**** 1234" required>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="UIModule.closeModal('add-ben-modal')">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Beneficiary</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('add-ben-form').addEventListener('submit', (e) => {
        e.preventDefault();
        DemoStorage.addBeneficiary({
          name: document.getElementById('ben-name').value,
          nickname: document.getElementById('ben-nickname').value,
          bankName: document.getElementById('ben-bank').value,
          accountNumberMasked: document.getElementById('ben-account').value
        });
        UIModule.closeModal('add-ben-modal');
        UIModule.showToast('Beneficiary added successfully!', 'success');
        setTimeout(() => location.reload(), 800);
      });
    }

    UIModule.openModal('add-ben-modal');
  });
}
