import React, { useState } from 'react';

const defaultTaxes = [
  {
    id: 'tax_1099_2025',
    name: 'Form 1099-INT — Interest Income Statement',
    formType: '1099-INT',
    taxYear: '2025',
    documentNumber: 'TAX-2025-1099-01',
    reportedAmount: 1250.00,
    taxWithheld: 0.00,
    payer: 'Wells Fargo Bank, N.A.',
    payerEin: 'XX-XXX4450',
    recipient: 'Meechie Demetrius',
    ssnMasked: '***-**-4450',
    status: 'Available',
    issueDate: 'Jan 31, 2026',
    description: 'Annual interest earned on Savings & Money Market accounts.'
  },
  {
    id: 'tax_1098_2025',
    name: 'Form 1098 — Mortgage Interest Statement',
    formType: '1098',
    taxYear: '2025',
    documentNumber: 'TAX-2025-1098-02',
    reportedAmount: 3780.00,
    taxWithheld: 0.00,
    payer: 'Wells Fargo Bank, N.A.',
    payerEin: 'XX-XXX4450',
    recipient: 'Meechie Demetrius',
    ssnMasked: '***-**-4450',
    status: 'Available',
    issueDate: 'Jan 31, 2026',
    description: 'Mortgage interest and property tax payments reported to the IRS.'
  },
  {
    id: 'tax_1099_2024',
    name: 'Form 1099-INT — 2024 Interest Income Statement',
    formType: '1099-INT',
    taxYear: '2024',
    documentNumber: 'TAX-2024-1099-01',
    reportedAmount: 980.50,
    taxWithheld: 0.00,
    payer: 'Wells Fargo Bank, N.A.',
    payerEin: 'XX-XXX4450',
    recipient: 'Meechie Demetrius',
    ssnMasked: '***-**-4450',
    status: 'Archived',
    issueDate: 'Jan 31, 2025',
    description: 'Prior tax year interest income statement for IRS filing.'
  }
];

export const Taxes = ({
  taxes = defaultTaxes,
  onRequestTaxForm,
  onDownloadPdf
}) => {
  const [selectedYear, setSelectedYear] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState('Form 1099-INT');
  const [taxYear, setTaxYear] = useState('2025');
  const [deliveryMethod, setDeliveryMethod] = useState('Electronic PDF Download');
  const [notes, setNotes] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const filteredTaxes = selectedYear === 'all' 
    ? taxes 
    : taxes.filter(t => t.taxYear === selectedYear);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    const reqId = 'TAX-REQ-' + Math.floor(100000 + Math.random() * 900000);
    if (onRequestTaxForm) {
      onRequestTaxForm({ formType, taxYear, deliveryMethod, notes, reqId });
    }
    setToastMessage(`✓ Tax Document Request Created! Ref: ${reqId}`);
    setIsModalOpen(false);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleDownload = (tax) => {
    if (onDownloadPdf) {
      onDownloadPdf(tax.id);
    }
    setToastMessage(`✓ Downloading official PDF statement for ${tax.name}...`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="taxes-container" style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
          zIndex: 9999,
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Tax Information & Documents</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Access annual tax statements, view interest summaries, or request official tax forms for IRS filing.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.6rem 1.2rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          + Request Tax Form
        </button>
      </div>

      {/* Summary Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>2026 Taxable Interest</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7', margin: '0.25rem 0' }}>$1,250.00</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Form 1099-INT Total Reported</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>2026 Mortgage Interest Paid</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', margin: '0.25rem 0' }}>$3,780.00</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Form 1098 Deductible Amount</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Federal Tax Withheld</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>$0.00</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>SSN / Tax ID: ***-**-4450</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Available Tax Statements</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Filter Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              outline: 'none',
              backgroundColor: '#ffffff'
            }}
          >
            <option value="all">All Tax Years</option>
            <option value="2025">2025 Tax Year</option>
            <option value="2024">2024 Tax Year</option>
          </select>
        </div>
      </div>

      {/* Tax Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filteredTaxes.map(tax => (
          <div
            key={tax.id}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #0284c7',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{
                  backgroundColor: tax.status === 'Available' ? '#dcfce7' : '#e0f2fe',
                  color: tax.status === 'Available' ? '#15803d' : '#0369a1',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {tax.taxYear} Tax Year
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.4rem', color: '#0f172a' }}>{tax.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace' }}>Ref: {tax.documentNumber}</div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>{tax.description}</p>

            <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase' }}>Reported Amount</span>
                <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{formatCurrency(tax.reportedAmount)}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase' }}>Tax Withheld</span>
                <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{formatCurrency(tax.taxWithheld)}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase' }}>Issue Date</span>
                <strong style={{ color: '#0f172a', display: 'block', marginTop: '0.2rem', fontSize: '0.85rem' }}>{tax.issueDate}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <a
                href={`tax-details.html?id=${tax.id}`}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                View Details
              </a>
              <button
                onClick={() => handleDownload(tax)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Request Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '540px',
            padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Request Tax Form / Duplicate Copy</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>

            <form onSubmit={handleRequestSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Tax Form Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  required
                >
                  <option value="Form 1099-INT">Form 1099-INT (Interest Income Statement)</option>
                  <option value="Form 1098">Form 1098 (Mortgage Interest Statement)</option>
                  <option value="Form 1099-MISC">Form 1099-MISC (Miscellaneous Income)</option>
                  <option value="Form W-9">Form W-9 (Request for Taxpayer ID Certificate)</option>
                  <option value="Year-End Summary">Annual Year-End Tax Summary</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Tax Year</label>
                <select
                  value={taxYear}
                  onChange={(e) => setTaxYear(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  required
                >
                  <option value="2025">2025 Tax Year</option>
                  <option value="2024">2024 Tax Year</option>
                  <option value="2023">2023 Tax Year</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Delivery Method</label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                >
                  <option value="Electronic PDF Download">Instant PDF Download / Online Portal</option>
                  <option value="Mail Hard Copy">Physical Mail to Primary Address</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Notes / Special Instructions (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Include corrected schedule statement"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: 'none', background: '#0284c7', color: '#ffffff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Taxes;
