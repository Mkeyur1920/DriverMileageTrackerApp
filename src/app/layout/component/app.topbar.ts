import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { ImageModule } from 'primeng/image';
import { LoginService } from '../../pages/service/login.service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { NotificationService } from '../../pages/service/notification.service';
import { DialogModule } from 'primeng/dialog';
import { NotificationDto } from '../../dto/notification.dto';

@Component({
  selector: 'app-topbar',
  standalone: true,
  styleUrls: ['./app-topbar.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ImageModule,
    CommonModule,
    StyleClassModule,
    AppConfigurator,
    MenuModule,
    DialogModule,
  ],
  template: `
    <div class="layout-topbar">
      <!-- Hamburger / Menu toggle -->
      <button
        class="layout-menu-button layout-topbar-action"
        (click)="layoutService.onMenuToggle()"
      >
        <i class="pi pi-bars"></i>
      </button>

      <!-- Logo & Title -->
      <div class="layout-topbar-logo-container flex items-center gap-3">
        <a
          class="layout-topbar-logo flex items-center gap-3"
          routerLink="/dashboard"
        >
          <img
            src="assets/fulllogo.jpg"
            alt="Driver Mileage Tracker Logo"
            class="app-logo h-10 w-auto"
          />
        </a>
        <span
          class="text-xl font-semibold whitespace-nowrap"
          [ngClass]="{
            'text-white': layoutService.isDarkTheme(),
            'text-black': !layoutService.isDarkTheme(),
          }"
        >
          Driver Mileage Tracker
        </span>
      </div>

      <!-- Right Side Actions -->
      <div class="layout-topbar-actions">
        <p-menu #menu [model]="items" [popup]="true" />
        <p-button (click)="menu.toggle($event)" icon="pi pi-ellipsis-v" />
        <!-- Dark mode & Theme -->
        <div class="layout-config-menu flex items-center gap-3">
          <!-- Dark Mode -->
          <button
            type="button"
            class="layout-topbar-action"
            (click)="toggleDarkMode()"
          >
            <i
              [ngClass]="{
                pi: true,
                'pi-moon': layoutService.isDarkTheme(),
                'pi-sun': !layoutService.isDarkTheme(),
              }"
            ></i>
          </button>

          <!-- Theme Configurator -->
          <div class="relative">
            <button
              class="layout-topbar-action layout-topbar-action-highlight"
              pStyleClass="@next"
              enterFromClass="hidden"
              enterActiveClass="animate-scalein"
              leaveToClass="hidden"
              leaveActiveClass="animate-fadeout"
              [hideOnOutsideClick]="true"
            >
              <i class="pi pi-palette"></i>
            </button>
            <app-configurator />
          </div>
        </div>
      </div>
    </div>
    <p-dialog
      header="Your Notifications"
      [(visible)]="showNotificationsDialog"
      [modal]="true"
      [style]="{ width: '30vw' }"
      [breakpoints]="{ '960px': '80vw', '640px': '95vw' }"
      [closable]="true"
    >
      <div *ngIf="notifications.length; else noNotif">
        <ul class="list-none p-0 m-0 max-h-80 overflow-y-auto">
          <li
            *ngFor="let n of notifications"
            class="border-b p-3 cursor-pointer"
            [ngClass]="{ 'font-bold text-primary': n.status === 'UNREAD' }"
            (click)="markAsRead(n)"
          >
            <div class="text-sm">{{ n.title }}</div>
            <small class="text-gray-500">{{ n.message }}</small>
            <div class="text-xs text-gray-400 mt-1">
              {{ n.createdAt | date: 'short' }}
            </div>
          </li>
        </ul>
      </div>
      <ng-template #noNotif>
        <p>No notifications available.</p>
      </ng-template>
    </p-dialog>
  `,
})
export class AppTopbar {
  items: MenuItem[] | undefined;
  notifications: NotificationDto[] = [];
  showNotificationsDialog = false;

  unreadCount: number = 0;

  constructor(
    private router: Router,
    public layoutService: LayoutService,
    private loginService: LoginService,
    private notificationService: NotificationService, // ✅ Inject NotificationService
  ) {}

  ngOnInit() {
    this.updateMenuItems();
    const userId = this.loginService.getUser().id;
    this.notificationService.getUserNotifications(userId).subscribe((data) => {
      this.notifications = data;
      this.unreadCount = data.filter((n) => n.status === 'UNREAD').length;
      this.updateMenuItems();
    });
  }
  updateMenuItems() {
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Messages',
            icon: 'pi pi-inbox',
            badge: this.unreadCount > 0 ? String(this.unreadCount) : '',
            command: () => this.openNotifications(),
          },
          {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => this.userProfile(),
          },
          {
            label: 'Log-out',
            icon: 'pi pi-sign-out',
            command: () => this.onLogout(),
          },
        ],
      },
    ];
  }

  openNotifications(): void {
    const userId = this.loginService.getUser().id;
    this.notificationService.getUserNotifications(userId).subscribe((data) => {
      this.notifications = data;
      this.unreadCount = data.filter((n) => n.status === 'UNREAD').length;
      this.showNotificationsDialog = true;
    });
  }

  markAsRead(notification: NotificationDto): void {
    if (notification.status === 'UNREAD') {
      this.notificationService.markAsRead(notification.id!).subscribe(() => {
        notification.status = 'READ';
      });
    }
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme,
    }));
  }

  onLogout = () => {
    this.loginService.logout();
    this.router.navigate(['/']);
  };

  userProfile = () => {
    const userId = this.loginService.getUser().id;
    this.router.navigate([`/screens/user-profile/${userId}`]);
  };
}
