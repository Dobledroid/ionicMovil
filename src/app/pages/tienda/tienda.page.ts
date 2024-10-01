import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.page.html',
  styleUrls: ['./tienda.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule]
})
export class TiendaPage implements OnInit {

  productos: any[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient,
    private router: Router, private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    const apiUrl = `${environment.apiUrl}/list-products-imagenPrincipal-admin`; 

    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        console.log('Lista de productos:', response);
        this.productos = response.map((producto) => ({
          ...producto,
          nombre: this.normalizeProductName(producto.nombre), 
        }));
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

  verProducto(producto: any) {
    this.navCtrl.navigateForward(`/ver-producto/${producto.ID_producto}`);
  }
  
  
}
