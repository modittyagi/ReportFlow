export function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.createElement('div')
  announcer.setAttribute('aria-live', priority)
  announcer.setAttribute('aria-atomic', 'true')
  announcer.setAttribute('class', 'sr-only')
  announcer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0'
  document.body.appendChild(announcer)
  
  setTimeout(() => {
    announcer.textContent = message
  }, 100)
  
  setTimeout(() => {
    document.body.removeChild(announcer)
  }, 1000)
}

export function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
    
    if (e.key === 'Escape') {
      element.dispatchEvent(new CustomEvent('escape-pressed'))
    }
  }
  
  element.addEventListener('keydown', handleKeyDown)
  
  return () => {
    element.removeEventListener('keydown', handleKeyDown)
  }
}

export function handleKeyboardNavigation(event, items, currentIndex, onSelect) {
  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      event.preventDefault()
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
      onSelect(nextIndex)
      break
    case 'ArrowUp':
    case 'ArrowLeft':
      event.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
      onSelect(prevIndex)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      onSelect(currentIndex)
      break
    case 'Home':
      event.preventDefault()
      onSelect(0)
      break
    case 'End':
      event.preventDefault()
      onSelect(items.length - 1)
      break
  }
}

export function generateId(prefix = 'rf') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}
