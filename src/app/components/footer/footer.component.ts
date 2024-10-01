import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonIcon, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, homeOutline, car, storefrontOutline }  from 'ionicons/icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule, RouterLink, IonRouterLink
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FooterComponent  implements OnInit {

  constructor() {
    addIcons({ personCircleOutline, homeOutline, car, storefrontOutline });

   }

  ngOnInit() {}
}
