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

  categorias = [
    { ID_categoria: 1, nombre: 'Suplementos', imagenUrl: 'assets/img/categorias/vitaminas.png' },
    { ID_categoria: 2, nombre: 'Equipo de entrenamiento', imagenUrl: 'assets/img/categorias/pesa.png' },
    { ID_categoria: 3, nombre: 'Ropa deportiva', imagenUrl: 'assets/img/categorias/tienda-de-ropa.png' },
    { ID_categoria: 4, nombre: 'Accesorios', imagenUrl: 'assets/img/categorias/guantes.png' },
  ];

  constructor(private sessionService: SessionService,
    private router: Router, private navCtrl: NavController,
    private http: HttpClient
  ) {
    addIcons({});
  }

  async ngOnInit() {
    this.sesionActiva = await this.sessionService.isSessionActive();

    if (this.sesionActiva) {
      const userData = await this.sessionService.get('user');
      console.log(userData)
      this.nombreUsuario = userData.correoElectronico;
    }

    this.getProducts();
  }

  verCategoria(categoria: any) {
    this.navCtrl.navigateForward(`/productos/${categoria.ID_categoria}`, {
      queryParams: { nombre: categoria.nombre }
    });
  }
  
  getProducts() {
    const apiUrl = `${environment.apiUrl}/list-products-imagenPrincipal-admin`; 

    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        // console.log('Lista de productos:', response);
        this.productos = response.map((producto) => ({
          ...producto,
          nombre: this.normalizeProductName(producto.nombre), 
        }));
        this.productosFiltrados = [...this.productos];
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los productos:', error); 
        this.isLoading = false; 
      }
    );
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
