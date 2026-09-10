// Deliberately loose: just enough to catch a typo or an empty box, without
// rejecting the many addresses a stricter pattern gets wrong.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const looksLikeEmail = (value) => EMAIL.test(String(value ?? '').trim())
