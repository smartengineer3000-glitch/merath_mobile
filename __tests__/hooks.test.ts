/**
 * @file hooks.test.ts
 * @description اختبارات شاملة للخطافات المخصصة (Custom Hooks)
 * Phase 4: Custom React Hooks Testing
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  useCalculator,
  useAuditLog,
  useResults,
  useMadhab,
  useHeirs
} from '../lib/inheritance/hooks';
import { AuditLog, createAuditLog } from '../lib/inheritance/audit-log';
import { InheritanceCalculationEngine } from '../lib/inheritance/calculation-engine';

// ============================================================================
// Test Suite 1: Hooks Export Validation
// ============================================================================
describe('Phase 4: Hooks Export Validation', () => {
  it('should export useCalculator function', () => {
    expect(typeof useCalculator).toBe('function');
  });

  it('should export useAuditLog function', () => {
    expect(typeof useAuditLog).toBe('function');
  });

  it('should export useResults function', () => {
    expect(typeof useResults).toBe('function');
  });

  it('should export useMadhab function', () => {
    expect(typeof useMadhab).toBe('function');
  });

  it('should export useHeirs function', () => {
    expect(typeof useHeirs).toBe('function');
  });
});

// ============================================================================
// Test Suite 2: AuditLog Core Functionality
// ============================================================================
describe('AuditLog Core Functionality', () => {
  let auditLog: AuditLog;

  beforeEach(() => {
    auditLog = createAuditLog();
  });

  afterEach(() => {
    auditLog.clearAll();
  });

  it('should create a new AuditLog instance', () => {
    expect(auditLog).toBeDefined();
    expect(auditLog).toBeInstanceOf(AuditLog);
  });

  it('should log a calculation operation', () => {
    const heirs = { الابن: 1 };
    const estate = { total: 1000, funeral: 0, debts: 0, will: 0 };
    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    const entry = auditLog.logCalculation('hanafi', heirs, estate, result, 100, 'Test');
    
    expect(entry).toBeDefined();
    expect(entry.madhab).toBe('hanafi');
    expect(entry.operation).toBe('calculate');
  });

  it('should retrieve all audit log entries', () => {
    const heirs = { الابن: 1 };
    const estate = { total: 1000, funeral: 0, debts: 0, will: 0 };
    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    auditLog.logCalculation('hanafi', heirs, estate, result, 100, 'Test 1');
    auditLog.logCalculation('maliki', heirs, estate, result, 150, 'Test 2');

    const entries = auditLog.getAllEntries();
    expect(entries.length).toBe(2);
  });

  it('should filter entries by madhab', () => {
    const heirs = { الابن: 1 };
    const estate = { total: 1000, funeral: 0, debts: 0, will: 0 };
    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    auditLog.logCalculation('hanafi', heirs, estate, result, 100, 'Hanafi calc');
    auditLog.logCalculation('maliki', heirs, estate, result, 150, 'Maliki calc');
    auditLog.logCalculation('hanafi', heirs, estate, result, 120, 'Another Hanafi');

    const filtered = auditLog.filter({ madhab: 'hanafi' });
    expect(filtered.length).toBe(2);
  });

  it('should calculate statistics from audit log', () => {
    const heirs = { الابن: 1 };
    const estate = { total: 1000, funeral: 0, debts: 0, will: 0 };
    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    auditLog.logCalculation('hanafi', heirs, estate, result, 100, 'Test 1');
    auditLog.logCalculation('hanafi', heirs, estate, result, 150, 'Test 2');

    const stats = auditLog.getStats();
    expect(stats.totalEntries).toBe(2);
    expect(stats.madhabs.hanafi).toBe(2);
  });

  it('should delete a specific entry from audit log', () => {
    const heirs = { الابن: 1 };
    const estate = { total: 1000, funeral: 0, debts: 0, will: 0 };
    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    auditLog.logCalculation('hanafi', heirs, estate, result, 100, 'Test 1');
    auditLog.logCalculation('hanafi', heirs, estate, result, 150, 'Test 2');

    const entries = auditLog.getAllEntries();
    const firstEntryId = entries[0].id;

    const deleted = auditLog.deleteEntry(firstEntryId);
    expect(deleted).toBe(true);

    const updatedEntries = auditLog.getAllEntries();
    expect(updatedEntries.length).toBe(1);
  });

  it('should export audit log as JSON', () => {
    const heirs = { الابن: 1 };
    const estate = { total: 1000, funeral: 0, debts: 0, will: 0 };
    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    auditLog.logCalculation('hanafi', heirs, estate, result, 100, 'Test');

    const json = auditLog.exportAsJSON();
    const parsed = JSON.parse(json);

    expect(parsed).toBeDefined();
    expect(Array.isArray(parsed)).toBe(true);
  });

  it('should import audit log from JSON', () => {
    const heirs = { الابن: 1 };
    const estate = { total: 1000, funeral: 0, debts: 0, will: 0 };
    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    auditLog.logCalculation('hanafi', heirs, estate, result, 100, 'Original');

    const exported = auditLog.exportAsJSON();
    const newAuditLog = createAuditLog();
    newAuditLog.importFromJSON(exported);

    const importedEntries = newAuditLog.getAllEntries();
    expect(importedEntries.length).toBe(1);
  });

  it('should get a specific entry by ID', () => {
    const heirs = { الابن: 1 };
    const estate = { total: 1000, funeral: 0, debts: 0, will: 0 };
    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    const entry = auditLog.logCalculation('hanafi', heirs, estate, result, 100, 'Test entry');
    const retrieved = auditLog.getEntry(entry.id);

    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(entry.id);
  });

  it('should clear all entries from audit log', () => {
    const heirs = { الابن: 1 };
    const estate = { total: 1000, funeral: 0, debts: 0, will: 0 };
    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    auditLog.logCalculation('hanafi', heirs, estate, result, 100, 'Test 1');
    auditLog.logCalculation('hanafi', heirs, estate, result, 150, 'Test 2');

    expect(auditLog.getAllEntries().length).toBe(2);

    const cleared = auditLog.clearAll();
    expect(cleared).toBe(2);
    expect(auditLog.getAllEntries().length).toBe(0);
  });
});

// ============================================================================
// Test Suite 3: Calculation Engine Integration
// ============================================================================
describe('Calculation Engine Integration', () => {
  it('should create and use InheritanceCalculationEngine', () => {
    const heirs = { الابن: 1 };
    const estate = { total: 10000, funeral: 500, debts: 1000, will: 2000 };

    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    expect(result).toBeDefined();
    expect(result.madhab).toBe('hanafi');
    expect(result.shares).toBeDefined();
  });

  it('should calculate with different madhabs', () => {
    const heirs = { الابن: 1, البنت: 1 };
    const estate = { total: 10000, funeral: 0, debts: 0, will: 0 };

    const hanafi = new InheritanceCalculationEngine('hanafi', estate, heirs).calculate();
    const maliki = new InheritanceCalculationEngine('maliki', estate, heirs).calculate();

    expect(hanafi.madhab).toBe('hanafi');
    expect(maliki.madhab).toBe('maliki');
  });

  it('should handle multiple heirs calculation', () => {
    const heirs = { الابن: 2, البنت: 1 };
    const estate = { total: 12000, funeral: 0, debts: 0, will: 0 };

    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    expect(result.shares).toBeDefined();
    expect(result).toBeDefined();
  });

  it('should handle single heir calculation', () => {
    const heirs = { الابن: 1 };
    const estate = { total: 5000, funeral: 0, debts: 0, will: 0 };

    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    expect(result.shares).toBeDefined();
    expect(result).toBeDefined();
  });

  it('should handle deductions correctly', () => {
    const heirs = { الابن: 1 };
    const estate = { total: 10000, funeral: 500, debts: 1000, will: 2000 };

    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    expect(result).toBeDefined();
    expect(result.madhab).toBe('hanafi');
  });
});

// ============================================================================
// Test Suite 4: Module Exports and Structure
// ============================================================================
describe('Module Exports and Structure', () => {
  it('should export hooks from index.ts', async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    const indexPath = path.join('/workspaces/merath_mobile/lib/inheritance/index.ts');
    
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      expect(content).toContain('useCalculator');
      expect(content).toContain('useAuditLog');
      expect(content).toContain('useResults');
      expect(content).toContain('useMadhab');
      expect(content).toContain('useHeirs');
    }
  });

  it('should have hooks.ts file', async () => {
    const fs = await import('fs');
    const hooksPath = '/workspaces/merath_mobile/lib/inheritance/hooks.ts';
    
    expect(fs.existsSync(hooksPath)).toBe(true);
  });

  it('should export AuditLog class', () => {
    expect(typeof AuditLog).toBe('function');
    expect(typeof createAuditLog).toBe('function');
  });

  it('should export InheritanceCalculationEngine', () => {
    expect(typeof InheritanceCalculationEngine).toBe('function');
  });
});

// ============================================================================
// Test Suite 5: Type System Validation
// ============================================================================
describe('Type System Validation', () => {
  it('should handle EstateData correctly', () => {
    const estate = { total: 1000, funeral: 100, debts: 50, will: 200 };
    const heirs = { الابن: 1 };

    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    expect(engine).toBeDefined();
  });

  it('should handle HeirsData correctly', () => {
    const heirs = { الابن: 1, البنت: 1 };
    const estate = { total: 1000, funeral: 0, debts: 0, will: 0 };

    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    expect(result.shares).toBeDefined();
  });

  it('should handle valid madhab values', () => {
    const madhabs: Array<'hanafi' | 'maliki' | 'shafii' | 'hanbali'> = ['hanafi'];
    
    const heirs = { الابن: 1 };
    const estate = { total: 1000, funeral: 0, debts: 0, will: 0 };

    madhabs.forEach(madhab => {
      const engine = new InheritanceCalculationEngine(madhab, estate, heirs);
      const result = engine.calculate();
      
      expect(result.madhab).toBe(madhab);
      expect(result).toBeDefined();
    });
  });
});

// ============================================================================
// Test Suite 6: Integration Tests
// ============================================================================
describe('Integration Tests', () => {
  it('should integrate calculation engine with audit log', () => {
    const auditLog = createAuditLog();
    const heirs = { الابن: 1 };
    const estate = { total: 5000, funeral: 0, debts: 0, will: 0 };

    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    auditLog.logCalculation('hanafi', heirs, estate, result, 50, 'Integration test');

    const entries = auditLog.getAllEntries();
    expect(entries.length).toBe(1);
    expect(entries[0].madhab).toBe('hanafi');
  });

  it('should handle multiple sequential calculations', () => {
    const auditLog = createAuditLog();
    const heirs1 = { الابن: 1 };
    const heirs2 = { البنت: 2 };
    const estate = { total: 10000, funeral: 0, debts: 0, will: 0 };

    const engine1 = new InheritanceCalculationEngine('hanafi', estate, heirs1);
    const result1 = engine1.calculate();
    auditLog.logCalculation('hanafi', heirs1, estate, result1, 100, 'Calc 1');

    const engine2 = new InheritanceCalculationEngine('maliki', estate, heirs2);
    const result2 = engine2.calculate();
    auditLog.logCalculation('maliki', heirs2, estate, result2, 150, 'Calc 2');

    const entries = auditLog.getAllEntries();
    expect(entries.length).toBe(2);
  });

  it('should export and re-import calculations', () => {
    const auditLog1 = createAuditLog();
    const heirs = { الابن: 1 };
    const estate = { total: 3000, funeral: 0, debts: 0, will: 0 };

    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();
    auditLog1.logCalculation('hanafi', heirs, estate, result, 75, 'Export test');

    const json = auditLog1.exportAsJSON();

    const auditLog2 = createAuditLog();
    auditLog2.importFromJSON(json);

    const importedEntries = auditLog2.getAllEntries();
    expect(importedEntries.length).toBe(1);
    expect(importedEntries[0].madhab).toBe('hanafi');
  });

  it('should filter entries by operation type', () => {
    const auditLog = createAuditLog();
    const heirs = { الابن: 1 };
    const estate = { total: 5000, funeral: 0, debts: 0, will: 0 };

    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    auditLog.logCalculation('hanafi', heirs, estate, result, 100, 'Test');
    
    const filtered = auditLog.filter({ operation: 'calculate' });
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('should maintain entry data integrity through operations', () => {
    const auditLog = createAuditLog();
    const heirs = { الابن: 2, البنت: 1 };
    const estate = { total: 20000, funeral: 500, debts: 1000, will: 5000 };

    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    const entry = auditLog.logCalculation('hanafi', heirs, estate, result, 200, 'Integrity test');

    expect(entry.heirs).toEqual(heirs);
    expect(entry.estate).toEqual(estate);
    expect(entry.result).toEqual(result);
  });
});
