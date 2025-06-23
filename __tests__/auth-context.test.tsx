import '@testing-library/jest-dom'

// Teste simples para verificar se a estrutura de autenticação está funcionando
describe('Auth Context Tests', () => {
  test('should have proper exports', () => {
    // Import test
    const authModule = require('../contexts/auth-context')
    expect(authModule.useAuth).toBeDefined()
    expect(authModule.AuthProvider).toBeDefined()
  })

  test('should define required interfaces', () => {
    // Test that the module structure is correct
    const authModule = require('../contexts/auth-context')
    expect(typeof authModule.useAuth).toBe('function')
    expect(typeof authModule.AuthProvider).toBe('function')
  })
})
