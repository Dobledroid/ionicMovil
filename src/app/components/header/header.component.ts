import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, cart, car } from 'ionicons/icons';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';

import { HeaderService } from 'src/app/services/header.service';
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, IonicModule, HttpClientModule],
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle: string = '';
  @Input() showBackButton: boolean = false;
  @Input() backButtonHref: string = '';
  totalProductosEnCarrito: number = 0;
  cantidadFavoritos: number = 0;
  totalPrecio: number = 0;

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private sessionService: SessionService,
    private headerService: HeaderService
  ) {
    addIcons({ heart, cart });
  }

  async ngOnInit() {
    this.headerService.totalProductosEnCarrito$.subscribe((total) => {
      this.totalProductosEnCarrito = total;
    });

    this.headerService.cantidadFavoritos$.subscribe((cantidad) => {
      this.cantidadFavoritos = cantidad;
    });

    this.headerService.totalPrecio$.subscribe((total) => {
      this.totalPrecio = total;
    });

    await this.headerService.fetchTotalProductosEnCarrito();
    await this.headerService.fetchCantidadFavoritos();
  }

  abrirCarrito() {
    this.navCtrl.navigateForward('/carrito');
  }

  abrirFavoritos() {
    this.navCtrl.navigateForward('/favoritos');
  }

}
