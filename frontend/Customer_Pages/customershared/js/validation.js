/**
 * validation.js — Form Validation Engine
 * Returns structured error objects and injects styled error messages into the DOM.
 */

/* ====== VALIDATORS ====== */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_FREQUENCIES = ['One-Time', 'Monthly', 'Yearly', 'Custom'];

export function validateLoginForm(data) {
    const errors = {};

    if (!data.email || !data.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!data.password || !data.password.trim()) {
        errors.password = 'Password is required.';
    } else if (data.password.trim().length < 6) {
        errors.password = 'Password must be at least 6 characters.';
    }

    return { valid: Object.keys(errors).length === 0, errors };
}

export function validateScheduleForm(data) {
    const errors = {};

    // Title
    if (!data.title || !data.title.trim()) {
        errors.title = 'Schedule title is required.';
    } else if (data.title.trim().length < 2) {
        errors.title = 'Title must be at least 2 characters.';
    } else if (data.title.trim().length > 50) {
        errors.title = 'Title cannot exceed 50 characters.';
    }

    // Contact
    if (!data.contact || !data.contact.trim()) {
        errors.contact = 'Contact email is required.';
    } else if (!/^[^\s@]+@[^\s@]+$/.test(data.contact.trim())) {
        errors.contact = 'Please enter a valid email or NexusPay ID.';
    }

    // Amount
    if (!data.amount && data.amount !== 0) {
        errors.amount = 'Amount is required.';
    } else {
        const numAmt = Number(data.amount);
        if (isNaN(numAmt) || numAmt <= 0) {
            errors.amount = 'Amount must be a positive number.';
        } else if (numAmt > 10000000) {
            errors.amount = 'Amount cannot exceed ₹1,00,00,000.';
        }
    }

    // Frequency
    if (!data.frequency || !data.frequency.trim()) {
        errors.frequency = 'Frequency is required.';
    } else if (!VALID_FREQUENCIES.includes(data.frequency.trim())) {
        errors.frequency = 'Please select a valid frequency.';
    }

    // Next Payment Date
    if (!data.nextPayment || !data.nextPayment.trim()) {
        errors.nextPayment = 'Start date is required.';
    } else {
        const selectedDate = new Date(data.nextPayment.trim());
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (isNaN(selectedDate.getTime())) {
            errors.nextPayment = 'Please enter a valid date.';
        } else if (selectedDate < today) {
            errors.nextPayment = 'Date must be today or in the future.';
        }
    }

    return { valid: Object.keys(errors).length === 0, errors };
}

/* ====== DOM HELPERS ====== */

/**
 * Show an error message below an input element.
 */
export function showFieldError(inputEl, message) {
    clearSingleFieldError(inputEl);
    inputEl.classList.add('input-error');
    const errorSpan = document.createElement('span');
    errorSpan.className = 'field-error';
    errorSpan.textContent = message;
    inputEl.parentNode.insertBefore(errorSpan, inputEl.nextSibling);
}

/**
 * Clear the error message for a single input.
 */
export function clearSingleFieldError(inputEl) {
    inputEl.classList.remove('input-error');
    const next = inputEl.nextElementSibling;
    if (next && next.classList.contains('field-error')) {
        next.remove();
    }
}

/**
 * Clear all error messages inside a form.
 */
export function clearFieldErrors(formEl) {
    formEl.querySelectorAll('.field-error').forEach(el => el.remove());
    formEl.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}
