import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FluidModule } from 'primeng/fluid';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { MileageRecordService } from '../../service/mileage-records.service';
import { LoginService } from '../../service/login.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-add-driver-mileage',
  imports: [
    InputTextModule,
    CommonModule,
    InputIconModule,
    IconFieldModule,
    ToastModule,
    InputNumberModule,
    ButtonModule,
    ImageModule,
    FluidModule,
    FileUploadModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    TextareaModule,
    CalendarModule,
  ],
  templateUrl: './add-driver-mileage.component.html',
  styleUrl: './add-driver-mileage.component.scss',
})
export class AddDriverMileageComponent {
  addMileageModel = {
    startKm: '',
    endKm: '',
    totalKm: '',
    date: new Date(),
    placesVisited: '',
    uploadedFiles: ([] = []),
  };

  constructor(
    private mileService: MileageRecordService,
    private loginService: LoginService,
    private messageService: MessageService,
  ) {}

  dropdownItem = null;
  uploadedFiles: any[] = [];

  onUpload(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
    // console.log(this.uploadedFiles)
    // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  }

  formatDateToYYYYMMDD(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onAddMileage() {
    const payload = {
      startKm: this.addMileageModel.startKm,
      endKm: this.addMileageModel.endKm,
      totalKm: this.addMileageModel.totalKm,
      placesVisited: this.addMileageModel.placesVisited,
      date: this.formatDateToYYYYMMDD(this.addMileageModel.date),
      userId: this.loginService.getUser().id,
    };
    // this.uploadedFiles = payload.uploadedFiles;
    console.log(payload);

    this.mileService.saveMileageRecord(payload).subscribe({
      next: (res) => {
        if (res !== null) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Mileage Record Successfully..!',
          });
          this.addMileageModel = {
            startKm: '',
            endKm: '',
            date: new Date(),
            totalKm: '',
            placesVisited: '',
            uploadedFiles: ([] = []),
          };
        }
      },
      error: (err) => {
        const e = err.error.messages[0];
        this.messageService.add({
          severity: 'error',
          summary: 'error',
          detail: e,
        });
      },
    });
  }
}
