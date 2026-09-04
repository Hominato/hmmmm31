/**
 * Alta Federal Credit Union - Support Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthModule.checkAuthentication();

  const form = document.getElementById('support-ticket-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const ticketId = 'SUP-' + Math.floor(100000 + Math.random() * 900000);
    
    UIModule.showToast(`✓ Support ticket submitted! Ticket ID: ${ticketId}`, 'success', 5000);
    form.reset();
  });
});
