export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) {
    return { valid: false, error: 'Email is required' }
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' }
  }
  return { valid: true, error: null }
}

export function validatePassword(password) {
  if (!password) {
    return { valid: false, error: 'Password is required' }
  }
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' }
  }
  return { valid: true, error: null }
}

export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' }
  }
  return { valid: true, error: null }
}

export function validateRequired(value, fieldName) {
  if (!value || !value.trim()) {
    return { valid: false, error: `${fieldName} is required` }
  }
  return { valid: true, error: null }
}

export function validateUrl(url) {
  if (!url) {
    return { valid: true, error: null }
  }
  try {
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'Website must start with http:// or https://' }
    }
    return { valid: true, error: null }
  } catch {
    return { valid: false, error: 'Please enter a valid URL' }
  }
}

export function validateClientName(name) {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Client name is required' }
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Client name must be at least 2 characters' }
  }
  if (name.trim().length > 100) {
    return { valid: false, error: 'Client name must be less than 100 characters' }
  }
  return { valid: true, error: null }
}

export function validateAgencyName(name) {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Agency name is required' }
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Agency name must be at least 2 characters' }
  }
  return { valid: true, error: null }
}
