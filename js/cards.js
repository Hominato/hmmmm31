/**
 * Alta Federal Credit Union - Cards Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthModule.checkAuthentication();
  if (document.getElementById('cards-grid-container')) {
    renderDigitalCards();
  }
});

function renderDigitalCards() {
  const container = document.getElementById('cards-grid-container');
  const cards = DemoStorage.getCards();

  if (!container) return;

  container.innerHTML = cards.map(card => `
    <div class="card" style="display:flex; flex-direction:column; gap:1.5rem;">
      <div class="card-visual-wrapper">
        <div class="digital-card ${card.status === 'frozen' ? 'frozen' : ''}" id="card-visual-${card.id}">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:800; font-size:0.9rem; letter-spacing:0.05em;">WELLS FARGO BANK</div>
            <div class="card-type-tag" style="font-size:0.75rem; font-weight:700; background:rgba(255,255,255,0.2); padding:0.2rem 0.5rem; border-radius:4px;">${card.type.toUpperCase()}</div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem;">
            <div class="card-chip"></div>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M1.414 8.414a15 15 0 0121.172 0"/></svg>
          </div>

          <div class="card-number-display">${card.cardNumber}</div>

          <div class="card-details-row">
            <div>
              <div style="font-size:0.65rem; opacity:0.8; text-transform:uppercase;">Card Holder</div>
              <div class="card-holder-name">${card.cardHolder}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; opacity:0.8; text-transform:uppercase;">Expires</div>
              <div style="font-size:0.85rem; font-weight:700;">${card.expDate}</div>
            </div>
            <div class="card-brand-logo">${card.brand}</div>
          </div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:1rem;">
        <div class="switch-container">
          <div class="switch-label-group">
            <span class="switch-title">Freeze Card</span>
            <span class="switch-desc">Temporarily block new purchases</span>
          </div>
          <label class="switch">
            <input type="checkbox" ${card.status === 'frozen' ? 'checked' : ''} onchange="toggleFreezeCard('${card.id}', this.checked)">
            <span class="slider"></span>
          </label>
        </div>

        <div class="form-group">
          <div class="form-label">
            <span>Daily Spending Limit</span>
            <strong id="limit-val-${card.id}">${UIModule.formatCurrency(card.dailyLimit)}</strong>
          </div>
          <input type="range" class="form-control" min="500" max="5000" step="250" value="${card.dailyLimit}" oninput="document.getElementById('limit-val-${card.id}').textContent = UIModule.formatCurrency(this.value)">
        </div>

        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="simulateViewCVV('${card.id}')">Show CVV / PIN</button>
          <button class="btn btn-outline btn-sm" style="flex:1;" onclick="simulateReplaceCard('${card.id}')">Replace Card</button>
        </div>
      </div>
    </div>
  `).join('');
}

window.toggleFreezeCard = (cardId, isFrozen) => {
  const updated = DemoStorage.toggleCardFreeze(cardId);
  if (updated) {
    const visual = document.getElementById(`card-visual-${cardId}`);
    if (isFrozen) {
      visual.classList.add('frozen');
      UIModule.showToast('Card has been frozen. New transactions blocked.', 'warning');
    } else {
      visual.classList.remove('frozen');
      UIModule.showToast('Card un-frozen and reactivated.', 'success');
    }
  }
};

window.simulateViewCVV = (cardId) => {
  UIModule.showToast('Security Verification Passed: CVV is 842, PIN is 4921', 'info', 5000);
};

window.simulateReplaceCard = (cardId) => {
  UIModule.confirmDialog(
    'Request Replacement Card',
    'Are you sure you want to request a replacement card? Your current card will be deactivated and a new card mailed.',
    () => {
      UIModule.showToast('Replacement card request submitted! Estimated delivery: 3-5 business days.', 'success');
    }
  );
};
