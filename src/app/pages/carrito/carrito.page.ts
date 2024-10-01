import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';
import { addIcons } from 'ionicons';
import { remove, add }  from 'ionicons/icons';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarritoPage implements OnInit {
  usuario: any;
  carritoProductos: any[] = [];
  isLoading: boolean = true; 

  constructor(private http: HttpClient, private sessionService: SessionService) {
    addIcons({remove, add});
  }


  async ngOnInit() {
    this.usuario = await this.sessionService.get('user');
    if (this.usuario) {
      this.cargarCarrito(this.usuario.ID_usuario);
    } else {
      console.error('Usuario no autenticado.');
      this.isLoading = false;
    }
  }

  cargarCarrito(ID_usuario: number) {
    const apiUrl = `${environment.apiUrl}/carrito-compras-ID-usuario/${ID_usuario}`;
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        this.carritoProductos = response;
        console.log('Productos del carrito:', this.carritoProductos);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los productos del carrito:', error);
        this.isLoading = false;
      }
    );
  }


  aumentarCantidad(producto: any) {
    if (producto.cantidad < producto.existencias) {
      producto.cantidad++;
      this.actualizarCantidadProducto(producto.ID_carrito, producto.cantidad);
    }
  }
  
  disminuirCantidad(producto: any) {
    if (producto.cantidad > 1) {
      producto.cantidad--;
      this.actualizarCantidadProducto(producto.ID_carrito, producto.cantidad);
    }
  }
  
  async actualizarCantidadProducto(ID_carrito: number, cantidad: number) {
    const apiUrl = `${environment.apiUrl}/carrito-compras/${ID_carrito}`;
    const body = { cantidad };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
  
      if (response.ok) {
        console.log('Cantidad del producto actualizada en el carrito:', await response.json());
        // Mostrar una alerta indicando que el producto se ha actualizado
      } else {
        console.error('Error al actualizar la cantidad del producto en el carrito:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    }
  }
  

}
