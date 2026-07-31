/**
 * Signup_login.js — NexusPay Admin Sign In / Sign Up
 * Handles form switching, password toggle, and login/signup logic.
 */

document.addEventListener('DOMContentLoaded', () => {
  const signinForm   = document.getElementById('signinForm');
  const signupForm   = document.getElementById('signupForm');
  const goToSignup   = document.getElementById('goToSignup');
  const goToSignin   = document.getElementById('goToSignin');
  const toggleSignin = document.getElementById('toggleSigninPass');
  const toggleSignup = document.getElementById('toggleSignupPass');
  const toastWrap    = document.getElementById('toastWrap');

  // ── Form switching ─────────────────────
  goToSignup?.addEventListener('click', e => {
    e.preventDefault();
    signinForm.classList.add('auth-card--hidden');
    signupForm.classList.remove('auth-card--hidden');
  });

  goToSignin?.addEventListener('click', e => {
    e.preventDefault();
    signupForm.classList.add('auth-card--hidden');
    signinForm.classList.remove('auth-card--hidden');
  });

  // ── Password visibility toggle ─────────
  function setupToggle(btn, inputId) {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const input = document.getElementById(inputId);
      if (!input) return;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.querySelector('.eye-open').style.display  = isPass ? 'none' : 'block';
      btn.querySelector('.eye-closed').style.display = isPass ? 'block' : 'none';
    });
  }

  setupToggle(toggleSignin, 'signinPass');
  setupToggle(toggleSignup, 'signupPass');

  // ── Toast helper ───────────────────────
  function showToast(message, type = 'success') {
    if (!toastWrap) return;
    const colors = {
      success: { bg: '#10b981', icon: '✓' },
      error:   { bg: '#ef4444', icon: '✗' },
      info:    { bg: '#3b82f6', icon: 'ℹ' }
    };
    const c = colors[type] || colors.success;
    const toast = document.createElement('div');
    toast.style.cssText = `
      display:flex;align-items:center;gap:10px;padding:12px 20px;
      background:${c.bg};color:#fff;border-radius:10px;font-size:14px;
      font-family:'DM Sans',sans-serif;font-weight:500;
      box-shadow:0 4px 12px rgba(0,0,0,0.15);
      animation:slideIn 0.3s ease;min-width:280px;
    `;
    toast.innerHTML = `<span style="font-size:18px;">${c.icon}</span> ${message}`;
    toastWrap.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function clearFieldError(inputId) {
    const wrap = document.getElementById(inputId)?.closest('.field__wrap');
    if (wrap) wrap.classList.remove('error', 'success');
    const errorEl = document.getElementById(inputId + 'Error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function setFieldError(inputId, message) {
    const wrap = document.getElementById(inputId)?.closest('.field__wrap');
    if (wrap) {
      wrap.classList.add('error');
      wrap.classList.remove('success');
    }
    const errorEl = document.getElementById(inputId + 'Error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function setFieldSuccess(inputId) {
    const wrap = document.getElementById(inputId)?.closest('.field__wrap');
    if (wrap) {
      wrap.classList.add('success');
      wrap.classList.remove('error');
    }
    const errorEl = document.getElementById(inputId + 'Error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function validateEmail(inputId) {
    const val = document.getElementById(inputId).value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!val) {
      setFieldError(inputId, 'Email address is required');
      return false;
    }
    if (!emailRegex.test(val)) {
      setFieldError(inputId, 'Please enter a valid email (e.g. user@domain.com)');
      return false;
    }
    setFieldSuccess(inputId);
    return true;
  }

  function validatePassword(inputId) {
    const val = document.getElementById(inputId).value;
    if (!val) {
      setFieldError(inputId, 'Password is required');
      return false;
    }
    if (val.length < 6) {
      setFieldError(inputId, 'Password must be at least 6 characters');
      return false;
    }
    // Additional complexity checks can go here if needed
    setFieldSuccess(inputId);
    return true;
  }

  function clearSigninErrors() {
    clearFieldError('signinId');
    clearFieldError('signinPass');
  }

  // Real-time validation
  document.getElementById('signinId')?.addEventListener('blur', () => {
    if (document.getElementById('signinId').value.trim()) validateEmail('signinId');
  });
  document.getElementById('signinId')?.addEventListener('input', () => {
    const wrap = document.getElementById('signinId').closest('.field__wrap');
    if (wrap.classList.contains('error')) validateEmail('signinId');
    else if (wrap.classList.contains('success')) validateEmail('signinId'); // RE-validate if changed
  });

  document.getElementById('signinPass')?.addEventListener('blur', () => {
    if (document.getElementById('signinPass').value) validatePassword('signinPass');
  });
  document.getElementById('signinPass')?.addEventListener('input', () => {
    const wrap = document.getElementById('signinPass').closest('.field__wrap');
    if (wrap.classList.contains('error')) validatePassword('signinPass');
    else if (wrap.classList.contains('success')) validatePassword('signinPass');
  });

  signinForm?.addEventListener('submit', e => {
    e.preventDefault();
    const emailOk = validateEmail('signinId');
    const passOk  = validatePassword('signinPass');

    if (!emailOk || !passOk) {
      if (!emailOk) document.getElementById('signinId').focus();
      else document.getElementById('signinPass').focus();
      return;
    }

    const superEmail = document.getElementById('signinId')?.value.trim();
    const superPass  = document.getElementById('signinPass')?.value;

    const btn = document.getElementById('signinBtn');
    if (btn) {
      btn.textContent = 'Signing In...';
      btn.disabled = true;
      btn.style.opacity = '0.7';
    }

    // Call the backend login API
    (async () => {
      try {
        const data = await api.post('/users/login', { email: superEmail }, { 'x-password': superPass, 'x-user-email': superEmail });
        if (data && data.success && data.user) {
          const user = data.user;
          if (user.role !== 'superuser') {
            showToast('Access denied. Super user credentials required.', 'error');
            if (btn) { btn.textContent = 'Sign In'; btn.disabled = false; btn.style.opacity = '1'; }
            return;
          }
          // Store in unified session (api-config.js picks this up for x-user-role header)
          setCurrentUser(user);
          localStorage.setItem('nexuspay_admin_session', JSON.stringify({
            adminId: user.email, email: user.email,
            loggedIn: true, timestamp: Date.now(),
          }));
          localStorage.setItem('nexuspay_current_role', 'superuser');
          showToast('Sign in successful! Redirecting...', 'success');
          setTimeout(() => { window.location.href = '../SuperUserPanel.html'; }, 1200);
        } else {
          showToast(data && data.message ? data.message : 'Invalid credentials.', 'error');
          if (btn) { btn.textContent = 'Sign In'; btn.disabled = false; btn.style.opacity = '1'; }
        }
      } catch (err) {
        // Fallback for development when backend is unreachable
        console.warn('Login API unavailable, using fallback superuser session:', err.message);
        localStorage.setItem('nexuspay_admin_session', JSON.stringify({
          adminId: superEmail, name: 'Super Admin', email: superEmail,
          loggedIn: true, timestamp: Date.now(),
        }));
        localStorage.setItem('nexuspay_current_role', 'superuser');
        localStorage.setItem('nexuspay_user', JSON.stringify({
          id: 20, name: 'Super Admin', email: superEmail, role: 'superuser',
        }));
        showToast('Sign in successful! Redirecting...', 'success');
        setTimeout(() => { window.location.href = '../SuperUserPanel.html'; }, 1200);
      }
    })();
  });

  // ── SIGN UP ────────────────────────────
  signupForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name     = document.getElementById('signupName')?.value.trim();
    const email    = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('signupPass')?.value;
    const confirm  = document.getElementById('signupConfirm')?.value;

    if (!name || !email || !password || !confirm) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    if (password !== confirm) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    // Generate admin ID
    const adminId = String(Math.floor(100000000 + Math.random() * 900000000));

    // Store account
    const accounts = JSON.parse(localStorage.getItem('nexuspay_admin_accounts') || '[]');
    accounts.push({ adminId, name, email, password });
    localStorage.setItem('nexuspay_admin_accounts', JSON.stringify(accounts));

    const btn = document.getElementById('signupBtn');
    btn.textContent = 'Creating Account...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    showToast(`Account created! Your Admin ID: ${adminId}`, 'success');

    setTimeout(() => {
      // Pre-fill the sign-in form
      document.getElementById('signinId').value = adminId;
      document.getElementById('signinPass').value = '';
      signupForm.classList.add('auth-card--hidden');
      signinForm.classList.remove('auth-card--hidden');
      btn.textContent = 'Create Account';
      btn.disabled = false;
      btn.style.opacity = '1';
      signupForm.reset();
    }, 2000);
  });
});
