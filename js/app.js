/**
 * Alta Federal Credit Union - DEMO Main App Controller
 * Manages Theme, Layout Components, Toasts, Modals & Search
 */

const UIModule = {
  init() {
    this.initTheme();
    this.renderHeaderAndSidebar();
    this.setupGlobalSearch();
    this.setupToasts();
    this.bindEvents();
  },

  // Theme Management
  initTheme() {
    const settings = DemoStorage.getSettings();
    const currentTheme = settings.theme || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    DemoStorage.updateSettings({ theme: next });
    this.showToast(`Switched to ${next} mode`, 'info');
  },

  // Formatting Utilities
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  },

  // Dynamic Header & Sidebar Injection
  renderHeaderAndSidebar() {
    const isPublicPage = document.body.classList.contains('public-page');
    if (isPublicPage) return;

    // Top Navbar Injection if placeholder exists
    const navbarSlot = document.getElementById('navbar-slot');
    if (navbarSlot) {
      const user = DemoStorage.getUser();
      const notifs = DemoStorage.getNotifications();
      const unreadCount = notifs.filter(n => !n.read).length;

      navbarSlot.innerHTML = `
        <header class="top-navbar">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <button class="hamburger-btn" id="sidebar-toggle-btn" title="Open Navigation" aria-label="Open menu">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <a href="dashboard.html" class="nav-brand">
              <div class="brand-icon">WF</div>
              <span>Wells Fargo</span>
            </a>
          </div>

          <div class="nav-right">
            <button class="nav-search-btn" id="global-search-trigger">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <span>Search banking... (⌘K)</span>
            </button>

            <button class="nav-icon-btn" id="theme-toggle-btn" title="Toggle Light/Dark Theme">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            </button>

            <a href="notifications.html" class="nav-icon-btn" title="Notifications">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              ${unreadCount > 0 ? '<span class="notification-dot"></span>' : ''}
            </a>

            <div class="profile-menu-trigger" onclick="window.location.href='profile.html'">
              <div class="avatar">${user.firstName[0]}${user.lastName[0]}</div>
              <span class="user-info-name">${user.firstName}</span>
            </div>
          </div>
        </header>
      `;

      document.getElementById('theme-toggle-btn')?.addEventListener('click', () => this.toggleTheme());
      document.getElementById('global-search-trigger')?.addEventListener('click', () => this.openSearchModal());
      document.getElementById('sidebar-toggle-btn')?.addEventListener('click', () => this.toggleSidebar());
    }

    // Sidebar Backdrop for mobile
    if (!document.getElementById('sidebar-backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.id = 'sidebar-backdrop';
      backdrop.className = 'sidebar-backdrop';
      backdrop.addEventListener('click', () => this.closeSidebar());
      document.body.appendChild(backdrop);
    }

    // Sidebar Navigation Injection
    const sidebarSlot = document.getElementById('sidebar-slot');
    if (sidebarSlot) {
      const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
      
      const navLinks = [
        { path: 'dashboard.html', label: 'Dashboard', icon: '<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>' },
        { path: 'accounts.html', label: 'Accounts', icon: '<path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>' },
        { path: 'transfers.html', label: 'Transfers', icon: '<path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>' },
        { path: 'transactions.html', label: 'Transactions', icon: '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>' },
        { path: 'cards.html', label: 'Cards', icon: '<path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>' },
        { path: 'bills.html', label: 'Bill Pay', icon: '<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>' },
        { path: 'deposits.html', label: 'Deposits', icon: '<path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>' },
        { path: 'taxes.html', label: 'Taxes', icon: '<path d="M9 7h6m-6 4h6m-6 4h4M12 3v4a1 1 0 001 1h4m-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"/>' },
        { path: 'statements.html', label: 'Statements', icon: '<path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>' },
        { path: 'security.html', label: 'Security', icon: '<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>' },
        { path: 'support.html', label: 'Support', icon: '<path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>' },
        { path: 'settings.html', label: 'Settings', icon: '<path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>' }
      ];

      sidebarSlot.innerHTML = `
        <aside class="sidebar-nav">
          <ul class="nav-list">
            ${navLinks.map(item => `
              <li class="nav-item ${currentPath === item.path ? 'active' : ''}">
                <a href="${item.path}">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${item.icon}
                  </svg>
                  <span>${item.label}</span>
                </a>
              </li>
            `).join('')}
          </ul>

          <div class="sidebar-bottom">
            <button class="btn btn-outline" style="width:100%; justify-content:flex-start;" id="logout-sidebar-btn">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              <span>Logout</span>
            </button>
          </div>
        </aside>
      `;

      document.getElementById('logout-sidebar-btn')?.addEventListener('click', () => AuthModule.logout());

      // Close sidebar when a nav link is clicked (mobile)
      sidebarSlot.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', () => this.closeSidebar());
      });
    }

    // Mobile Bottom Nav Slot
    const mobileNavSlot = document.getElementById('mobile-nav-slot');
    if (mobileNavSlot) {
      const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
      mobileNavSlot.innerHTML = `
        <nav class="mobile-bottom-nav">
          <a href="dashboard.html" class="mobile-nav-item ${currentPath === 'dashboard.html' ? 'active' : ''}">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span>Home</span>
          </a>
          <a href="accounts.html" class="mobile-nav-item ${currentPath === 'accounts.html' ? 'active' : ''}">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span>Accounts</span>
          </a>
          <a href="transfers.html" class="mobile-nav-item ${currentPath === 'transfers.html' ? 'active' : ''}">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            <span>Transfer</span>
          </a>
          <a href="transactions.html" class="mobile-nav-item ${currentPath === 'transactions.html' ? 'active' : ''}">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
            <span>History</span>
          </a>
          <button class="mobile-nav-item" id="mobile-menu-btn" style="background:none; border:none; cursor:pointer;">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <span>Menu</span>
          </button>
        </nav>
      `;

      document.getElementById('mobile-menu-btn')?.addEventListener('click', () => this.toggleSidebar());
    }
  },

  // Toast Notification System
  setupToasts() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
  },

  showToast(message, type = 'success', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'warning') icon = '⚠';
    if (type === 'info') icon = 'ℹ';

    toast.innerHTML = `
      <span style="font-weight:bold; font-size:1.1rem;">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Reusable Confirmation Dialog Modal
  confirmDialog(title, message, onConfirm) {
    let overlay = document.getElementById('confirm-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'confirm-modal-overlay';
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title" id="confirm-modal-title">Confirm Action</h3>
            <button class="modal-close-btn" onclick="UIModule.closeModal('confirm-modal-overlay')">&times;</button>
          </div>
          <div class="modal-body" id="confirm-modal-body">
            Are you sure?
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="UIModule.closeModal('confirm-modal-overlay')">Cancel</button>
            <button class="btn btn-primary" id="confirm-modal-action-btn">Confirm</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-body').textContent = message;
    
    const confirmBtn = document.getElementById('confirm-modal-action-btn');
    confirmBtn.onclick = () => {
      this.closeModal('confirm-modal-overlay');
      if (onConfirm) onConfirm();
    };

    this.openModal('confirm-modal-overlay');
  },

  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  },

  // Global Search Modal setup
  setupGlobalSearch() {
    let searchModal = document.getElementById('global-search-modal');
    if (!searchModal) {
      searchModal = document.createElement('div');
      searchModal.id = 'global-search-modal';
      searchModal.className = 'modal-overlay';
      searchModal.innerHTML = `
        <div class="modal-card" style="max-width:650px;">
          <div class="modal-header">
            <div style="display:flex; align-items:center; gap:0.5rem; width:100%;">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" id="global-search-input" class="form-control" placeholder="Search transactions, accounts, bills, taxes..." style="border:none; box-shadow:none; font-size:1.1rem;" autofocus>
            </div>
            <button class="modal-close-btn" onclick="UIModule.closeModal('global-search-modal')">&times;</button>
          </div>
          <div class="modal-body" style="max-height:400px; overflow-y:auto;" id="global-search-results">
            <div style="text-align:center; color:var(--text-muted); padding:2rem;">
              Type to search across transactions, accounts, and help topics...
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(searchModal);

      document.getElementById('global-search-input')?.addEventListener('input', (e) => this.performSearch(e.target.value));
    }

    // Keyboard shortcut CMD+K / CTRL+K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearchModal();
      }
    });
  },

  openSearchModal() {
    this.openModal('global-search-modal');
    setTimeout(() => {
      document.getElementById('global-search-input')?.focus();
    }, 100);
  },

  performSearch(query) {
    const resultsContainer = document.getElementById('global-search-results');
    if (!resultsContainer) return;

    const q = query.trim().toLowerCase();
    if (!q) {
      resultsContainer.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:2rem;">Type to search across transactions, accounts, and help topics...</div>`;
      return;
    }

    const transactions = DemoStorage.getTransactions().filter(t => 
      t.description.toLowerCase().includes(q) || 
      t.category.toLowerCase().includes(q) || 
      t.amount.toString().includes(q)
    );

    const accounts = DemoStorage.getAccounts().filter(a => 
      a.name.toLowerCase().includes(q) || 
      a.accountNumber.toLowerCase().includes(q)
    );

    const bills = DemoStorage.getBills().filter(b => 
      b.biller.toLowerCase().includes(q) || 
      b.category.toLowerCase().includes(q)
    );

    let html = '';

    if (accounts.length > 0) {
      html += `<h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.5rem;">Accounts</h4><div style="margin-bottom:1rem;">`;
      accounts.forEach(a => {
        html += `
          <div onclick="window.location.href='account-details.html?id=${a.id}'" style="padding:0.75rem; border-radius:var(--radius-md); background-color:var(--bg-secondary); margin-bottom:0.5rem; cursor:pointer; display:flex; justify-content:space-between;">
            <div><strong>${a.name}</strong> <small>(${a.accountNumber})</small></div>
            <div style="font-weight:700;">${this.formatCurrency(a.balance)}</div>
          </div>
        `;
      });
      html += `</div>`;
    }

    if (transactions.length > 0) {
      html += `<h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.5rem;">Transactions (${transactions.length})</h4><div>`;
      transactions.slice(0, 5).forEach(t => {
        html += `
          <div onclick="window.location.href='transactions.html'" style="padding:0.75rem; border-radius:var(--radius-md); background-color:var(--bg-secondary); margin-bottom:0.5rem; cursor:pointer; display:flex; justify-content:space-between;">
            <div>
              <strong>${t.description}</strong>
              <div style="font-size:0.75rem; color:var(--text-muted);">${t.date} • ${t.category}</div>
            </div>
            <div style="font-weight:700; color:${t.amount > 0 ? 'var(--success)' : 'var(--text-primary)'};">${this.formatCurrency(t.amount)}</div>
          </div>
        `;
      });
      html += `</div>`;
    }

    if (bills.length > 0) {
      html += `<h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.5rem; margin-top:1rem;">Bills</h4><div>`;
      bills.forEach(b => {
        html += `
          <div onclick="window.location.href='bills.html'" style="padding:0.75rem; border-radius:var(--radius-md); background-color:var(--bg-secondary); margin-bottom:0.5rem; cursor:pointer; display:flex; justify-content:space-between;">
            <div><strong>${b.biller}</strong> <small>(Due ${b.dueDate})</small></div>
            <div style="font-weight:700;">${this.formatCurrency(b.amount)}</div>
          </div>
        `;
      });
      html += `</div>`;
    }

    if (!html) {
      html = `<div style="text-align:center; color:var(--text-muted); padding:2rem;">No matching banking results found for "${query}".</div>`;
    }

    resultsContainer.innerHTML = html;
  },

  bindEvents() {
    // Close sidebar on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeSidebar();
    });
  },

  // Sidebar open/close for mobile
  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar-nav');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!sidebar) return;
    const isOpen = sidebar.classList.contains('open');
    if (isOpen) {
      this.closeSidebar();
    } else {
      sidebar.classList.add('open');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeSidebar() {
    const sidebar = document.querySelector('.sidebar-nav');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Document Ready Initializer
document.addEventListener('DOMContentLoaded', () => UIModule.init());
