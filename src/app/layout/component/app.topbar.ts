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

@Component({
  selector: 'app-topbar',
  standalone: true,
  styleUrls: ['./app-topbar.component.scss'],
  imports: [
    RouterModule,
    ButtonModule,
    ImageModule,
    CommonModule,
    StyleClassModule,
    AppConfigurator,
    MenuModule,
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

        <!-- Ellipsis button for mobile dropdown -->
        <button
          class="layout-topbar-menu-button layout-topbar-action"
          pStyleClass="@next"
          enterFromClass="hidden"
          enterActiveClass="animate-scalein"
          leaveToClass="hidden"
          leaveActiveClass="animate-fadeout"
          [hideOnOutsideClick]="true"
        >
          <i class="pi pi-ellipsis-v"></i>
        </button>

        <!-- Topbar Menu (visible on lg and up) -->
        <p-menu #menu [model]="items" [popup]="true" />
        <p-button (click)="menu.toggle($event)" icon="pi pi-ellipsis-v" />
        <div class="layout-topbar-menu hidden lg:block">
          <div class="layout-topbar-menu-content">
            <!-- <button type="button" class="layout-topbar-action">
              <i class="pi pi-calendar"></i>
              <span>Calendar</span>
            </button>

            <button type="button" class="layout-topbar-action">
              <i class="pi pi-inbox"></i>
              <span>Messages</span>
            </button>

            <button type="button" class="layout-topbar-action">
              <i class="pi pi-user"></i>
              <span>Profile</span>
            </button> -->

            <!-- Logout button -->
            <!-- <button
              type="button"
              class="layout-topbar-action"
              (click)="onLogout()"
            >
              <i class="pi pi-sign-out"></i>
              <span>Logout</span>
            </button> -->
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AppTopbar {
  items: MenuItem[] | undefined;

  constructor(
    private router: Router,
    public layoutService: LayoutService,
    private loginService: LoginService,
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Messages',
            icon: 'pi pi-inbox',
          },
          {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => this.userProfile(),
          },
          {
            label: 'Log-out',
            icon: 'pi pi-sign-out',
            command: () => this.onLogout(), // ✅ fix here
          },
        ],
      },
    ];
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
