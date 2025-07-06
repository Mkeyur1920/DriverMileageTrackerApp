import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { ImageModule } from 'primeng/image';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../service/login.service';
import { RegisterDTO } from '../../../dto/register.dto';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-register',
  imports: [
    InputTextModule,
    DropdownModule,
    InputTextModule,
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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerModel: any = {
    name: '',
    vehicleNumber: '',
    phoneNumber: '',
    repassword: '',
    password: '',
    email: '',
    selectedRole: 'DRIVER',
  };

  roles = [
    // { label: 'ADMIN', value: 'ADMIN' },
    { label: 'DRIVER', value: 'DRIVER' },
  ];

  constructor(
    private msgService: MessageService,
    private router: Router,
    private authService: LoginService,
    private location: Location,
  ) {}

  goBackToLogin() {
    this.location.back();
  }

  onRegister() {
    const payload: RegisterDTO = this.registerModel;

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.msgService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registraion Successfully Done 😀! Now Login 🚀',
        });
      },
      error: (err) => {
        this.msgService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }
}
