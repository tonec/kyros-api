const API_ROOT = '/api'

export default path => `${API_ROOT.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
