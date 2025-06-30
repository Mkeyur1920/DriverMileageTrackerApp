import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LoginService } from '../service/login.service';
import { ImageModule } from 'primeng/image';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule,ImageModule,ToastModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <p-image width="100" src="assets/fulllogo.jpg"></p-image>

                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to Driver Mileage Tracker !</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label for="phoneNumber" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Phone Number</label>
                            <input pInputText id="phoneNumber" type="text" placeholder="Phone Number" class="w-full md:w-[30rem] mb-8" [(ngModel)]="loginModel.phoneNumber" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="loginModel.password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                                <span (click)="newUser()" class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">New User?</span>
                            </div>
                            <p-button label="Sign In" styleClass="w-full" (onClick)="onLoginbtn()"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p-toast></p-toast>
    `
})
export class Login {

    constructor( private router: Router,private messageService : MessageService,
        private loginService: LoginService
    ) {}

    loginModel = {
    phoneNumber:'',
    password:'',
    vehicleNumber:''

    }

    email: string = '';

    password: string = '';

    checked: boolean = false;

    newUser(){
        this.router.navigate(['/auth/register-user'])
    }

    onLoginbtn(){
        const payload = this.loginModel;
        this.loginService.login(payload.phoneNumber, payload.vehicleNumber,payload.password)
        .subscribe(success => {
        if (success) {
            this.router.navigate(['/dashboard']);
        } else {
            alert('Login failed!');
        }
        },(e=>{
            this.messageService.add(
            { severity: 'error', summary: 'Error', detail: e.error.message });
        }));
    }
}
