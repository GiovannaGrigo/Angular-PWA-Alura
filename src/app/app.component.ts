import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { BannerComponent } from "./shared/components/banner/banner.component";
import { TimerControlComponent } from "./shared/components/timer-control/timer-control.component";
import { TaskManagerComponent } from "./shared/components/task-manager/task-manager.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    BannerComponent,
    TimerControlComponent,
    TaskManagerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ng-fokus';
}
