export interface NotificationDto {
  id?: number;
  title: string;
  message: string;
  status: 'UNREAD' | 'READ';
  type: string;
  senderId: number;
  receiverId: number;
  relatedReportId?: number;
  createdAt?: Date;
}
