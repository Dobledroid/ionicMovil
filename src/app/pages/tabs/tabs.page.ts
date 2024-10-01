import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { IonicModule, IonLabel } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { personCircleOutline, homeOutline, cartOutline, storefrontOutline }  from 'ionicons/icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule,
    RouterModule
   ]
})
export class TabsPage implements OnInit {

  constructor() { 
    addIcons({ personCircleOutline, homeOutline, cartOutline, storefrontOutline });

  }

  ngOnInit() {
  }

}
