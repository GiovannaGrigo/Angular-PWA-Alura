import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Observable, of } from 'rxjs';
import { NotificationMessage } from './notification-message';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly VAPID_PUBLIC_KEY = 'BA8Odlo2Co07pfMQNSh4pMVVw5bq1gSA60mKmcgUznQekVufIgL0UFRm0bGd-zp4c7DYCctr67477CToXDfYeFc';
  private baseUrl = 'http://localhost:3000';

  constructor(
    private swPush: SwPush,
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.subscribeToNotifications()
  }

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

  private subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(subscription => {
      this.sendSubscriptionToServer(subscription).subscribe();
    })
  }

  private sendSubscriptionToServer(subscription: PushSubscription): Observable<NotificationMessage> {

    return this.httpClient.post<NotificationMessage>(`${this.baseUrl}/subscribe`, subscription);
  }
}
