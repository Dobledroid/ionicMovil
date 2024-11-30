import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { addIcons } from 'ionicons';
import {  }  from 'ionicons/icons';
import { Router } from '@angular/router';

import { SessionService } from '../../services/session.service';
import { environment } from 'src/environments/environment';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [CommonModule,
    HeaderComponent, FooterComponent, HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InicioPage implements OnInit {
  nombreUsuario: string | null = null;
  sesionActiva: boolean = false;

  productos: any[] = [];
  productosFiltrados: any[] = [];
  valorBusqueda: string = '';
  isLoading: boolean = true;
  currency: string = 'MXN'; 

  private componentActive = true; 

  categorias = [
    { ID_categoria: 1, nombre: 'Suplementos', imagenUrl: 'assets/img/categorias/vitaminas.png' },
    { ID_categoria: 2, nombre: 'Equipo de entrenamiento', imagenUrl: 'assets/img/categorias/pesa.png' },
    { ID_categoria: 3, nombre: 'Ropa deportiva', imagenUrl: 'assets/img/categorias/tienda-de-ropa.png' },
    { ID_categoria: 4, nombre: 'Accesorios', imagenUrl: 'assets/img/categorias/guantes.png' },
  ];

  constructor(private sessionService: SessionService,
    private router: Router, private navCtrl: NavController,
    private http: HttpClient,
    private currencyService: CurrencyService,
  ) {
    addIcons({});
  }

  async ngOnInit() {
    this.sesionActiva = await this.sessionService.isSessionActive();

    if (this.sesionActiva) {
      const userData = await this.sessionService.get('user');
      // console.log(userData)
      this.nombreUsuario = userData.correoElectronico;
    }
    await this.obtenerUbicacionUsuario();
    this.getProducts();

  }

  ngOnDestroy() {
    this.componentActive = false;  // Marcar como inactivo al destruir el componente
  }

  async obtenerUbicacionUsuario() {
    try {
      const response: any = await this.http.get('http://ip-api.com/json').toPromise();
      // console.log('Ubicación del usuario:', response);

      if (this.componentActive && response && response.countryCode) {  // Solo realizar si el componente está activo
        this.currency = response.countryCode === 'MX' ? 'MXN' : 'USD';
      }
    } catch (error) {
      if (this.componentActive) {  // Solo realizar si el componente está activo
        console.error('Error al obtener la ubicación del usuario:', error);
      }
    }
  }

  verCategoria(categoria: any) {
    this.navCtrl.navigateForward(`/productos/${categoria.ID_categoria}`, {
      queryParams: { nombre: categoria.nombre }
    });
  }
  
  getProducts() {
    const apiUrl = `${environment.apiUrl}/list-products-imagenPrincipal-admin`; 

    this.http.get<any[]>(apiUrl).subscribe(
      async (response) => {
        if (!this.componentActive) return;
        // console.log('Lista de productos:', response);
        // console.log(this.currency)
        for (const producto of response) {
          producto.nombre = this.normalizeProductName(producto.nombre);
          if (this.currency === 'USD') {
            producto.precioConvertido = await this.convertirPrecio(producto.precioFinal);
          } else {
            producto.precioConvertido = producto.precioFinal; // Usar precio en MXN si aplica
          }
        }
        this.productos = response;
        this.productosFiltrados = [...this.productos];
        console.log("prueba karma", this.productosFiltrados)
        this.isLoading = false;
      },
      (error) => {
        if (this.componentActive) {  // Solo realizar si el componente está activo
          console.error('Error al obtener los productos:', error);
          this.isLoading = false; 
        }
      }
    );
  }

  async convertirPrecio(precioMXN: number): Promise<number> {
    try {
      return await this.currencyService.convertCurrency('MXN', 'USD', precioMXN);
    } catch (error) {
      console.error('Error al convertir moneda:', error);
      return precioMXN; // Si hay error, mostrar el precio en MXN
    }
  }

  normalizeProductName(name: string): string {
    // Define palabras innecesarias que se deben eliminar
    const stopWords = [
      'Suplemento en polvo', 'Gold Standard', '100%', 'sabor',
      'en pote de', 'Lb', 'Libras', 'gr', 'kg', 'Contenido', 'Hydrolized',
      'Optimum', 'Nutrition', 'Todos los Sabores', 'PLATINUM', 'producto', 'marcas'
    ];
  
    // Eliminar las palabras innecesarias del nombre del producto
    let normalized = name;
    stopWords.forEach((word) => {
      const regex = new RegExp(word, 'gi');
      normalized = normalized.replace(regex, '');
    });
  
    // Eliminar los espacios adicionales
    normalized = normalized.replace(/\s+/g, ' ').trim();
  
    // Dividir el nombre normalizado en palabras
    const words = normalized.split(' ');
  
    // Seleccionar solo las primeras 3 palabras significativas
    const limitedWords = words.slice(0, 3).join(' ');
  
    return limitedWords;
  }


  buscarProducto(event: any) {
    const valor = event.target.value.toLowerCase();
  
    if (valor && valor.trim() !== '') {
      this.productosFiltrados = this.productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(valor)
      );
    } else {
      this.productosFiltrados = [...this.productos];
    }
  }
  
  verProducto(producto: any) {
    this.navCtrl.navigateForward(`/ver-producto/${producto.ID_producto}`);
  }
  
}
