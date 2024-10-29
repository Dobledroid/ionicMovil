import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule, HeaderComponent]
})
export class ProductosPage implements OnInit {
  productos: any[] = [];
  isLoading: boolean = true;
  nombreCategoria: string = '';
  productosFiltrados: any[] = [];
  valorBusqueda: string = '';


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    const categoriaId = this.route.snapshot.paramMap.get('ID_categoria');
    this.nombreCategoria = this.route.snapshot.queryParamMap.get('nombre') || 'Productos';
    console.log('ID de la categoría seleccionada:', categoriaId);
    if (categoriaId) {
      this.getProductosPorCategoria(categoriaId);
    }
  }

  getProductosPorCategoria(categoriaId: string) {
    // const apiUrl = `${environment.apiUrl}/list-products-by-category-ionic/${categoriaId}`;
    const apiUrl = `http://localhost:4000/api/list-products-by-category-ionic/${categoriaId}`;
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        console.log('Productos de la categoría:', response);
        this.productos = response;
        this.productosFiltrados = [...this.productos];
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los productos de la categoría:', error);
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
    this.navCtrl.navigateForward(`/ver-producto/${producto.ID_producto}`, {
      queryParams: {
        previousUrl: this.router.url // La ruta actual
      }
    });
  }
  
}
