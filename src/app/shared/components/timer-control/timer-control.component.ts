import { Howl } from 'howler';
import { CommonModule } from '@angular/common';
import { Component, effect, Inject, inject, OnInit } from '@angular/core';
import { ContextService, ContextType } from '../../services/context.service';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/audio.service';
import { NotificationService } from '../../services/notification.service';
import { SwPush } from '@angular/service-worker';
import { NotificationMessage } from '../../services/notification-message';

@Component({
  selector: 'app-timer-control',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './timer-control.component.html',
  styleUrl: './timer-control.component.scss'
})
export class TimerControlComponent implements OnInit {

  timerFormat = '';

  isTimerStarted = false;

  timerInSeconds = 30;

  hasPlaySong = false;

  private intervalId: any;

  private contextService = inject(ContextService);
  private audioService = inject(AudioService);

  context = this.contextService.contextSignal$;

  constructor(
    private swPush: SwPush,
    private notificationService: NotificationService
  ) {
    effect(() => {
      this.setTimerSecond();
      this.configTimer();
    });
  }

  ngOnInit(): void {
    this.swPush.messages.subscribe((message) => {
      const NotificationMessage = message as NotificationMessage;
      this.notificationService.showNotificaton('Notificaion', {body: NotificationMessage.body});
    });
  }

  onStartClick(): void {
    this.intervalId = setInterval(() => {
      this.countdown()
    }, 1000);

    this.isTimerStarted = true;
    this.audioService.play('play');
  }

  onPauseClick(): void {
    this.isTimerStarted = false;
    clearInterval(this.intervalId);

    this.audioService.play('pause');
  }

  onChangeContext(context: ContextType): void {
    this.contextService.updateContext(context);
  }

  onToggleMusicClick(): void {
    if (this.hasPlaySong) {
      this.audioService.play('environment');
      return;
    }

    this.audioService.stop('environment');
  }

  private countdown(): void {
    if (this.timerInSeconds <= 0) {
      this.audioService.play('beep');

      this.resetTimer();
      this.setTimerSecond();
      this.configTimer();

      this.sendNotification();
      return;
    }

    this.timerInSeconds -= 1;
    this.configTimer();
  }

  private resetTimer(): void {
    this.isTimerStarted = false;
    clearInterval(this.intervalId);
  }

  private configTimer(): void {
    this.timerFormat = new Date(this.timerInSeconds * 1000)
      .toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
  }

  private setTimerSecond(): void {
    switch (this.context()) {
      case 'foco':
        this.timerInSeconds = 30;
        break;
      case 'descanso-curto':
        this.timerInSeconds = 5;
        break;
      case 'descanso-longo':
        this.timerInSeconds = 15;
        break;
    }
  }

  private async sendNotification() {
    try {
      await this.notificationService.requestPermission();

      const context = this.context();

      if(context.includes('descanso')) {
        this.notificationService.showNotificaton('Notificação', {
          body: 'Tempo de descanso finalizado!'
        });

        return;
      }
      
      this.notificationService.showNotificaton('Notificação', {
          body: 'Tempo de foco finalizado!'
        });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }
}
