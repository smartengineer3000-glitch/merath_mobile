/**
 * Custom React Hooks for Islamic Inheritance Calculator
 * يحتوي على 5 hooks رئيسية لإدارة حالة الحسابات والنتائج والتسجيل
 * @author Merath App
 * @version 1.0.0
 */

import { useState, useCallback, useEffect } from 'react';
import { InheritanceCalculationEngine } from './calculation-engine';
import { AuditLog, createAuditLog, type AuditLogEntry } from './audit-log';
import { CalculationCache, PerformanceMonitor } from '../performance/optimization';
import type {
  EstateData,
  CalculationResult,
  MadhhabType,
  HeirType,
  HeirsData,
} from './types';

// ============================================================================
// 1. useCalculator Hook - إدارة حالة الحسابات الأساسية
// ============================================================================

export function useCalculator() {
  const [estateData, setEstateData] = useState<EstateData>({
    total: 0,
    funeral: 0,
    debts: 0,
    will: 0,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateEstateData = useCallback((updates: Partial<EstateData>) => {
    setEstateData((prev) => ({
      ...prev,
      ...updates,
    }));
    setError(null);
  }, []);

  const resetCalculator = useCallback(() => {
    setEstateData({
      total: 0,
      funeral: 0,
      debts: 0,
      will: 0,
    });
    setResult(null);
    setError(null);
  }, []);

  const calculateWithMethod = useCallback(
    (madhab: MadhhabType, heirs: HeirsData) => {
      setIsCalculating(true);
      setError(null);

      try {
        if (estateData.total <= 0) {
          throw new Error('التركة يجب أن تكون أكبر من صفر');
        }

        const heirCount = Object.values(heirs).reduce(
          (sum, val) => (sum || 0) + (val || 0),
          0
        );
        if (heirCount === 0) {
          throw new Error('يجب تحديد ورثة واحد على الأقل');
        }

        // Check cache first
        const cachedResult = CalculationCache.getCalculation(madhab, estateData, heirs);
        if (cachedResult) {
          CalculationCache.recordHit(cachedResult.calculationTime || 0);
          setResult(cachedResult);
          return cachedResult;
        }

        // Perform calculation with performance monitoring
        const { result: calculationResult, duration } = PerformanceMonitor.measureSync(
          `Calculate [${madhab}]`,
          () => {
            const engine = new InheritanceCalculationEngine(madhab, estateData, heirs);
            return engine.calculate();
          }
        );

        if (!calculationResult) {
          throw new Error('فشل الحساب: لم يتم الحصول على نتيجة');
        }

        // Cache the result for future use
        CalculationCache.cacheCalculation(madhab, estateData, heirs, calculationResult, duration);
        CalculationCache.recordMiss(duration);

        setResult(calculationResult);
        return calculationResult;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'حدث خطأ غير معروف في الحساب';
        setError(errorMessage);
        setResult(null);
        return null;
      } finally {
        setIsCalculating(false);
      }
    },
    [estateData]
  );

  const getState = useCallback(
    () => ({
      estateData,
      result,
      isCalculating,
      error,
    }),
    [estateData, result, isCalculating, error]
  );

  return {
    estateData,
    result,
    isCalculating,
    error,
    updateEstateData,
    resetCalculator,
    calculateWithMethod,
    getState,
  };
}

// ============================================================================
// 2. useAuditLog Hook - الوصول لنظام التسجيل والبحث
// ============================================================================

export function useAuditLog() {
  const [auditLog] = useState(() => createAuditLog());
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const loadedEntries = auditLog.getAllEntries();
      setEntries(loadedEntries);
    } catch (err) {
      console.error('خطأ في تحميل سجل التسجيل:', err);
    } finally {
      setIsLoading(false);
    }
  }, [auditLog]);

  const logCalculation = useCallback(
    (
      madhab: MadhhabType,
      estate: EstateData,
      heirs: HeirsData,
      result: CalculationResult,
      duration?: number
    ) => {
      try {
        const entry = auditLog.logCalculation(
          madhab,
          heirs,
          estate,
          result,
          duration || 0,
          'حساب عادي'
        );
        setEntries((prev) => [...prev, entry]);
        return entry;
      } catch (err) {
        console.error('خطأ في تسجيل العملية:', err);
        return null;
      }
    },
    [auditLog]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      try {
        const success = auditLog.deleteEntry(id);
        if (success) {
          setEntries((prev) => prev.filter((entry) => entry.id !== id));
        }
        return success;
      } catch (err) {
        console.error('خطأ في حذف الإدخال:', err);
        return false;
      }
    },
    [auditLog]
  );

  const searchEntries = useCallback(
    (madhab?: MadhhabType, operation?: string, limit?: number) => {
      try {
        const results = auditLog.filter({
          madhab,
          operation: operation as any,
          limit,
        });
        return results;
      } catch (err) {
        console.error('خطأ في البحث:', err);
        return [];
      }
    },
    [auditLog]
  );

  const getStats = useCallback(() => {
    try {
      return auditLog.getStats();
    } catch (err) {
      console.error('خطأ في الحصول على الإحصائيات:', err);
      return null;
    }
  }, [auditLog]);

  const clearAll = useCallback(() => {
    try {
      auditLog.clearAll();
      setEntries([]);
      return true;
    } catch (err) {
      console.error('خطأ في مسح السجل:', err);
      return false;
    }
  }, [auditLog]);

  const exportAsJSON = useCallback(() => {
    try {
      return auditLog.exportAsJSON();
    } catch (err) {
      console.error('خطأ في التصدير:', err);
      return null;
    }
  }, [auditLog]);

  const importFromJSON = useCallback(
    (jsonString: string) => {
      try {
        const imported = auditLog.importFromJSON(jsonString);
        setEntries(auditLog.getAllEntries());
        return imported;
      } catch (err) {
        console.error('خطأ في الاستيراد:', err);
        return null;
      }
    },
    [auditLog]
  );

  return {
    entries,
    isLoading,
    logCalculation,
    deleteEntry,
    searchEntries,
    getStats,
    clearAll,
    exportAsJSON,
    importFromJSON,
    auditLog,
  };
}

// ============================================================================
// 3. useResults Hook - إدارة حالة النتائج والتخزين المؤقت
// ============================================================================

export function useResults() {
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);
  const [previousResults, setPreviousResults] = useState<CalculationResult[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);

  const saveResult = useCallback((result: CalculationResult) => {
    setCurrentResult(result);
    setPreviousResults((prev) => {
      const updated = [result, ...prev];
      return updated.slice(0, 10);
    });
  }, []);

  const clearResults = useCallback(() => {
    setCurrentResult(null);
    setPreviousResults([]);
    setComparisonMode(false);
  }, []);

  const compareResults = useCallback(
    (result1: CalculationResult, result2: CalculationResult) => {
      const comparison = {
        isSame: true,
        differences: [] as string[],
        totalShareDifference: 0,
      };

      if (result1.madhab !== result2.madhab) {
        comparison.isSame = false;
        comparison.differences.push(
          `المذهب: ${result1.madhab} vs ${result2.madhab}`
        );
      }

      if (result1.shares.length !== result2.shares.length) {
        comparison.isSame = false;
        comparison.differences.push(
          `عدد الحصص: ${result1.shares.length} vs ${result2.shares.length}`
        );
      }

      const total1 = result1.shares.reduce((sum, s) => sum + s.amount, 0);
      const total2 = result2.shares.reduce((sum, s) => sum + s.amount, 0);
      const totalDiff = Math.abs(total1 - total2);

      if (totalDiff > 0.01) {
        comparison.isSame = false;
        comparison.differences.push(`المبلغ الإجمالي: ${total1} vs ${total2}`);
        comparison.totalShareDifference = totalDiff;
      }

      return comparison;
    },
    []
  );

  const getMostUsedMadhab = useCallback(() => {
    const madhabs: Record<MadhhabType, number> = {
      shafii: 0,
      hanafi: 0,
      maliki: 0,
      hanbali: 0,
    };

    previousResults.forEach((r) => {
      madhabs[r.madhab]++;
    });

    return (Object.entries(madhabs).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      'shafii') as MadhhabType;
  }, [previousResults]);

  const getAverageResult = useCallback(() => {
    if (previousResults.length === 0) return null;

    const totalAmount = previousResults.reduce(
      (sum, r) => sum + r.shares.reduce((s, share) => s + share.amount, 0),
      0
    );
    const avgAmount = totalAmount / previousResults.length;

    return {
      count: previousResults.length,
      averageAmount: avgAmount,
      mostUsedMadhab: getMostUsedMadhab(),
    };
  }, [previousResults, getMostUsedMadhab]);

  const getResultsStats = useCallback(() => {
    return {
      totalResults: previousResults.length,
      currentResult,
      previousResults,
      comparison:
        currentResult && previousResults.length > 1
          ? compareResults(currentResult, previousResults[1])
          : null,
      average: getAverageResult(),
    };
  }, [currentResult, previousResults, compareResults, getAverageResult]);

  return {
    currentResult,
    previousResults,
    comparisonMode,
    saveResult,
    clearResults,
    compareResults,
    getResultsStats,
    getAverageResult,
    setComparisonMode,
  };
}

// ============================================================================
// 4. useMadhab Hook - إدارة اختيار المذهب
// ============================================================================

export function useMadhab(defaultMadhab: MadhhabType = 'shafii') {
  const [madhab, setMadhab] = useState<MadhhabType>(defaultMadhab);
  const [madhabs] = useState<MadhhabType[]>([
    'shafii',
    'hanafi',
    'maliki',
    'hanbali',
  ]);

  const changeMadhab = useCallback(
    (newMadhab: MadhhabType) => {
      if (madhabs.includes(newMadhab)) {
        setMadhab(newMadhab);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('selectedMadhab', newMadhab);
          } catch (err) {
            console.warn('لا يمكن حفظ المذهب في التخزين المحلي:', err);
          }
        }
        return true;
      }
      return false;
    },
    [madhabs]
  );

  const loadSavedMadhab = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('selectedMadhab') as MadhhabType;
        if (saved && madhabs.includes(saved)) {
          setMadhab(saved);
          return saved;
        }
      } catch (err) {
        console.warn('لا يمكن تحميل المذهب المحفوظ:', err);
      }
    }
    return madhab;
  }, [madhabs, madhab]);

  const getMadhhabInfo = useCallback(() => {
    const info: Record<MadhhabType, string> = {
      shafii: 'الشافعي',
      hanafi: 'الحنفي',
      maliki: 'المالكي',
      hanbali: 'الحنبلي',
    };
    return info[madhab];
  }, [madhab]);

  const getMadhhabsList = useCallback(() => {
    const list: Record<MadhhabType, string> = {
      shafii: 'المذهب الشافعي',
      hanafi: 'المذهب الحنفي',
      maliki: 'المذهب المالكي',
      hanbali: 'المذهب الحنبلي',
    };
    return Object.entries(list).map(([value, label]) => ({
      value: value as MadhhabType,
      label,
    }));
  }, []);

  return {
    madhab,
    madhabs,
    changeMadhab,
    loadSavedMadhab,
    getMadhhabInfo,
    getMadhhabsList,
  };
}

// ============================================================================
// 5. useHeirs Hook - إدارة الورثة ديناميكياً
// ============================================================================

export function useHeirs(initialHeirs: HeirsData = {}) {
  const [heirs, setHeirs] = useState<
    Array<{ id: string; key: HeirType; count: number }>
  >(
    Object.entries(initialHeirs).map(([key, count]) => ({
      id: `heir-${key}`,
      key: key as HeirType,
      count: count || 0,
    }))
  );
  const [error, setError] = useState<string | null>(null);

  const addHeir = useCallback(
    (heir: { type: string; gender: 'male' | 'female'; count: number; relation?: string }) => {
      try {
        if (!heir.type || heir.type.trim() === '') {
          throw new Error('نوع الوارث مطلوب');
        }

        if (heir.count < 1) {
          throw new Error('عدد الورثة يجب أن يكون 1 على الأقل');
        }

        const isDuplicate = heirs.some((h) => h.key === heir.type);
        if (isDuplicate) {
          throw new Error('هذا الوارث موجود بالفعل');
        }

        setHeirs((prev) => [
          ...prev,
          {
            id: `heir-${Date.now()}`,
            key: heir.type as HeirType,
            count: heir.count,
          },
        ]);
        setError(null);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'خطأ غير معروف';
        setError(msg);
        return false;
      }
    },
    [heirs]
  );

  const updateHeir = useCallback((id: string, updates: { count?: number }) => {
    try {
      setHeirs((prev) =>
        prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
      );
      setError(null);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(msg);
      return false;
    }
  }, []);

  const removeHeir = useCallback(
    (id: string) => {
      try {
        const newHeirs = heirs.filter((h) => h.id !== id);
        if (newHeirs.length === 0) {
          throw new Error('يجب الاحتفاظ بوارث واحد على الأقل');
        }
        setHeirs(newHeirs);
        setError(null);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'خطأ غير معروف';
        setError(msg);
        return false;
      }
    },
    [heirs]
  );

  const clearHeirs = useCallback(() => {
    setHeirs([]);
    setError(null);
  }, []);

  const validateHeirs = useCallback(() => {
    if (heirs.length === 0) {
      setError('يجب تحديد ورثة واحد على الأقل');
      return false;
    }

    const totalCount = heirs.reduce((sum, h) => sum + h.count, 0);
    if (totalCount === 0) {
      setError('يجب أن يكون هناك ورثة واحد على الأقل');
      return false;
    }

    setError(null);
    return true;
  }, [heirs]);

  const getHeirsStats = useCallback(() => {
    const stats = {
      totalCount: heirs.reduce((sum, h) => sum + h.count, 0),
      totalTypes: heirs.length,
      byGender: {
        male: 0,
        female: 0,
      },
      byType: {} as Record<HeirType, number>,
    };

    heirs.forEach((heir) => {
      stats.byType[heir.key] = (stats.byType[heir.key] || 0) + 1;
    });

    return stats;
  }, [heirs]);

  return {
    heirs,
    error,
    addHeir,
    updateHeir,
    removeHeir,
    clearHeirs,
    validateHeirs,
    getHeirsStats,
  };
}

export default {
  useCalculator,
  useAuditLog,
  useResults,
  useMadhab,
  useHeirs,
};
