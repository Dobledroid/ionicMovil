import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Stripe, PaymentSheetEventsEnum, PaymentSheetResultInterface } from '@capacitor-community/stripe';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule]
})
export class PagoPage implements OnInit {

  constructor(private http:HttpClient) { 
   
  }

  ngOnInit() {
  }

  

  async presentPaymentSheet() {
    try {
      console.log('Iniciando el proceso de obtencion del clientSecret...');
      // Hacer una solicitud al backend para obtener el clientSecret
      const response: any = await this.http.post('https://api44.vercel.app/api/create-payment-intent-ionic', {}).toPromise();
      
      if (!response || !response.clientSecret) {
        console.error('No se pudo obtener el clientSecret. Respuesta:', response);
        return;
      }
  
      const clientSecret = response.clientSecret;
      console.log('clientSecret obtenido:', clientSecret);
  
      // Configurar el Payment Sheet de Stripe
      console.log('Configurando el Payment Sheet con el clientSecret...');
      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Tu Nombre de Comercio'
      });
      console.log('Payment Sheet configurado correctamente.');
  
      // Mostrar el Payment Sheet
      console.log('Mostrando el Payment Sheet...');
      const result: any = await Stripe.presentPaymentSheet();
  
      console.log('Resultado del Payment Sheet:', result);
  
      if (result?.paymentResult === PaymentSheetEventsEnum.Completed) {
        console.log('Pago completado exitosamente');
      } else if (result?.paymentResult === PaymentSheetEventsEnum.Canceled) {
        console.log('El usuario canceló el pago');
      } else {
        console.error('Pago fallido o no completado. Resultado:', result);
      }
    } catch (error) {
      console.error('Error al presentar el Payment Sheet:', error);
    }
  }
  
}
