/**
 * helpers.js — DOM Helpers, Validators, Formatters
 */

/* ───────── DOM Helpers ───────── */

function $(selector, parent = document) {
  return parent.querySelector(selector);
}

function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, val]) => {
    if (key === 'className') el.className = val;
    else if (key === 'innerHTML') el.innerHTML = val;
    else if (key === 'textContent') el.textContent = val;
    else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
    else if (key === 'dataset') Object.entries(val).forEach(([dk, dv]) => el.dataset[dk] = dv);
    else el.setAttribute(key, val);
  });
  children.forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  });
  return el;
}

function clearElement(el) {
  if (el) el.innerHTML = '';
}

/* ───────── Validators ───────── */

function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
}

function validateEmail(value) {
  if (!value) return 'Email is required';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(value.trim())) return 'Please enter a valid email address';
  return null;
}

function validateAmount(value) {
  if (!value && value !== 0) return 'Amount is required';
  const num = parseFloat(value);
  if (isNaN(num)) return 'Amount must be a valid number';
  if (num < 0) return 'Amount cannot be negative';
  if (num > 10000000) return 'Amount exceeds maximum limit';
  return null;
}

function validateMinLength(value, min, fieldName) {
  if (!value || value.trim().length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return null;
}

function validateForm(fields) {
  const errors = {};
  let isValid = true;

  fields.forEach(({ value, name, validators }) => {
    for (const validator of validators) {
      const error = validator(value, name);
      if (error) {
        errors[name] = error;
        isValid = false;
        break;
      }
    }
  });

  return { isValid, errors };
}

/* ───────── Formatters ───────── */

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(num);
}

function generateId() {
  return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

function generateLogId() {
  return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

/* ───────── Status Helpers ───────── */

function getStatusClass(status) {
  const map = {
    'Completed': 'status-completed',
    'Pending': 'status-pending',
    'Failed': 'status-failed',
    'Processing': 'status-processing'
  };
  return map[status] || 'status-default';
}

function getSeverityClass(severity) {
  const map = {
    'Critical': 'severity-critical',
    'Error': 'severity-critical',
    'Warning': 'severity-warning',
    'Info': 'severity-info',
    'Success': 'severity-success'
  };
  return map[severity] || 'severity-info';
}

/* ───────── Error Display ───────── */

function showFieldError(inputEl, message) {
  clearFieldError(inputEl);
  inputEl.classList.add('input-error');
  const errorEl = createElement('div', { className: 'field-error', textContent: message });
  inputEl.parentElement.appendChild(errorEl);
}

function clearFieldError(inputEl) {
  inputEl.classList.remove('input-error');
  const existing = inputEl.parentElement.querySelector('.field-error');
  if (existing) existing.remove();
}

function clearAllFieldErrors(formEl) {
  $$(('.field-error'), formEl).forEach(el => el.remove());
  $$('.input-error', formEl).forEach(el => el.classList.remove('input-error'));
}

// Export
window.Helpers = {
  $, $$, createElement, clearElement,
  validateRequired, validateEmail, validateAmount, validateMinLength, validateForm,
  formatCurrency, formatDate, formatDateTime, formatNumber,
  generateId, generateLogId,
  getStatusClass, getSeverityClass,
  showFieldError, clearFieldError, clearAllFieldErrors
};
