import { Component, OnInit } from '@angular/core';
import { UpdateService } from './shared/services/update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(
    private updateService: UpdateService
  ) {

  }

  async ngOnInit() {
    const hasUpdate = await this.updateService.checkForUpdate();

    if(hasUpdate) {
      console.log('Atualização encontrada durante a inicialização')
    }
  }
}
