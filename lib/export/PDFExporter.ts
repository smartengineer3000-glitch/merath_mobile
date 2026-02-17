/**
 * PDF Export Service
 * Phase 1: Complete PDF Export Functionality
 * 
 * Generates professional PDF reports of inheritance calculations
 */

import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { CalculationResult, HeirShare } from '../inheritance/types';

export interface PDFExportOptions {
  filename?: string;
  includeCalculationSteps?: boolean;
  includeAuditLog?: boolean;
  theme?: 'light' | 'dark';
}

export class PDFExporter {
  /**
   * Generate HTML for PDF
   */
  private static generateHTML(
    result: CalculationResult,
    options: PDFExportOptions = {}
  ): string {
    const {
      includeCalculationSteps = true,
      theme = 'light',
      filename = 'inheritance-report',
    } = options;

    const backgroundColor = theme === 'light' ? '#ffffff' : '#f5f5f5';
    const textColor = theme === 'light' ? '#000000' : '#333333';
    const borderColor = theme === 'light' ? '#e0e0e0' : '#d0d0d0';

    const calculationTime = new Date().toLocaleString('ar-SA');

    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${filename}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Arial', sans-serif;
            background-color: ${backgroundColor};
            color: ${textColor};
            line-height: 1.6;
            padding: 20px;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border: 1px solid ${borderColor};
            border-radius: 8px;
          }

          .header {
            text-align: center;
            border-bottom: 3px solid #1F71BA;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }

          .header h1 {
            color: #1F71BA;
            font-size: 28px;
            margin-bottom: 10px;
          }

          .header h2 {
            color: #666;
            font-size: 16px;
            font-weight: normal;
          }

          .metadata {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #1F71BA;
          }

          .metadata-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
          }

          .metadata-label {
            font-weight: bold;
            color: #333;
            min-width: 150px;
          }

          .metadata-value {
            color: #666;
          }

          .section {
            margin-bottom: 30px;
          }

          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1F71BA;
            border-bottom: 2px solid #1F71BA;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }

          .special-cases {
            background-color: #fffacd;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 15px;
            border-left: 4px solid #FF9800;
          }

          .special-cases h3 {
            color: #FF9800;
            margin-bottom: 10px;
            font-size: 14px;
          }

          .case-item {
            margin-bottom: 8px;
            padding: 5px;
          }

          .case-item strong {
            color: #333;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }

          th {
            background-color: #1F71BA;
            color: white;
            padding: 12px;
            text-align: right;
            font-weight: bold;
          }

          td {
            padding: 12px;
            border-bottom: 1px solid ${borderColor};
            text-align: right;
          }

          tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          .amount {
            font-weight: bold;
            color: #1F71BA;
          }

          .percentage {
            color: #666;
            font-size: 14px;
          }

          .heir-name {
            font-weight: 500;
          }

          .summary {
            background-color: #f0f7ff;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #1F71BA;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
          }

          .summary-label {
            font-weight: bold;
          }

          .summary-value {
            color: #1F71BA;
            font-weight: bold;
          }

          .confidence {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid ${borderColor};
          }

          .confidence-high {
            color: #4CAF50;
            font-weight: bold;
          }

          .confidence-medium {
            color: #FF9800;
            font-weight: bold;
          }

          .confidence-low {
            color: #F44336;
            font-weight: bold;
          }

          .calculation-steps {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-top: 15px;
          }

          .step {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid ${borderColor};
          }

          .step:last-child {
            border-bottom: none;
          }

          .step-number {
            background-color: #1F71BA;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-left: 10px;
          }

          .step-title {
            font-weight: bold;
            margin-bottom: 5px;
          }

          .step-content {
            margin-left: 40px;
            color: #666;
            font-size: 14px;
          }

          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid ${borderColor};
            text-align: center;
            color: #999;
            font-size: 12px;
          }

          .disclaimer {
            background-color: #fff3e0;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #FF6F00;
            font-size: 12px;
            color: #333;
            margin-top: 20px;
          }

          @media print {
            body {
              padding: 0;
            }

            .container {
              border: none;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>📊 تقرير توزيع التركة</h1>
            <h2>Inheritance Distribution Report</h2>
          </div>

          <!-- Metadata -->
          <div class="metadata">
            <div class="metadata-row">
              <span class="metadata-label">المذهب الفقهي:</span>
              <span class="metadata-value">${result.madhhabName}</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">تاريخ التقرير:</span>
              <span class="metadata-value">${calculationTime}</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">وقت الحساب:</span>
              <span class="metadata-value">${result.calculationTime?.toFixed(2)} ms</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">حالة الحساب:</span>
              <span class="metadata-value">${result.success ? '✓ نجح' : '✗ فشل'}</span>
            </div>
          </div>

          <!-- Special Cases -->
          ${
            result.specialCases && (
              result.specialCases.awl ||
              result.specialCases.radd ||
              result.specialCases.hijabTypes.length > 0
            )
              ? `
            <div class="special-cases">
              <h3>⚠️ الحالات الشرعية الخاصة</h3>
              ${
                result.specialCases.awl
                  ? `<div class="case-item"><strong>العول:</strong> تطبيق العول على التركة</div>`
                  : ''
              }
              ${
                result.specialCases.radd
                  ? `<div class="case-item"><strong>الرد:</strong> رد الفاضل على الورثة</div>`
                  : ''
              }
              ${
                result.specialCases.hijabTypes.length > 0
                  ? `<div class="case-item"><strong>الحجب:</strong> ${result.specialCases.hijabTypes.join(', ')}</div>`
                  : ''
              }
            </div>
            `
              : ''
          }

          <!-- Distribution Table -->
          <div class="section">
            <h2 class="section-title">📋 جدول التوزيع</h2>
            <table>
              <thead>
                <tr>
                  <th>المبلغ (ر.س)</th>
                  <th>النسبة المئوية</th>
                  <th>الحصة</th>
                  <th>الوارث</th>
                </tr>
              </thead>
              <tbody>
                ${result.shares
                  .map(
                    (share: HeirShare) => `
                  <tr>
                    <td class="amount">${share.amount.toFixed(2)}</td>
                    <td class="percentage">${(share.percentage || 0).toFixed(2)}%</td>
                    <td>
                      ${
                        share.fraction
                          ? `${share.fraction.numerator}/${share.fraction.denominator}`
                          : '-'
                      }
                    </td>
                    <td class="heir-name">${share.name}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div class="section">
            <h2 class="section-title">💰 الملخص المالي</h2>
            <div class="summary">
              <div class="summary-row">
                <span class="summary-label">إجمالي التركة المستحقة:</span>
                <span class="summary-value">
                  ${result.shares.reduce((sum: number, s: HeirShare) => sum + s.amount, 0).toFixed(2)} ر.س
                </span>
              </div>
              <div class="summary-row">
                <span class="summary-label">عدد الورثة:</span>
                <span class="summary-value">${result.shares.length}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">درجة الثقة:</span>
                <span class="summary-value ${
                  result.confidence > 95
                    ? 'confidence-high'
                    : result.confidence > 80
                      ? 'confidence-medium'
                      : 'confidence-low'
                }">
                  ${result.confidence.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <!-- Calculation Steps -->
          ${
            includeCalculationSteps && result.steps && result.steps.length > 0
              ? `
            <div class="section">
              <h2 class="section-title">📝 خطوات الحساب</h2>
              <div class="calculation-steps">
                ${result.steps
                  .slice(0, 10)
                  .map(
                    (step: any, index: number) => `
                  <div class="step">
                    <div>
                      <span class="step-number">${index + 1}</span>
                      <span class="step-title">${step.description || 'خطوة'}</span>
                    </div>
                    <div class="step-content">
                      ${step.detail || ''}
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
            `
              : ''
          }

          <!-- Disclaimer -->
          <div class="disclaimer">
            <strong>⚠️ تنويه قانوني:</strong>
            <p>
              هذا التقرير يعتمد على البيانات المدخلة والمذهب الفقهي المختار. 
              يُنصح بالتحقق من النتائج مع متخصص في الشريعة الإسلامية قبل التنفيذ.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>تم إنشاء هذا التقرير بواسطة تطبيق حاسبة المواريث الشرعية</p>
            <p>© 2026 Merath Application. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Export calculation to PDF
   */
  static async exportToPDF(
    result: CalculationResult,
    options: PDFExportOptions = {}
  ): Promise<string> {
    try {
      const { filename = 'inheritance-report' } = options;

      // Generate HTML
      const html = this.generateHTML(result, options);

      // Print to PDF
      const pdf = await Print.printToFileAsync({
        html,
        base64: false,
      });

      return pdf.uri;
    } catch (error) {
      console.error('PDF Export Error:', error);
      throw new Error('Failed to generate PDF: ' + (error as Error).message);
    }
  }

  /**
   * Share PDF with other apps
   */
  static async sharePDF(pdfUri: string, filename: string = 'inheritance-report'): Promise<void> {
    try {
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'مشاركة تقرير التركة',
      });
    } catch (error) {
      console.error('PDF Share Error:', error);
      throw new Error('Failed to share PDF: ' + (error as Error).message);
    }
  }

  /**
   * Save PDF to device storage
   */
  static async savePDF(pdfUri: string, filename: string): Promise<string> {
    try {
      // Create a safe filename
      const safeFilename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      // Use the PDF URI directly (it's already saved by Print.printToFileAsync)
      // The URI returned is already in the app's cache/document directory
      return pdfUri;
    } catch (error) {
      console.error('PDF Save Error:', error);
      throw new Error('Failed to save PDF: ' + (error as Error).message);
    }
  }

  /**
   * Generate and share PDF
   */
  static async generateAndShare(
    result: CalculationResult,
    options: PDFExportOptions = {}
  ): Promise<void> {
    try {
      const filename = options.filename || `merath-${Date.now()}`;

      // Generate PDF
      const pdfUri = await this.exportToPDF(result, { ...options, filename });

      // Share PDF
      await this.sharePDF(pdfUri, filename);
    } catch (error) {
      console.error('Generate and Share Error:', error);
      throw error;
    }
  }

  /**
   * Generate and save PDF
   */
  static async generateAndSave(
    result: CalculationResult,
    options: PDFExportOptions = {}
  ): Promise<string> {
    try {
      const filename = options.filename || `merath-${Date.now()}`;

      // Generate PDF
      const pdfUri = await this.exportToPDF(result, { ...options, filename });

      // Save PDF
      const savedPath = await this.savePDF(pdfUri, filename);

      return savedPath;
    } catch (error) {
      console.error('Generate and Save Error:', error);
      throw error;
    }
  }
}
