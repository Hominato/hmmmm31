import React from 'react';

const defaultTax = {
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
  description: 'Annual interest earned on Savings & Money Market accounts.',
  boxDetails: [
    { box: 'Box 1', title: 'Interest Income', amount: '$1,250.00' },
    { box: 'Box 2', title: 'Early Withdrawal Penalty', amount: '$0.00' },
    { box: 'Box 4', title: 'Federal Income Tax Withheld', amount: '$0.00' },
    { box: 'Box 8', title: 'Tax-Exempt Interest', amount: '$0.00' }
  ]
};

export const TaxDetails = ({
  tax = defaultTax,
  onDownloadPdf,
  onPrint
}) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  };

  const handleDownload = () => {
    if (onDownloadPdf) onDownloadPdf(tax.id);
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <a href="#taxes" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0284c7', textDecoration: 'none' }}>← Back to Taxes</a>
          <h1 style={{ marginTop: '0.25rem', fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{tax.name}</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Document Ref {tax.documentNumber} &bull; {tax.taxYear} Tax Year &bull; Issued {tax.issueDate}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={onPrint || (() => window.print())}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#334155'
            }}
          >
            🖨 Print
          </button>
          <button
            onClick={handleDownload}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            ⬇ Download PDF
          </button>
        </div>
      </div>

      {/* Payer / Recipient Info */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '1.25rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Payer / Financial Institution</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>{tax.payer}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Federal EIN: {tax.payerEin}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>332 W 13th St, Deer Park, NY 11729</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Recipient / Member</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>{tax.recipient}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>SSN / Tax ID: {tax.ssnMasked}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Account Holder in Good Standing</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Tax Form Type</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7' }}>{tax.formType}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Reported Amount</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{formatCurrency(tax.reportedAmount)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>IRS Filing Status</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', marginTop: '0.2rem' }}>Ready for Filing</div>
          </div>
        </div>
      </div>

      {/* Box Details Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', overflow: 'hidden' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Official Tax Form Box Breakdown</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: '#334155' }}>Box #</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: '#334155' }}>Description / Line Item</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: '#334155' }}>Reported Amount</th>
            </tr>
          </thead>
          <tbody>
            {(tax.boxDetails || []).map((box, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0284c7' }}>{box.box}</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#334155' }}>{box.title}</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', fontSize: '1.05rem', color: '#0f172a' }}>{box.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* IRS Notice */}
      <div style={{
        backgroundColor: '#f0f9ff',
        borderLeft: '4px solid #0284c7',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem'
      }}>
        <svg width="22" height="22" fill="none" stroke="#0284c7" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '0.1rem' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>IRS Tax Reporting Notice</div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem', lineHeight: 1.6 }}>
            This information is being furnished to the Internal Revenue Service. If you are required to file a return, a negligence penalty or other sanction may be imposed on you if this income is taxable and the IRS determines that it has not been reported.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxDetails;
