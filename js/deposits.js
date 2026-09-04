/**
 * Alta Federal Credit Union - Mobile Check Deposit Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthModule.checkAuthentication();

  if (document.getElementById('deposit-form')) {
    initDepositForm();
  }
});

function initDepositForm() {
  const form = document.getElementById('deposit-form');
  const accountSelect = document.getElementById('deposit-account');
  const amountInput = document.getElementById('deposit-amount');
  const frontInput = document.getElementById('check-front-input');
  const backInput = document.getElementById('check-back-input');

  const accounts = DemoStorage.getAccounts();

  if (accountSelect) {
    accountSelect.innerHTML = accounts.map(a => `
      <option value="${a.id}">${a.name} (${a.accountNumber})</option>
    `).join('');
  }

  // Image Preview handlers
  const handlePreview = (inputEl, previewId) => {
    inputEl.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.getElementById(previewId);
          if (img) {
            img.src = event.target.result;
            img.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  if (frontInput) handlePreview(frontInput, 'front-preview-img');
  if (backInput) handlePreview(backInput, 'back-preview-img');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);
    const accountId = accountSelect.value;

    if (isNaN(amount) || amount <= 0) {
      UIModule.showToast('Please enter a valid deposit amount greater than $0.00', 'error');
      return;
    }

    const refCode = 'DEP-' + Math.floor(100000 + Math.random() * 900000);
    const account = DemoStorage.getAccountById(accountId);

    DemoStorage.updateAccountBalance(accountId, amount);
    DemoStorage.addTransaction({
      description: `Mobile Check Deposit (${refCode})`,
      category: 'Deposit',
      type: 'credit',
      amount: amount,
      balance: account.balance + amount,
      accountId: accountId,
      status: 'Pending Review'
    });

    // Add notification
    const notifications = DemoStorage.getNotifications();
    notifications.unshift({
      id: 'notif_' + Date.now(),
      title: 'Mobile Deposit Received',
      message: `Deposit of ${UIModule.formatCurrency(amount)} for ${account.name} received. Ref: ${refCode}.`,
      date: new Date().toLocaleString(),
      read: false,
      type: 'info'
    });
    DemoStorage.set(STORAGE_KEYS.NOTIFICATIONS, notifications);

    UIModule.showToast(`✓ Check Deposit Submitted! Ref: ${refCode}. Pending Review.`, 'success', 5000);

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  });
}
