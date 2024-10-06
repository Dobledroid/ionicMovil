import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, NavController } from '@ionic/angular';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';
import { addIcons } from 'ionicons';
import { remove, add, trash }  from 'ionicons/icons';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarritoPage implements OnInit {
  usuario: any;
  carritoProductos: any[] = [];
  isLoading: boolean = true; 
  puedePagar: boolean = true;
  constructor(private http: HttpClient, private sessionService: SessionService,
    private navCtrl: NavController,  private alertController: AlertController
  ) {
    addIcons({remove, add, trash });
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

  ionViewWillEnter() {
    if (this.usuario) {
      this.cargarCarrito(this.usuario.ID_usuario);
    }
  }

  cargarCarrito(ID_usuario: number) {
    const apiUrl = `${environment.apiUrl}/carrito-compras-ID-usuario/${ID_usuario}`;
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        this.carritoProductos = response;
        this.validarExistencias(); 
        console.log('Productos del carrito:', this.carritoProductos);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los productos del carrito:', error);
        this.isLoading = false;
      }
    );
  }

  validarExistencias() {
    this.puedePagar = true; // Suponemos que se puede pagar inicialmente
    this.carritoProductos.forEach((producto) => {
      const apiUrl = `${environment.apiUrl}/products-existencias/${producto.ID_producto}`;
      this.http.get<any>(apiUrl).subscribe(
        (response) => {
          const { existencias } = response;

          if (producto.cantidad > existencias) {
            producto.sinStock = true; // Añadir una propiedad para indicar que hay falta de stock
            this.puedePagar = false; // No se puede proceder al pago si algún producto no tiene suficiente stock

            this.mostrarToast(`El producto "${producto.nombre}" no tiene suficiente stock. Existencias disponibles: ${existencias}.`);

            // Ajustar la cantidad en el carrito a las existencias disponibles
            producto.cantidad = existencias;
          } else {
            producto.sinStock = false; // Producto con suficiente stock
          }
        },
        (error) => {
          console.error(`Error al validar existencias del producto con ID ${producto.ID_producto}:`, error);
        }
      );
    });
  }

  async mostrarToast(message: string) {
    const toast = await this.alertController.create({
      header: 'Advertencia',
      message: message,
      buttons: ['OK'],
    });
    await toast.present();
  }

  aumentarCantidad(producto: any) {
    if (producto.cantidad < producto.existencias) {
      producto.cantidad++;
      this.actualizarCantidadProducto(producto.ID_carrito, producto.cantidad);
      this.validarExistencias(); 
    }
  }
  
  disminuirCantidad(producto: any) {
    if (producto.cantidad > 1) {
      producto.cantidad--;
      this.actualizarCantidadProducto(producto.ID_carrito, producto.cantidad);
      this.validarExistencias();
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
        this.validarExistencias();
      } else {
        console.error('Error al actualizar la cantidad del producto en el carrito:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    }
  }
  
  irAPago() {
    this.navCtrl.navigateForward('/checkout');
  }

  async confirmarEliminarProducto(producto: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de eliminar "${producto.nombre}" del carrito?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarProducto(producto.ID_carrito);
          },
          cssClass: 'alert-danger',
        },
      ],
    });

    await alert.present();
  }

  async eliminarProducto(ID_carrito: number) {
    const apiUrl = `${environment.apiUrl}/carrito-compras/${ID_carrito}`;
    try {
      const response = await this.http.delete(apiUrl).toPromise();
      if (response) {
        this.cargarCarrito(this.usuario.ID_usuario);
      }
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  }

}
