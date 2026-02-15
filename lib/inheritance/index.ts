/**
 * تصدير جميع مكونات نظام المواريث
 * Export All Inheritance System Components
 */

// ====== أنواع البيانات ======
export * from './types';

// ====== الكسور ======
export { FractionClass } from './fraction';

// ====== قاعدة البيانات الفقهية ======
export {
  FIQH_DATABASE,
  getMadhhabConfig,
  getHijabRules,
  isValidMadhab
} from './constants';

// ====== نظام الحجب ======
export { HijabSystem } from './hijab-system';

// ====== محرك الحسابات ======
export { InheritanceCalculationEngine } from './calculation-engine';
export { EnhancedInheritanceEngine, enhancedInheritanceEngine } from './enhanced-calculation-engine';

// ====== نظام الاختبارات ======
export {
  TestSuite,
  runTestSuite,
  type TestCase,
  type TestResult,
  type TestReport
} from './test-suite';

// ====== نظام تسجيل العمليات ======
export {
  AuditLog,
  createAuditLog,
  getAuditLogStats,
  type AuditLogEntry,
  type AuditLogFilter,
  type AuditLogStats
} from './audit-log';

// ====== Custom React Hooks ======
export {
  useCalculator,
  useAuditLog,
  useResults,
  useMadhab,
  useHeirs
} from './hooks';

// ====== الدوال المساعدة ======
export {
  HEIR_NAMES,
  MADHAB_COLORS,
  MADHAB_ICONS,
  MADHAB_NAMES,
  isValidMadhab as isValidMadhab_util,
  isValidHeirType,
  formatCurrency,
  formatPercentage,
  lcm,
  gcd,
  generateId,
  measureTime,
  formatTime,
  validateEstateData,
  validateHeirsData,
  countTotalHeirs,
  countHeirTypes,
  sortHeirsByPriority,
  getHeirName,
  getMadhhabColor,
  getMadhhabIcon,
  getMadhhabName
} from './utils';

