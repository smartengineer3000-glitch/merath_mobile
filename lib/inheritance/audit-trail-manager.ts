/**
 * Audit Trail Manager
 * Phase 5.1: Advanced Features - Audit Trail Data Management
 *
 * Provides utilities for filtering, sorting, and searching
 * calculation history
 */

import { AuditLogEntry } from './audit-log';

export interface FilteredAuditResult {
  entries: AuditLogEntry[];
  total: number;
  filtered: number;
}

export interface AuditTrailFilters {
  madhab?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
  minEstate?: number;
  maxEstate?: number;
}

export interface SortOption {
  field: 'timestamp' | 'madhab' | 'total' | 'confidence';
  order: 'asc' | 'desc';
}

/**
 * Audit Trail Manager - Handles filtering, sorting, and search
 */
export class AuditTrailManager {
  /**
   * Filter audit log entries by various criteria
   */
  static filterEntries(
    entries: AuditLogEntry[],
    filters: AuditTrailFilters
  ): FilteredAuditResult {
    let filtered = [...entries];

    // Filter by madhab
    if (filters.madhab) {
      filtered = filtered.filter(
        (entry) => entry.madhab?.toLowerCase() === filters.madhab?.toLowerCase()
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (entry) => new Date(entry.timestamp) >= filters.dateFrom!
      );
    }

    if (filters.dateTo) {
      const endOfDay = new Date(filters.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (entry) => new Date(entry.timestamp) <= endOfDay
      );
    }

    // Filter by estate amount range
    if (filters.minEstate !== undefined) {
      filtered = filtered.filter(
        (entry) => (entry.estate?.total || 0) >= filters.minEstate!
      );
    }

    if (filters.maxEstate !== undefined) {
      filtered = filtered.filter(
        (entry) => (entry.estate?.total || 0) <= filters.maxEstate!
      );
    }

    // Search term (searches in madhab and description)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((entry) => {
        const madhab = entry.madhab?.toLowerCase() || '';
        const notes = entry.metadata?.notes?.toLowerCase() || '';
        return madhab.includes(term) || notes.includes(term);
      });
    }

    return {
      entries: filtered,
      total: entries.length,
      filtered: filtered.length,
    };
  }

  /**
   * Sort audit log entries
   */
  static sortEntries(
    entries: AuditLogEntry[],
    sortOption: SortOption
  ): AuditLogEntry[] {
    const sorted = [...entries];

    sorted.sort((a, b) => {
      let compareValue = 0;

      switch (sortOption.field) {
        case 'timestamp':
          compareValue =
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime();
          break;

        case 'madhab':
          compareValue = (a.madhab || '').localeCompare(b.madhab || '', 'ar');
          break;

        case 'total':
          compareValue = (a.estate?.total || 0) - (b.estate?.total || 0);
          break;

        case 'confidence':
          compareValue = (a.result?.confidence || 0) - (b.result?.confidence || 0);
          break;

        default:
          compareValue = 0;
      }

      return sortOption.order === 'asc' ? compareValue : -compareValue;
    });

    return sorted;
  }

  /**
   * Get unique madhabs from entries
   */
  static getUniqueMadhabs(entries: AuditLogEntry[]): string[] {
    const madhabs = new Set(entries.map((e) => e.madhab).filter(Boolean));
    return Array.from(madhabs).sort();
  }

  /**
   * Get statistics for audit entries
   */
  static getStatistics(entries: AuditLogEntry[]): {
    totalCalculations: number;
    averageEstate: number;
    averageConfidence: number;
    dateRange: { from: Date; to: Date } | null;
    madhabs: { [key: string]: number };
  } {
    if (entries.length === 0) {
      return {
        totalCalculations: 0,
        averageEstate: 0,
        averageConfidence: 0,
        dateRange: null,
        madhabs: {},
      };
    }

    const madhabs: { [key: string]: number } = {};
    let totalEstate = 0;
    let totalConfidence = 0;
    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    entries.forEach((entry) => {
      // Count madhabs
      if (entry.madhab) {
        madhabs[entry.madhab] = (madhabs[entry.madhab] || 0) + 1;
      }

      // Sum estate and confidence
      totalEstate += entry.estate?.total || 0;
      totalConfidence += entry.result?.confidence || 0;

      // Track date range
      const entryDate = new Date(entry.timestamp);
      if (!minDate || entryDate < minDate) {
        minDate = entryDate;
      }
      if (!maxDate || entryDate > maxDate) {
        maxDate = entryDate;
      }
    });

    return {
      totalCalculations: entries.length,
      averageEstate: totalEstate / entries.length,
      averageConfidence: totalConfidence / entries.length,
      dateRange:
        minDate && maxDate ? { from: minDate, to: maxDate } : null,
      madhabs,
    };
  }

  /**
   * Export entries as JSON
   */
  static exportAsJSON(entries: AuditLogEntry[]): string {
    return JSON.stringify(
      {
        exportDate: new Date().toISOString(),
        totalEntries: entries.length,
        entries,
      },
      null,
      2
    );
  }

  /**
   * Format audit entry for display
   */
  static formatEntryForDisplay(entry: AuditLogEntry): {
    date: string;
    time: string;
    madhab: string;
    estate: string;
    heirsCount: number;
    confidence: string;
  } {
    const date = new Date(entry.timestamp);
    const dateStr = date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      date: dateStr,
      time: timeStr,
      madhab: entry.madhab || 'غير محدد',
      estate: `${(entry.estate?.total || 0).toFixed(0)} ر.س`,
      heirsCount: Object.values(entry.heirs || {}).reduce(
        (sum: number, count: number | undefined) => sum + (count || 0),
        0
      ),
      confidence: `${(entry.result?.confidence || 0).toFixed(0)}%`,
    };
  }
}

export default AuditTrailManager;
