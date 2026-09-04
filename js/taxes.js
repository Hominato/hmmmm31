/**
 * Alta Federal Credit Union - Tax Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthModule.checkAuthentication();

  if (document.getElementById('taxes-container')) {
    renderTaxesList();
  }

  if (document.getElementById('tax-request-form')) {
    initTaxRequestForm();
  }
});

function renderTaxesList(yearFilter = 'all') {
  const container = document.getElementById('taxes-container');
  const allTaxes = DemoStorage.getTaxes();

  if (!container) return;

  const taxes = yearFilter === 'all' 
    ? allTaxes 
    : allTaxes.filter(t => t.taxYear === yearFilter);

  if (taxes.length === 0) {
    container.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align:center; padding:3rem 1.5rem;">
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--text-muted); margin-bottom:1rem;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 style="font-weight:700; color:var(--text-primary);">No Tax Documents Found</h3>
        <p style="color:var(--text-muted); margin-top:0.5rem; font-size:0.9rem;">There are no official tax forms recorded for the selected filter year.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = taxes.map(tax => {
    const isAvailable = tax.status === 'Available';

    return `
      <div class="card card-hover" style="display:flex; flex-direction:column; gap:1.25rem; border-top: 4px solid var(--accent);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="badge ${isAvailable ? 'badge-success' : 'badge-info'}" style="margin-bottom:0.5rem;">${tax.taxYear} Tax Year</span>
            <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-top:0.2rem;">${tax.name}</h3>
            <div style="font-size:0.85rem; color:var(--text-muted); font-family:monospace;">Ref: ${tax.documentNumber}</div>
          </div>
        </div>

        <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">${tax.description || 'Official annual statement reported to IRS.'}</p>

        <div style="background-color:var(--bg-secondary); border-radius:var(--radius-md); padding:0.85rem; display:flex; justify-content:space-between; font-size:0.875rem;">
          <div>
            <span style="color:var(--text-muted); display:block; font-size:0.75rem; text-transform:uppercase;">Reported Amount</span>
            <strong style="color:var(--text-primary); font-size:1.1rem;">${UIModule.formatCurrency(tax.reportedAmount)}</strong>
          </div>
          <div>
            <span style="color:var(--text-muted); display:block; font-size:0.75rem; text-transform:uppercase;">Tax Withheld</span>
            <strong style="color:var(--text-primary); font-size:1.1rem;">${UIModule.formatCurrency(tax.taxWithheld)}</strong>
          </div>
          <div>
            <span style="color:var(--text-muted); display:block; font-size:0.75rem; text-transform:uppercase;">Issue Date</span>
            <strong style="color:var(--text-primary); display:block; margin-top:0.2rem;">${tax.issueDate}</strong>
          </div>
        </div>

        <div style="display:flex; gap:0.5rem; margin-top:auto;">
          <a href="tax-details.html?id=${tax.id}" class="btn btn-secondary btn-sm" style="flex:1;">View Tax Details</a>
          <button class="btn btn-primary btn-sm" style="flex:1;" onclick="downloadTaxPDF('${tax.id}')">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:0.3rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download PDF
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.filterTaxYear = (year) => {
  renderTaxesList(year);
};

window.downloadTaxPDF = (taxId) => {
  const tax = DemoStorage.getTaxById(taxId);
  if (!tax) return;
  UIModule.showToast(`✓ Downloading official PDF statement for ${tax.formType} (${tax.taxYear})...`, 'info', 3000);
};

window.openRequestTaxModal = () => {
  let modal = document.getElementById('request-tax-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'request-tax-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width:540px;">
        <div class="modal-header">
          <h3 class="modal-title">Request Tax Form / Duplicate Copy</h3>
          <button class="modal-close-btn" onclick="UIModule.closeModal('request-tax-modal')">&times;</button>
        </div>
        <form id="tax-request-form">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Tax Form Type</label>
              <select id="req-tax-type" class="form-control form-select" required>
                <option value="Form 1099-INT">Form 1099-INT (Interest Income Statement)</option>
                <option value="Form 1098">Form 1098 (Mortgage Interest Statement)</option>
                <option value="Form 1099-MISC">Form 1099-MISC (Miscellaneous Income)</option>
                <option value="Form W-9">Form W-9 (Request for Taxpayer ID Certificate)</option>
                <option value="Year-End Summary">Annual Year-End Tax Summary</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tax Year</label>
              <select id="req-tax-year" class="form-control form-select" required>
                <option value="2025" selected>2025 Tax Year</option>
                <option value="2024">2024 Tax Year</option>
                <option value="2023">2023 Tax Year</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Delivery Method</label>
              <select id="req-delivery-method" class="form-control form-select">
                <option value="Electronic PDF Download">Instant PDF Download / Online Portal</option>
                <option value="Mail Hard Copy">Physical Mail to Primary Address</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Special Instructions or Notes (Optional)</label>
              <input type="text" id="req-tax-notes" class="form-control" placeholder="e.g. Include corrected schedule statement">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="UIModule.closeModal('request-tax-modal')">Cancel</button>
            <button type="submit" class="btn btn-primary">Submit Request</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('tax-request-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formType = document.getElementById('req-tax-type').value;
      const taxYear = document.getElementById('req-tax-year').value;
      const deliveryMethod = document.getElementById('req-delivery-method').value;

      const newTax = DemoStorage.requestTaxDocument({ formType, taxYear, deliveryMethod });
      UIModule.closeModal('request-tax-modal');
      UIModule.showToast(`✓ Tax Document Request Created! Reference ID: ${newTax.documentNumber}`, 'success', 5000);
      renderTaxesList();
    });
  }

  UIModule.openModal('request-tax-modal');
};
