/**
 * Testes de performance para o projeto AlSports
 */

import { debounce, throttle, memoize, MemoryCache } from '@/lib/performance'

describe('Performance Functions', () => {
  describe('debounce', () => {
    it('should delay function execution', (done) => {
      let callCount = 0
      const debouncedFn = debounce(() => {
        callCount++
      }, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(callCount).toBe(0)

      setTimeout(() => {
        expect(callCount).toBe(1)
        done()
      }, 150)
    })
  })

  describe('throttle', () => {
    it('should limit function execution rate', (done) => {
      let callCount = 0
      const throttledFn = throttle(() => {
        callCount++
      }, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(callCount).toBe(1)

      setTimeout(() => {
        expect(callCount).toBe(1)
        done()
      }, 50)
    })
  })

  describe('memoize', () => {
    it('should cache function results', () => {
      let callCount = 0
      const expensiveFn = (n: number) => {
        callCount++
        return n * 2
      }

      const memoizedFn = memoize(expensiveFn)

      // First call
      const result1 = memoizedFn(5)
      expect(result1).toBe(10)
      expect(callCount).toBe(1)

      // Second call with same input
      const result2 = memoizedFn(5)
      expect(result2).toBe(10)
      expect(callCount).toBe(1) // Should not call the function again

      // Different input
      const result3 = memoizedFn(3)
      expect(result3).toBe(6)
      expect(callCount).toBe(2)
    })
  })

  describe('MemoryCache', () => {
    let cache: MemoryCache

    beforeEach(() => {
      cache = new MemoryCache(10, 1000) // 10 items max, 1 second TTL
    })

    it('should store and retrieve values', () => {
      cache.set('key1', 'value1')
      expect(cache.get('key1')).toBe('value1')
    })

    it('should return null for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeNull()
    })

    it('should respect TTL', (done) => {
      cache.set('key1', 'value1', 50) // 50ms TTL
      
      setTimeout(() => {
        expect(cache.get('key1')).toBeNull()
        done()
      }, 100)
    })

    it('should respect max size', () => {
      // Fill cache beyond max size
      for (let i = 0; i < 15; i++) {
        cache.set(`key${i}`, `value${i}`)
      }

      expect(cache.size()).toBe(10)
      expect(cache.get('key0')).toBeNull() // Should be evicted
      expect(cache.get('key14')).toBe('value14') // Should still be there
    })

    it('should clear cache', () => {
      cache.set('key1', 'value1')
      cache.clear()
      expect(cache.get('key1')).toBeNull()
      expect(cache.size()).toBe(0)
    })
  })
})
