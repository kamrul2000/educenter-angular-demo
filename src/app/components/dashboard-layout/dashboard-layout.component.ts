import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface SidebarItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="dashboard-wrapper">
      <div class="container-fluid py-4">
        <div class="row g-4">
          <!-- Sidebar -->
          <div class="col-lg-3 col-xl-2" *ngIf="sidebarItems.length">
            <div class="sidebar-nav card border-0 shadow-sm">
              <div class="card-body p-3">
                <h6 class="text-muted small fw-semibold text-uppercase mb-3 px-2">{{ sidebarTitle }}</h6>
                <nav class="d-flex flex-column gap-1">
                  <a *ngFor="let item of sidebarItems"
                     [routerLink]="item.route"
                     routerLinkActive="active"
                     class="sidebar-link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none">
                    <i class="bi" [class]="item.icon"></i>
                    <span class="small fw-medium">{{ item.label }}</span>
                  </a>
                </nav>
              </div>
            </div>
          </div>
          <!-- Main content -->
          <div [class]="sidebarItems.length ? 'col-lg-9 col-xl-10' : 'col-12'">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper { background: #f8f9fa; min-height: calc(100vh - 140px); }
    .sidebar-nav { border-radius: 16px !important; }
    .sidebar-link { color: #555; transition: all 0.2s; }
    .sidebar-link:hover, .sidebar-link.active { background: #1d355720; color: #1d3557; font-weight: 600; }
  `]
})
export class DashboardLayoutComponent {
  @Input() sidebarItems: SidebarItem[] = [];
  @Input() sidebarTitle = 'Navigation';
}
