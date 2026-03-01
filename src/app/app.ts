import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './core/services/theme.service';
import { FloatingDockComponent } from './shared/components/floating-dock/floating-dock.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FloatingDockComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('deivamanikailasam');
  protected readonly themeService = inject(ThemeService);
  protected readonly currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.themeService.setTheme('dark');
  }
}
