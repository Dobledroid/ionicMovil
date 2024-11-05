import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionService } from './session.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  constructor(private http: HttpClient, private sessionService: SessionService) {}

  private totalProductosEnCarritoSubject = new BehaviorSubject<number>(0);
  private cantidadFavoritosSubject = new BehaviorSubject<number>(0);
  private totalPrecioSubject = new BehaviorSubject<number>(0);

  // Observables para que otros componentes puedan suscribirse
  totalProductosEnCarrito$ = this.totalProductosEnCarritoSubject.asObservable();
  cantidadFavoritos$ = this.cantidadFavoritosSubject.asObservable();
  totalPrecio$ = this.totalPrecioSubject.asObservable();

  // Métodos para actualizar los valores
  setTotalProductosEnCarrito(total: number) {
    this.totalProductosEnCarritoSubject.next(total);
  }

  setCantidadFavoritos(cantidad: number) {
    this.cantidadFavoritosSubject.next(cantidad);
  }

  setTotalPrecio(total: number) {
    this.totalPrecioSubject.next(total);
  }


  async fetchTotalProductosEnCarrito() {
    try {
      const user = await this.sessionService.get('user');
      const userId = user?.ID_usuario || null;
      if (userId) {
        const response = await this.http
          .get<{ totalProductosEnCarrito: number; totalPrecio: number }>(
            `${environment.apiUrl}/carrito-compras-total-usuario/${userId}`
          )
          .toPromise();
        console.log("response header ", response)
        if (response) {
          this.setTotalProductosEnCarrito(response.totalProductosEnCarrito);
          this.setTotalPrecio(response.totalPrecio);
        } else {
          console.error('Error al obtener la cantidad total de productos en el carrito');
        }
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  }

  async fetchCantidadFavoritos() {
    try {
      const user = await this.sessionService.get('user');
      const userId = user?.ID_usuario || null;
      if (userId) {
        const response = await this.http
          .get<{ cantidad: number }>(`${environment.apiUrl}/favoritos-cantidad/${userId}`)
          .toPromise();

        if (response) {
          this.setCantidadFavoritos(response.cantidad);
        } else {
          console.error('Error al obtener la cantidad de favoritos');
        }
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  }
  

}
