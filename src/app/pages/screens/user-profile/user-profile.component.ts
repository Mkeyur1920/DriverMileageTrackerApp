import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [
    InputTextModule,
    PasswordModule,
    FileUploadModule,
    ButtonModule,
    ToastModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  signaturePreview: string | ArrayBuffer | null = null;
  photoPreview: string | ArrayBuffer | null = null;
  userId: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId') || '';
      if (this.userId !== null) {
        this.userService.getById(this.userId).subscribe({
          next: (res) => {
            this.profileForm.patchValue({
              name: res.name,
              phoneNumber: res.phoneNumber,
              vehicleNumber: res.vehicleNumber,
              password: res.password,
            });

            // For previewing existing signature/photo
            if (res.signature) {
              this.signaturePreview = 'data:image/png;base64,' + res.signature;
            }

            if (res.userPhoto) {
              this.photoPreview = 'data:image/png;base64,' + res.userPhoto;
            }
          },
          error: (err) => {},
        });
      }
    });

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      vehicleNumber: ['', Validators.required],
      password: ['', Validators.minLength(4)],
      signature: [null],
      userPhoto: [null],
    });

    // Load existing user info from API here (you can patch the form)
  }
  onSubmit() {
    this.loading = true;
    if (this.profileForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Failed',
        detail: 'Please fill out all required fields',
      });
      return;
    }

    const formData = new FormData();
    const formValue = this.profileForm.value;

    // Handle normal text fields
    formData.append('name', formValue.name);
    formData.append('phoneNumber', formValue.phoneNumber);
    formData.append('vehicleNumber', formValue.vehicleNumber);
    if (formValue.password) {
      formData.append('password', formValue.password);
    }

    // Handle file uploads
    if (formValue.signature instanceof File) {
      formData.append('signature', formValue.signature);
    }

    if (formValue.userPhoto instanceof File) {
      formData.append('userPhoto', formValue.userPhoto);
    }

    this.userService.update(this.userId, formData).subscribe({
      next: (res) => {
        this.loading = false;
        if (res) {
          this.messageService.add({
            severity: 'success',
            summary: 'Profile Updated',
            detail: 'Your profile has been updated successfully.',
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Profile Not Updated',
          detail: `${err} while profile updating...`,
        });
      },
    });

    // Submit the formData via HTTP
  }
  onFileChange(event: any, field: 'signature' | 'userPhoto') {
    const file = event.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (field === 'signature') {
          this.signaturePreview = reader.result;
        } else {
          this.photoPreview = reader.result;
        }
      };
      reader.readAsDataURL(file);
      this.profileForm.patchValue({ [field]: file });
    }
  }
}
