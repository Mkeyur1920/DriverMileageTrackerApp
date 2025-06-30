import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { LoginService } from '../../pages/service/login.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    userId : any;
    isAdminRole : boolean = false;
    roleName : string = '';

    constructor(private authService : LoginService){}
    ngOnInit() {

        const user  = this.authService.getUser()

        this.userId = user.id

        if (user.roles.some((role:any) => role.roleName === 'ADMIN')) {
            this.isAdminRole = true;
        }
        

        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }]
            },
            {
                label: 'Driver',
                items: [
                    { label: 'Add-Mileage', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/screens/add-mileage'] },
                    { label: 'view', icon: 'pi pi-fw pi-eye', class: 'rotated-icon', routerLink: ['/screens/view-mileage'] },

                
                ]
            },
            {
                label: 'Admin',
                visible:this.isAdminRole,
                items: [
                    { label: 'Reports', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/screens/reports'] },
                
                ]
            },
            
        ];
    }
}
