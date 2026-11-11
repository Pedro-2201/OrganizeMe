// Cliente HTTP centralizado para chamadas à API do OrganizeMe.
// Usa cookies HttpOnly (credentials: 'include') e trata 401/403 em um único ponto.

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export class ApiError extends Error {
  constructor(message, status, { isAuthError = false } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.isAuthError = isAuthError
  }
}

export async function apiFetch(url, options = {}) {
  const {
    headers = {},
    skipAuthRedirect = false,
    defaultErrorMessage = 'Erro na comunicação com o servidor.',
    ...fetchOptions
  } = options

  const isFormData = typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData
  const requestHeaders = {
    ...(fetchOptions.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  }

  const response = await fetch(url, {
    ...fetchOptions,
    credentials: 'include',
    headers: requestHeaders,
  })

  if ((response.status === 401 || response.status === 403) && !skipAuthRedirect) {
    if (unauthorizedHandler) {
      unauthorizedHandler()
    }
    throw new ApiError('Sessão expirada. Faça login novamente.', response.status, {
      isAuthError: true,
    })
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new ApiError(data.message || defaultErrorMessage, response.status)
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return null
}
