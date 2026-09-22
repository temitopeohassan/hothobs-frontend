const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api').replace(/\/$/, '')

/** An error the API returned, carrying per-field messages when it sent them. */
export class ApiError extends Error {
  constructor(message, { status, fields } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields ?? {}
  }
}

async function request(path, { method = 'GET', body, signal, headers } = {}) {
  let response
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      // Sends and stores the httpOnly session cookie.
      credentials: 'include',
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : null),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    throw new ApiError('We could not reach the kitchen. Check your connection and try again.', {
      status: 0,
    })
  }

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await response.json().catch(() => null) : null

  if (!response.ok) {
    throw new ApiError(payload?.error ?? 'Something went wrong. Please try again.', {
      status: response.status,
      fields: payload?.fields,
    })
  }
  return payload
}

export const api = {
  get: (path, options) => request(path, options),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
}
