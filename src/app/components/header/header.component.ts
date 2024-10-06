import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, cart, car } from 'ionicons/icons';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';

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
    private sessionService: SessionService
  ) {
    addIcons({ heart, cart });
  }

  async ngOnInit() {
    await this.fetchTotalProductosEnCarrito();
    await this.fetchCantidadFavoritos();
  }

  abrirCarrito() {
    this.navCtrl.navigateForward('/carrito');
  }

  abrirFavoritos() {
    this.navCtrl.navigateForward('/favoritos');
  }

  async fetchTotalProductosEnCarrito() {
    try {
      // Recuperar el ID del usuario del Storage
      const user = await this.sessionService.get('user');
      const userId = user?.ID_usuario || null; // Colocar null si no existe

      if (userId) {
        const response = await this.http
          .get<{ totalProductosEnCarrito: number; totalPrecio: number }>(
            `${environment.apiUrl}/carrito-compras-total-usuario/${userId}`
          )
          .toPromise();

        if (response) {
          this.totalProductosEnCarrito = response.totalProductosEnCarrito;
          this.totalPrecio = response.totalPrecio;
          // console.log('total, ', this.totalProductosEnCarrito);
        } else {
          console.error(
            'Error al obtener la cantidad total de productos en el carrito'
          );
        }
      } else {
        // console.log('Usuario no autenticado, no se puede obtener el total de productos en el carrito.');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  }

  async fetchCantidadFavoritos() {
    try {
      // Recuperar el ID del usuario del Storage
      const user = await this.sessionService.get('user');
      const userId = user?.ID_usuario || null; // Colocar null si no existe

      if (userId) {
        const response = await this.http
          .get<{ cantidad: number }>(
            `${environment.apiUrl}/favoritos-cantidad/${userId}`
          )
          .toPromise();

        if (response) {
          this.cantidadFavoritos = response.cantidad;
          // console.log('cantidadF, ', this.cantidadFavoritos);
        } else {
          console.error('Error al obtener la cantidad de favoritos');
        }
      } else {
        
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  }
}
