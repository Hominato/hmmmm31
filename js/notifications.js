/**
 * Alta Federal Credit Union - Notifications Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthModule.checkAuthentication();

  if (document.getElementById('notifications-list-container')) {
    renderNotificationsList();
  }
});

function renderNotificationsList() {
  const container = document.getElementById('notifications-list-container');
  const notifs = DemoStorage.getNotifications();

  if (!container) return;

  if (notifs.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem; color:var(--text-muted);">
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom:1rem; opacity:0.5;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        <h3>No notifications</h3>
        <p style="font-size:0.875rem;">You are all caught up with your account alerts.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = notifs.map(n => `
    <div class="card" style="margin-bottom:1rem; border-left: 4px solid ${n.read ? 'var(--border-color)' : 'var(--accent)'}; opacity: ${n.read ? '0.75' : '1'};">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <h4 style="font-size:1rem; font-weight:700;">${n.title}</h4>
          <p style="font-size:0.875rem; color:var(--text-secondary); margin-top:0.25rem;">${n.message}</p>
          <span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-top:0.5rem;">${n.date}</span>
        </div>
        ${!n.read ? `
          <button class="btn btn-secondary btn-sm" onclick="markRead('${n.id}')">Mark as Read</button>
        ` : ''}
      </div>
    </div>
  `).join('');

  document.getElementById('clear-all-notifs-btn')?.addEventListener('click', () => {
    DemoStorage.clearAllNotifications();
    renderNotificationsList();
    UIModule.showToast('Cleared all notifications', 'info');
  });
}

window.markRead = (id) => {
  DemoStorage.markNotificationRead(id);
  renderNotificationsList();
};
