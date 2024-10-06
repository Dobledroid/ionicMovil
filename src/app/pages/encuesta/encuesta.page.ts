import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import lottie from 'lottie-web';
import { IonicModule, ModalController } from '@ionic/angular';
import { EncuestaComponent } from 'src/app/components/encuesta/encuesta.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EncuestaPage implements OnInit {

  constructor(private modalController: ModalController) {}


  ngOnInit() {
  }

  async openEncuestaModal() {
    const modal = await this.modalController.create({
      component: EncuestaComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

}
