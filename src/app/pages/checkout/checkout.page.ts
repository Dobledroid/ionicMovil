import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Stripe, PaymentSheetEventsEnum, PaymentSheetResultInterface } from '@capacitor-community/stripe';
import { addIcons } from 'ionicons';
import {  }  from 'ionicons/icons';


import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/services/session.service';
import { EncuestaComponent } from 'src/app/components/encuesta/encuesta.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true, imports: [CommonModule, IonicModule, HttpClientModule, HeaderComponent],
})
export class CheckoutPage implements OnInit {
  user: any = null;
  direccion: any = null;
  productos: any[] = [];
  totalPedido: number = 0;
  puedePagar: boolean = true;
  isLoading: boolean = true;

  constructor(private http: HttpClient, private sessionService: SessionService, 
    private modalController: ModalController,
    private toastController: ToastController) {}

  async ngOnInit() {
    this.user = await this.sessionService.get('user');

    if (this.user) {
      this.fetchDireccionPredeterminada(this.user.ID_usuario);
      this.fetchProductosPedidos(this.user.ID_usuario);
    } else {
      console.error('Usuario no autenticado.');
      this.isLoading = false; 
    }
  }

  fetchDireccionPredeterminada(ID_usuario: number) {
    const apiUrl = `${environment.apiUrl}/direccion-envio-predeterminada-user/${ID_usuario}`;
    this.http.get(apiUrl).subscribe(
      (response) => {
        this.direccion = response;
        this.checkIfLoadingComplete();
      },
      (error) => {
        console.error('Error al cargar la dirección predeterminada:', error);
        this.checkIfLoadingComplete();
      }
    );
  }

  
  fetchProductosPedidos(ID_usuario: number) {
    const apiUrl = `${environment.apiUrl}/carrito-compras-ID-usuario/${ID_usuario}`;
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        this.productos = response;
        this.validarExistencias();
        this.calcularTotalPedido();
        this.checkIfLoadingComplete();
      },
      (error) => {
        console.error('Error al cargar los productos del carrito:', error);
        this.checkIfLoadingComplete();
      }
    );
  }
  
  checkIfLoadingComplete() {
    // Verificar si tanto la dirección como los productos ya fueron cargados
    if (this.direccion !== null && this.productos.length > 0) {
      this.isLoading = false; // Finalizar la carga
    }
  }

  validarExistencias() {
    this.puedePagar = true; // Suponemos que se puede pagar inicialmente
    this.productos.forEach((producto) => {
      const apiUrl = `${environment.apiUrl}/products-existencias/${producto.ID_producto}`;
      this.http.get<any>(apiUrl).subscribe(
        (response) => {
          const { existencias } = response;

          if (producto.cantidad > existencias) {
            producto.sinStock = true; // Añadir una propiedad para indicar que hay falta de stock
            this.puedePagar = false; // No se puede pagar si no hay suficiente stock

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
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'danger',
    });
    await toast.present();
  }

  calcularTotalPedido() {
    this.totalPedido = this.productos.reduce((total, producto) => {
      return total + (producto.precioFinal * producto.cantidad);
    }, 0);
  }


  async presentPaymentSheet() {
    if (!this.puedePagar) {
      return; // Si no se puede pagar, no continuar con el pago
    }
    try {
      // Obtener el clientSecret del backend
      const response: any = await this.http.post(`${environment.apiUrl}/create-payment-intent-ionic`, { amount: this.totalPedido }).toPromise();
  
      if (!response || !response.clientSecret) {
        console.error('No se pudo obtener el clientSecret. Respuesta:', response);
        return;
      }
  
      const clientSecret = response.clientSecret;
  
      // Configurar el Payment Sheet
      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Sport Gym Center',
      });
  
      // Mostrar el Payment Sheet
      const result: any = await Stripe.presentPaymentSheet();
  
      if (result?.paymentResult === PaymentSheetEventsEnum.Completed) {
        console.log('Pago completado exitosamente');
  
        // Llamar al backend para procesar el pedido
        const user = this.user; // Asegúrate de tener el usuario cargado
        const response: any = await this.http.post(`${environment.apiUrl}/process-payment-ionic`, {
          paymentIntentId: clientSecret.split('_secret')[0],
          ID_usuario: user.ID_usuario,
          ID_direccion: this.direccion.ID_direccion,
          amount: this.totalPedido,
        }).toPromise();
        
        if (response && response.success && response.ID_pedido) {
          console.log('Pedido procesado correctamente con ID:', response.ID_pedido);
          await this.presentEncuestaModal(user.ID_usuario, response.ID_pedido);
        } else {
          console.error('Error al procesar el pedido:', response);
        }
      } else {
        console.log('El usuario canceló el pago o hubo un error.');
      }
    } catch (error) {
      console.error('Error al presentar el Payment Sheet:', error);
    }
  }
  
  async presentEncuestaModal(ID_usuario: number, ID_pedido: number) {
    console.log(ID_usuario, ID_pedido, "abrir modal");
    const modal = await this.modalController.create({
      component: EncuestaComponent,
      cssClass: 'custom-modal-class',
      componentProps: {
        ID_usuario: ID_usuario, // Pasar el ID_usuario al modal
        ID_pedido: ID_pedido    // Pasar el ID_pedido al modal
      }
    });
    return await modal.present();
  }
  
}
