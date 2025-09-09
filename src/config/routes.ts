export const ROUTES_CONFIG = {
  auth: {
    root: '/',
    login: '/login',
    register: '/register',
    logout: '/logout',
    refresh: '/refresh'
  },
  user: {
    root: '/',
    by_id: ':id'
  },
  records: {
    test_results: {
      root: '/',
      by_id: ':id'
    },
    repairs: {
      root: '/',
      by_id: ':id'
    }
  },
  options: {
    root: '/'
  }
} as const
