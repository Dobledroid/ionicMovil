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
      const result: any = await Stripe.presentPaymentSheet();
  
      if (result?.paymentResult === PaymentSheetEventsEnum.Completed) {
        console.log('Pago completado exitosamente');
      } else if (result?.paymentResult === PaymentSheetEventsEnum.Canceled) {
        console.log('El usuario canceló el pago');
      } else {
        console.error('Pago fallido o no completado');
      }
    } catch (error) {
      console.error('Error al presentar el Payment Sheet:', error);
    }
  }
  

}
