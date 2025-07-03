export interface MonthlyReportDTO {
  id: number;
  user: {
    id: number;
    name: string;
    phoneNumber: string;
    vehicleNumber: string;
    roles: any;
  };
  month: string; // Format: "YYYY-MM"
  totalKm: number;
  reportFileUrl?: string;
  status: 'PENDING' | 'GENERATED' | 'REJECTED'; // Match your enum
  createdBy?: number;
  createdDatetime?: string;
  lastUpdatedBy?: number;
  lastUpdatedDatetime?: string;
}
