/**
 * @file audit-trail.test.ts
 * @description Audit Trail Manager Tests
 * Phase 5.1: Advanced Features - Audit Trail UI
 */

import { describe, it, expect } from 'vitest';
import { AuditTrailManager } from '../lib/inheritance/audit-trail-manager';
import { AuditLogEntry } from '../lib/inheritance/audit-log';
import { CalculationResult } from '../lib/inheritance/types';

describe('AuditTrailManager', () => {
  // Create mock audit entries
  const createMockEntry = (
    madhab: string,
    total: number,
    confidence: number,
    daysAgo: number = 0
  ): AuditLogEntry => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    return {
      id: `entry-${Math.random()}`,
      timestamp: date.toISOString(),
      operation: 'calculate',
      madhab: madhab as any,
      heirs: { son: 1, daughter: 1 },
      estate: { total },
      result: {
        success: true,
        madhab: madhab as any,
        madhhabName: madhab,
        shares: [
          { name: 'Son', amount: total * 0.6 },
          { name: 'Daughter', amount: total * 0.4 },
        ],
        confidence,
        steps: [],
        calculationTime: 100,
      } as CalculationResult,
      metadata: {
        success: true,
        notes: `Test calculation for ${madhab}`,
      },
    };
  };

  describe('filterEntries', () => {
    it('should filter by madhab', () => {
      const entries = [
        createMockEntry('hanafi', 1000, 95),
        createMockEntry('shafii', 2000, 90),
        createMockEntry('hanafi', 1500, 92),
      ];

      const result = AuditTrailManager.filterEntries(entries, { madhab: 'hanafi' });

      expect(result.total).toBe(3);
      expect(result.filtered).toBe(2);
      expect(result.entries).toHaveLength(2);
      expect(result.entries.every((e) => e.madhab === 'hanafi')).toBe(true);
    });

    it('should filter by date range', () => {
      const today = new Date();
      const past7Days = new Date(today);
      past7Days.setDate(past7Days.getDate() - 7);

      const entries = [
        createMockEntry('hanafi', 1000, 95, 0), // today
        createMockEntry('hanafi', 1000, 95, 5), // 5 days ago
        createMockEntry('hanafi', 1000, 95, 10), // 10 days ago
      ];

      const result = AuditTrailManager.filterEntries(entries, {
        dateFrom: past7Days,
        dateTo: today,
      });

      expect(result.filtered).toBe(2);
    });

    it('should filter by estate amount range', () => {
      const entries = [
        createMockEntry('hanafi', 500, 95),
        createMockEntry('shafii', 1500, 90),
        createMockEntry('maliki', 2500, 92),
      ];

      const result = AuditTrailManager.filterEntries(entries, {
        minEstate: 1000,
        maxEstate: 2000,
      });

      expect(result.filtered).toBe(1);
      expect(result.entries[0].estate?.total).toBe(1500);
    });

    it('should search by term', () => {
      const entries = [
        createMockEntry('hanafi', 1000, 95),
        createMockEntry('shafii', 2000, 90),
      ];

      const result = AuditTrailManager.filterEntries(entries, {
        searchTerm: 'shafii',
      });

      expect(result.filtered).toBe(1);
      expect(result.entries[0].madhab).toBe('shafii');
    });
  });

  describe('sortEntries', () => {
    it('should sort by timestamp ascending', () => {
      const entries = [
        createMockEntry('hanafi', 1000, 95, 0),
        createMockEntry('hanafi', 1000, 95, 2),
        createMockEntry('hanafi', 1000, 95, 1),
      ];

      const sorted = AuditTrailManager.sortEntries(entries, {
        field: 'timestamp',
        order: 'asc',
      });

      expect(
        new Date(sorted[0].timestamp).getTime() <=
        new Date(sorted[1].timestamp).getTime()
      ).toBe(true);
    });

    it('should sort by confidence descending', () => {
      const entries = [
        createMockEntry('hanafi', 1000, 95),
        createMockEntry('shafii', 1000, 85),
        createMockEntry('maliki', 1000, 90),
      ];

      const sorted = AuditTrailManager.sortEntries(entries, {
        field: 'confidence',
        order: 'desc',
      });

      expect(sorted[0].result?.confidence).toBe(95);
      expect(sorted[1].result?.confidence).toBe(90);
      expect(sorted[2].result?.confidence).toBe(85);
    });

    it('should sort by madhab', () => {
      const entries = [
        createMockEntry('shafii', 1000, 95),
        createMockEntry('hanafi', 1000, 85),
        createMockEntry('maliki', 1000, 90),
      ];

      const sorted = AuditTrailManager.sortEntries(entries, {
        field: 'madhab',
        order: 'asc',
      });

      expect(sorted[0].madhab).toBe('hanafi');
      expect(sorted[1].madhab).toBe('maliki');
      expect(sorted[2].madhab).toBe('shafii');
    });

    it('should sort by estate total', () => {
      const entries = [
        createMockEntry('hanafi', 3000, 95),
        createMockEntry('shafii', 1000, 85),
        createMockEntry('maliki', 2000, 90),
      ];

      const sorted = AuditTrailManager.sortEntries(entries, {
        field: 'total',
        order: 'asc',
      });

      expect(sorted[0].estate?.total).toBe(1000);
      expect(sorted[1].estate?.total).toBe(2000);
      expect(sorted[2].estate?.total).toBe(3000);
    });
  });

  describe('getUniqueMadhabs', () => {
    it('should extract unique madhabs', () => {
      const entries = [
        createMockEntry('hanafi', 1000, 95),
        createMockEntry('shafii', 1000, 90),
        createMockEntry('hanafi', 1500, 92),
        createMockEntry('maliki', 2000, 88),
        createMockEntry('shafii', 1200, 91),
      ];

      const madhabs = AuditTrailManager.getUniqueMadhabs(entries);

      expect(madhabs).toContain('hanafi');
      expect(madhabs).toContain('shafii');
      expect(madhabs).toContain('maliki');
      expect(madhabs).toHaveLength(3);
    });

    it('should return empty array for empty entries', () => {
      const madhabs = AuditTrailManager.getUniqueMadhabs([]);
      expect(madhabs).toHaveLength(0);
    });
  });

  describe('getStatistics', () => {
    it('should calculate statistics correctly', () => {
      const entries = [
        createMockEntry('hanafi', 1000, 95),
        createMockEntry('shafii', 2000, 90),
        createMockEntry('hanafi', 1500, 85),
      ];

      const stats = AuditTrailManager.getStatistics(entries);

      expect(stats.totalCalculations).toBe(3);
      expect(stats.averageEstate).toBe((1000 + 2000 + 1500) / 3);
      expect(stats.averageConfidence).toBe((95 + 90 + 85) / 3);
      expect(stats.madhabs).toEqual({
        hanafi: 2,
        shafii: 1,
      });
      expect(stats.dateRange).toBeTruthy();
    });

    it('should handle empty entries', () => {
      const stats = AuditTrailManager.getStatistics([]);

      expect(stats.totalCalculations).toBe(0);
      expect(stats.averageEstate).toBe(0);
      expect(stats.averageConfidence).toBe(0);
      expect(stats.dateRange).toBeNull();
    });
  });

  describe('formatEntryForDisplay', () => {
    it('should format entry correctly', () => {
      const entry = createMockEntry('hanafi', 5000, 95);

      const formatted = AuditTrailManager.formatEntryForDisplay(entry);

      expect(formatted.madhab).toBe('hanafi');
      expect(formatted.estate).toContain('5000');
      expect(formatted.confidence).toContain('95');
      expect(formatted.heirsCount).toBe(2); // son + daughter
      expect(formatted.date).toBeTruthy();
      expect(formatted.time).toBeTruthy();
    });

    it('should format with Arabic locale', () => {
      const entry = createMockEntry('shafii', 1000, 90);

      const formatted = AuditTrailManager.formatEntryForDisplay(entry);

      // Should include Arabic numerals and format
      expect(formatted.date).toBeTruthy();
      expect(formatted.time).toBeTruthy();
    });
  });

  describe('exportAsJSON', () => {
    it('should export entries as valid JSON', () => {
      const entries = [
        createMockEntry('hanafi', 1000, 95),
        createMockEntry('shafii', 2000, 90),
      ];

      const json = AuditTrailManager.exportAsJSON(entries);
      const parsed = JSON.parse(json);

      expect(parsed.totalEntries).toBe(2);
      expect(parsed.entries).toHaveLength(2);
      expect(parsed.exportDate).toBeTruthy();
    });

    it('should include export metadata', () => {
      const entries = [createMockEntry('hanafi', 1000, 95)];

      const json = AuditTrailManager.exportAsJSON(entries);
      const parsed = JSON.parse(json);

      expect(parsed.exportDate).toBeTruthy();
      expect(new Date(parsed.exportDate).getTime()).toBeCloseTo(
        Date.now(),
        -3
      ); // Within 1 second
    });
  });

  describe('Complex filtering scenarios', () => {
    it('should apply multiple filters simultaneously', () => {
      const entries = [
        createMockEntry('hanafi', 1000, 95, 0),
        createMockEntry('hanafi', 2000, 90, 2),
        createMockEntry('shafii', 1500, 92, 0),
        createMockEntry('maliki', 3000, 88, 5),
      ];

      const today = new Date();
      const past3Days = new Date(today);
      past3Days.setDate(past3Days.getDate() - 3);

      const result = AuditTrailManager.filterEntries(entries, {
        madhab: 'hanafi',
        dateFrom: past3Days,
        dateTo: today,
        minEstate: 500,
        maxEstate: 2500,
      });

      // Should match: hanafi, 1000, 0 days ago; hanafi, 2000, 2 days ago
      expect(result.filtered).toBe(2);
      expect(result.entries.every((e) => e.madhab === 'hanafi')).toBe(true);
    });
  });
});
