/**
 * Performance Optimization Module
 * Phase 4: Application Performance & Optimization
 *
 * Provides utilities for memoization, performance tracking,
 * and optimization of expensive calculations
 */

import { CalculationResult, EstateData, HeirsData, MadhhabType } from '../inheritance/types';

export interface PerformanceMetrics {
  calculationTime: number;
  cacheHits: number;
  cacheMisses: number;
  memoryUsage?: number;
  timestamp: Date;
}

/**
 * Calculation Cache Manager
 * Stores and retrieves cached calculation results
 */
export class CalculationCache {
  private static cache: Map<string, CalculationResult> = new Map();
  private static metrics: PerformanceMetrics[] = [];
  private static maxCacheSize = 100;

  /**
   * Generate cache key from calculation parameters
   */
  private static generateKey(
    madhab: MadhhabType,
    estate: EstateData,
    heirs: HeirsData
  ): string {
    const estateString = Object.entries(estate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');

    const heirsString = Object.entries(heirs)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');

    return `${madhab}:${estateString}:${heirsString}`;
  }

  /**
   * Get cached calculation result
   */
  static getCalculation(
    madhab: MadhhabType,
    estate: EstateData,
    heirs: HeirsData
  ): CalculationResult | null {
    const key = this.generateKey(madhab, estate, heirs);
    return this.cache.get(key) || null;
  }

  /**
   * Store calculation result in cache
   */
  static cacheCalculation(
    madhab: MadhhabType,
    estate: EstateData,
    heirs: HeirsData,
    result: CalculationResult,
    calculationTime: number
  ): void {
    const key = this.generateKey(madhab, estate, heirs);

    // Enforce cache size limit
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry (first one)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, result);
    this.recordMetric(calculationTime, true);
  }

  /**
   * Track cache hit
   */
  static recordHit(calculationTime: number): void {
    this.recordMetric(calculationTime, true);
  }

  /**
   * Track cache miss
   */
  static recordMiss(calculationTime: number): void {
    this.recordMetric(calculationTime, false);
  }

  /**
   * Record performance metric
   */
  private static recordMetric(calculationTime: number, isHit: boolean): void {
    const lastMetric = this.metrics[this.metrics.length - 1];
    const newMetric: PerformanceMetrics = {
      calculationTime,
      cacheHits: (lastMetric?.cacheHits || 0) + (isHit ? 1 : 0),
      cacheMisses: (lastMetric?.cacheMisses || 0) + (isHit ? 0 : 1),
      timestamp: new Date(),
    };

    this.metrics.push(newMetric);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  /**
   * Get performance statistics
   */
  static getStats(): {
    totalCalculations: number;
    hitRate: number;
    avgCalculationTime: number;
    cacheSize: number;
  } {
    if (this.metrics.length === 0) {
      return {
        totalCalculations: 0,
        hitRate: 0,
        avgCalculationTime: 0,
        cacheSize: 0,
      };
    }

    const lastMetric = this.metrics[this.metrics.length - 1];
    const totalCalcs = lastMetric.cacheHits + lastMetric.cacheMisses;
    const avgTime =
      this.metrics.reduce((sum, m) => sum + m.calculationTime, 0) / this.metrics.length;

    return {
      totalCalculations: totalCalcs,
      hitRate: totalCalcs > 0 ? (lastMetric.cacheHits / totalCalcs) * 100 : 0,
      avgCalculationTime: avgTime,
      cacheSize: this.cache.size,
    };
  }

  /**
   * Clear cache
   */
  static clear(): void {
    this.cache.clear();
    this.metrics = [];
  }

  /**
   * Export metrics as JSON
   */
  static exportMetrics(): string {
    return JSON.stringify(
      {
        stats: this.getStats(),
        metrics: this.metrics,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    );
  }
}

/**
 * Performance Monitor
 * Tracks and logs performance metrics
 */
export class PerformanceMonitor {
  private static enabled = true;

  static enable(): void {
    this.enabled = true;
  }

  static disable(): void {
    this.enabled = false;
  }

  /**
   * Measure function execution time
   */
  static async measure<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    if (!this.enabled) {
      return { result: await fn(), duration: 0 };
    }

    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;

      if (duration > 100) {
        // Log slow operations
        console.warn(`[Performance] ${name} took ${duration.toFixed(2)}ms`);
      }

      return { result, duration };
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[Performance Error] ${name} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  /**
   * Measure synchronous function execution time
   */
  static measureSync<T>(name: string, fn: () => T): { result: T; duration: number } {
    if (!this.enabled) {
      return { result: fn(), duration: 0 };
    }

    const startTime = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - startTime;

      if (duration > 50) {
        // Log slow operations (lower threshold for sync)
        console.warn(`[Performance] ${name} took ${duration.toFixed(2)}ms`);
      }

      return { result, duration };
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[Performance Error] ${name} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }
}

/**
 * Debounce function for optimizing frequent calculations
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delayMs);
  };
}

/**
 * Throttle function for rate-limiting operations
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let lastRun = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastRun >= limitMs) {
      fn(...args);
      lastRun = now;
    }
  };
}

/**
 * Memoization decorator for expensive calculations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    // Keep cache size reasonable (max 1000 entries)
    if (cache.size > 1000) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  }) as T;
}

export default {
  CalculationCache,
  PerformanceMonitor,
  debounce,
  throttle,
  memoize,
};
