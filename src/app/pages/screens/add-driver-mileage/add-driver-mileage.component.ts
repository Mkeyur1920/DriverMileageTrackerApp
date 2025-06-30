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



@Component({
  selector: 'app-add-driver-mileage',
  imports: [InputTextModule,
    CommonModule,InputIconModule,IconFieldModule, ToastModule ,InputNumberModule,ButtonModule,ImageModule, FluidModule,FileUploadModule, ButtonModule, SelectModule, FormsModule, TextareaModule],
  templateUrl: './add-driver-mileage.component.html',
  styleUrl: './add-driver-mileage.component.scss'
})
export class AddDriverMileageComponent {


  addMileageModel = {
    startKm : '',
    endKm:'',
    totalKm:'',
    placesVisited:'',
    uploadedFiles: [] = []

  }

  constructor(private mileService:MileageRecordService,
    private loginService: LoginService,
    private messageService : MessageService
  ){}
  dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];

    dropdownItem = null;
    uploadedFiles: any[] = [];

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        // console.log(this.uploadedFiles)

        // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

    

    
    

    onAddMileage(){
      const userId = this.loginService.getUser().id
      const payload = this.addMileageModel
      this.uploadedFiles = payload.uploadedFiles
      this.mileService.saveMileageRecord(
        this.addMileageModel.startKm,
        this.addMileageModel.endKm,
        this.addMileageModel.totalKm,
        this.addMileageModel.placesVisited,
        userId
    ).subscribe(
        (next)=>{
          this.messageService.add(
            { severity: 'success', summary: 'Success', detail: 'Mileage Record Successfully..!' });
            this.addMileageModel = {
            startKm : '',
            endKm : '',
            totalKm:'',
            placesVisited:'',
            uploadedFiles: [] = []
          }

        },
        
        (error)=>{
          const e = error.error.messages[0]
          this.messageService.add(
            { severity: 'error', summary: 'error', detail: e  });

        }
      )
    }

}
