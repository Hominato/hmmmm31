/**
 * Alta Federal Credit Union - Auth Module
 * Session Management & Protected Route Guard
 */

const AuthModule = {
  // Generate a unique session ID
  generateSessionId() {
    return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
  },

  // Retrieve current active session ID
  getSessionId() {
    return sessionStorage.getItem('alta_demo_session_id') || localStorage.getItem('alta_demo_session_id') || null;
  },

  // Check authentication guard & session ID for protected pages
  checkAuthentication() {
    const isAuth = localStorage.getItem('alta_demo_auth') === 'true' || sessionStorage.getItem('alta_demo_auth') === 'true';
    const sessionId = this.getSessionId();

    if (!isAuth || !sessionId) {
      this.clearSession();
      window.location.href = 'login.html';
    }
  },

  // Check if user is already logged in on login/register pages
  redirectIfAuthenticated() {
    // Disabled direct automatic redirection to dashboard.html to prevent skipping login screen
  },

  // Perform login
  login(email, password, remember = true) {
    const user = DemoStorage.getUser();
    
    // Accept user email or username
    if ((email.toLowerCase() === 'meechiedemetrius333@gmail.com' || email.toLowerCase() === 'lisaclark44502@gmail.com' || email.toLowerCase() === 'demo@example.com' || email.toLowerCase() === user.email.toLowerCase() || email === user.username) && (password === 'Godisgood2014' || password === 'Redpuddin')) {
      const sessionId = this.generateSessionId();

      sessionStorage.setItem('alta_demo_auth', 'true');
      sessionStorage.setItem('alta_demo_session_id', sessionId);

      if (remember) {
        localStorage.setItem('alta_demo_auth', 'true');
        localStorage.setItem('alta_demo_session_id', sessionId);
        localStorage.setItem('alta_demo_remembered_email', email);
      } else {
        localStorage.removeItem('alta_demo_auth');
        localStorage.removeItem('alta_demo_session_id');
      }

      return { success: true, sessionId: sessionId };
    } else {
      return { success: false, message: 'Invalid credentials. Please check your email and password.' };
    }
  },

  // Clear authentication and session data completely
  clearSession() {
    localStorage.removeItem('alta_demo_auth');
    localStorage.removeItem('alta_demo_session_id');
    sessionStorage.removeItem('alta_demo_auth');
    sessionStorage.removeItem('alta_demo_session_id');
  },

  // Log out user with modal confirmation trigger
  logout() {
    if (typeof UIModule !== 'undefined' && UIModule.confirmDialog) {
      UIModule.confirmDialog(
        'Confirm Logout',
        'Are you sure you want to end your current banking session?',
        () => {
          this.clearSession();
          window.location.href = 'login.html';
        }
      );
    } else {
      this.clearSession();
      window.location.href = 'login.html';
    }
  }
};
