import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  requestPermission(): Promise<NotificationPermission> {
    if (this.notificationSupported) {
      return Promise.reject('Notifications not supported');
    }

    return window.Notification.requestPermission();
  }

  showNotificaton(title: string, options?: NotificationOptions): void {
    if (!this.notificationSupported) {
      console.warn('Notifications not supported');
      return;
    }

    if (window.Notification.permission === 'granted') {
      new window.Notification(title, options);
    } else {
      console.warn('Notifications not supported');
    }
  }

  private get notificationSupported(): boolean {
    return isPlatformBrowser(this.platformId) && 'Noification' in window;
  }
}
