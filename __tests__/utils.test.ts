import { cn } from '../lib/utils'

describe('Utils Functions', () => {
  describe('cn function (className merger)', () => {
    test('merges multiple class names', () => {
      const result = cn('bg-red-500', 'text-white', 'p-4')
      expect(result).toBe('bg-red-500 text-white p-4')
    })

    test('handles conditional classes', () => {
      const isActive = true
      const isDisabled = false
      
      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      )
      
      expect(result).toBe('base-class active-class')
    })

    test('merges conflicting tailwind classes correctly', () => {
      const result = cn('bg-red-500', 'bg-blue-500')
      expect(result).toBe('bg-blue-500')
    })

    test('handles arrays of classes', () => {
      const result = cn(['flex', 'items-center'], 'justify-center')
      expect(result).toBe('flex items-center justify-center')
    })

    test('handles objects with conditional classes', () => {
      const result = cn({
        'text-red-500': true,
        'text-blue-500': false,
        'font-bold': true
      })
      
      expect(result).toBe('text-red-500 font-bold')
    })

    test('filters out falsy values', () => {
      const result = cn('base-class', null, undefined, false, '', 'valid-class')
      expect(result).toBe('base-class valid-class')
    })

    test('handles empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })

    test('handles complex tailwind merge scenarios', () => {
      const result = cn(
        'px-2 py-1 bg-red-500 hover:bg-red-600',
        'px-4 bg-blue-500 hover:bg-blue-600'
      )
      
      // Should merge padding and background colors, keeping the latest ones
      expect(result).toBe('py-1 px-4 bg-blue-500 hover:bg-blue-600')
    })
  })
})
