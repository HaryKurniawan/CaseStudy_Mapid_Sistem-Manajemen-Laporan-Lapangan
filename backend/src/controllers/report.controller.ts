import {
  getReports,
  getReportById,
  createReport,
  updateReportStatus,
  deleteReport,
  getReportStats,
} from './report/index.js';

export * from './report/index.js';

/**
 * Backward compatibility class wrapper
 */
export class ReportController {
  static getReports = getReports;
  static getReportById = getReportById;
  static createReport = createReport;
  static updateReportStatus = updateReportStatus;
  static deleteReport = deleteReport;
  static getReportStats = getReportStats;
}
