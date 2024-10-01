import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

import { SessionService } from '../../services/session.service';


import { addIcons } from 'ionicons';
import {  }  from 'ionicons/icons';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [CommonModule,
    HeaderComponent, FooterComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InicioPage implements OnInit {
  nombreUsuario: string | null = null;
  sesionActiva: boolean = false;
  constructor(private sessionService: SessionService) {
    addIcons({});
  }

  async ngOnInit() {
    this.sesionActiva = await this.sessionService.isSessionActive();

    if (this.sesionActiva) {
      const userData = await this.sessionService.get('user');
      console.log(userData)
      this.nombreUsuario = userData.correoElectronico;
    }
  }
}
