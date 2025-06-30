import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Driver Mileage Tracker by
        <a href="https://keyurmistry.vercel.app/" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Keyur Mistry</a>
    </div>`
})
export class AppFooter {}
