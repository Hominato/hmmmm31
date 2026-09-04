/**
 * Alta Federal Credit Union - Settings Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthModule.checkAuthentication();

  if (document.getElementById('settings-container')) {
    renderSettings();
  }
});

function renderSettings() {
  const settings = DemoStorage.getSettings();

  const themeToggle = document.getElementById('setting-theme-toggle');
  const emailAlerts = document.getElementById('setting-email-alerts');
  const smsAlerts = document.getElementById('setting-sms-alerts');
  const loginAlerts = document.getElementById('setting-login-alerts');

  if (themeToggle) themeToggle.checked = settings.theme === 'dark';
  if (emailAlerts) emailAlerts.checked = settings.emailAlerts;
  if (smsAlerts) smsAlerts.checked = settings.smsAlerts;
  if (loginAlerts) loginAlerts.checked = settings.loginAlerts;

  themeToggle?.addEventListener('change', (e) => {
    const nextTheme = e.target.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    DemoStorage.updateSettings({ theme: nextTheme });
    UIModule.showToast(`Theme updated to ${nextTheme} mode`, 'info');
  });

  document.getElementById('save-settings-btn')?.addEventListener('click', () => {
    DemoStorage.updateSettings({
      emailAlerts: emailAlerts?.checked ?? true,
      smsAlerts: smsAlerts?.checked ?? true,
      loginAlerts: loginAlerts?.checked ?? true
    });
    UIModule.showToast('✓ Settings saved successfully', 'success');
  });

  document.getElementById('reset-demo-btn')?.addEventListener('click', () => {
    UIModule.confirmDialog(
      'Reset All Account Data?',
      'This will reset your balances, transactions, and settings back to default.',
      () => {
        DemoStorage.resetDemoData();
        UIModule.showToast('Account data reset to default.', 'info');
        setTimeout(() => location.reload(), 1000);
      }
    );
  });
}
