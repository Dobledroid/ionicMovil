import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { addIcons } from 'ionicons';
import { closeCircleOutline, informationCircleOutline } from 'ionicons/icons';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detalles-compras',
  templateUrl: './detalles-compras.page.html',
  styleUrls: ['./detalles-compras.page.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, IonicModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetallesComprasPage implements OnInit {
  detallesPedido: any = null;
  cargando: boolean = true;
  ID_pedido: number = 0;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    addIcons({
      informationCircleOutline,
      closeCircleOutline
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.ID_pedido = idParam ? parseInt(idParam, 10) : 0;
    if (this.ID_pedido > 0) {
      this.fetchDetallesPedido(this.ID_pedido);
    } else {
      console.error('ID de pedido inválido');
    }
  }

  fetchDetallesPedido(ID_pedido: number) {
    const apiUrl = `${environment.apiUrl}/orden-pedido-detalle-pedido-ionic/${ID_pedido}`;
    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        console.log('Detalles del pedido:', data);
        this.detallesPedido = data;
        
        this.cargando = false;
      },
      (error) => {
        console.error('Error al obtener los detalles del pedido:', error);
        this.cargando = false;
      }
    );
  }

}
