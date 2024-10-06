import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, NavController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, IonicModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComprasPage implements OnInit {
  detallesPorPedido: any = {};
  cargando: boolean = true;
  user: any = null;

  constructor(private http: HttpClient, private navCtrl: NavController, private sessionService: SessionService) {}

  async ngOnInit() {
    const userData = await this.sessionService.get('user');
    if (userData){
      this.user = userData;
      this.fetchData(this.user.ID_usuario);
    } else {
      console.error('Usuario no autenticado.');
    }
  }

  fetchData(ID_usuario: number) {
    const apiUrl = `${environment.apiUrl}/detalles-pedido-usuario/${ID_usuario}`;
    this.http.get<any[]>(apiUrl).subscribe(
      (data) => {
        console.log('Datos recibidos:', data);
        
        data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        // Agrupar los detalles por ID_pedido
        const detallesAgrupados: { [key: string]: { detalles: any[], fecha: string } } = {};
        data.forEach((detalle) => {
          const { ID_pedido, precioUnitario, cantidad, fecha } = detalle;
          const total = precioUnitario * cantidad;
          const detalleConTotal = { ...detalle, total };

          if (!detallesAgrupados[ID_pedido]) {
            detallesAgrupados[ID_pedido] = {
              detalles: [],
              fecha // Guardar la fecha del pedido
            };
          }
          detallesAgrupados[ID_pedido].detalles.push(detalleConTotal);
        });

        // Convertir el objeto en un array de pedidos agrupados
        this.detallesPorPedido = Object.keys(detallesAgrupados).map((ID_pedido: string) => ({
          ID_pedido,
          detalles: detallesAgrupados[ID_pedido].detalles,
          fecha: detallesAgrupados[ID_pedido].fecha
        }));

        console.log('Detalles agrupados:', this.detallesPorPedido);
        this.cargando = false;
      },
      (error) => {
        console.error('Error al obtener las compras:', error);
      }
    );
  }

  calcularTotalPedido(detalles: any[]): number {
    return detalles.reduce((total, detalle) => total + detalle.total, 0);
  }
  
  verDetallePedido(ID_pedido: string) {
    this.navCtrl.navigateForward(`/detalle-compra/${ID_pedido}`);
  }
  
}
