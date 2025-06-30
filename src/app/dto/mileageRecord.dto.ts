import { User } from "./user.dto";

export interface MileageRecordDTO {
  id: number;
  userId: number;
  date: string;   
  startKm: number;
  endKm: number;
  totalKm: number;
  place: string;
  user:User;
  status?: string;
}