import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack, arrowForward, closeCircle, arrowBackOutline, remove, add }  from 'ionicons/icons';
import { SessionService } from 'src/app/services/session.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ver-producto',
  templateUrl: './ver-producto.page.html',
  styleUrls: ['./ver-producto.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class VerProductoPage implements OnInit  {
  producto: any;
  usuario: any;
  galleryImages: any[] = [];
  selectedImage: string = '';
  currentIndex: number = 0;
  startX: number = 0;
  zoomLevel: number = 1;
  isLoading: boolean = true; 
  idCarrito: number = 0;
  productoEnCarrito: boolean = false;
  cantidad: number = 1;
  

  constructor(private route: ActivatedRoute, private http: HttpClient,
    private navCtrl: NavController, private sessionService: SessionService,
  ) {
    addIcons({ arrowBack, arrowForward, closeCircle, arrowBackOutline, remove, add });
  }

  async ngOnInit() {
    const user = await this.sessionService.get('user');
    if (user) {
      this.usuario = user;
    }

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.getProductDetails(productId);
      this.checkProductInCart(productId);
    } else {
      console.error('No se proporcionó un ID de producto válido.');
    }

  }

  checkProductInCart(productId: string) {
    const apiUrlExiste = `${environment.apiUrl}/carrito-compras-existe-prod/${this.usuario.ID_usuario}/${productId}`;
    this.http.get<any>(apiUrlExiste).subscribe(
      (response) => {
        if (response.existeRegistro) {
          this.productoEnCarrito = true;
          const apiUrlCarrito = `${environment.apiUrl}/carrito-compras/${response.ID_carrito}`;
          this.http.get<any>(apiUrlCarrito).subscribe(
            (carritoResponse) => {
              this.idCarrito = carritoResponse.ID_carrito;
              this.cantidad = carritoResponse.cantidad;
            },
            (error) => {
              console.error('Error al obtener la cantidad del producto en el carrito:', error);
            }
          );
        } else {
          this.productoEnCarrito = false;
          this.cantidad = 1;
        }
      },
      (error) => {
        console.error('Error al verificar si el producto existe en el carrito:', error);
      }
    );
  }

  
  getProductDetails(id: string) {
    this.isLoading = true;
    const apiUrl = `${environment.apiUrl}/products-with-imagensIonic/${id}`;

    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        this.producto = response;
        // console.log('Detalles del producto:', this.producto);

        // Asignar las imágenes al arreglo de la galería
        this.galleryImages = this.producto.imagenes.map((imagenUrl: string) => ({
          src: imagenUrl,
          alt: this.producto.nombre
        }));
        this.selectedImage = this.galleryImages[0]?.src;
        this.isLoading = false;
        // console.log('Imágenes del producto:', this.galleryImages);
      },
      (error) => {
        console.error('Error al obtener los detalles del producto:', error);
        this.isLoading = false;
      }
    );
  }

  goBack() {
    this.navCtrl.back();
  }

  openLightbox(imageUrl: string) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
  
    if (lightbox && lightboxImage) {
      lightboxImage.src = imageUrl;
      lightbox.style.display = 'flex';
      this.zoomLevel = 1; // Resetear el nivel de zoom al abrir la imagen
      lightboxImage.style.transform = `scale(${this.zoomLevel})`;
  
      // Añadir evento para el zoom con la rueda del ratón
      lightboxImage.addEventListener('wheel', this.handleZoom.bind(this));
    }
  }
  
  closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
  
    if (lightbox) {
      lightbox.style.display = 'none';
  
      // Remover el evento de zoom cuando se cierra el lightbox
      lightboxImage.removeEventListener('wheel', this.handleZoom.bind(this));
    }
  }
  
  handleZoom(event: WheelEvent) {
    event.preventDefault();
    const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
  
    if (lightboxImage) {
      // Ajustar el nivel de zoom
      this.zoomLevel += event.deltaY * -0.001;
  
      // Limitar el zoom mínimo y máximo
      this.zoomLevel = Math.min(Math.max(this.zoomLevel, 1), 3);
  
      // Aplicar el zoom a la imagen
      lightboxImage.style.transform = `scale(${this.zoomLevel})`;
    }
  }
  
  
  
  selectImage(imageUrl: string, index: number) {
    this.selectedImage = imageUrl;
    this.currentIndex = index;
  }
  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0].clientX;
    const diffX = this.startX - endX;

    // Si el usuario desliza hacia la izquierda, mostrar la siguiente imagen
    if (diffX > 50) {
      this.nextImage();
    }
    // Si el usuario desliza hacia la derecha, mostrar la imagen anterior
    else if (diffX < -50) {
      this.prevImage();
    }
  }

  nextImage() {
    if (this.currentIndex < this.galleryImages.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Si está en la última imagen, volver a la primera
    }
    this.selectedImage = this.galleryImages[this.currentIndex].src;
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.galleryImages.length - 1; // Si está en la primera imagen, ir a la última
    }
    this.selectedImage = this.galleryImages[this.currentIndex].src;
  }
  

  async agregarAlCarrito() {
    // Obtener datos del usuario del storage
    if (!this.usuario) {
      // Redirigir a iniciar sesión si el usuario no está autenticado
      this.navCtrl.navigateRoot('/iniciar-sesion');
      return;
    }
  
    // Endpoint para validar si el producto ya está en el carrito
    const apiUrlExiste = `${environment.apiUrl}/carrito-compras-existe-prod/${this.usuario.ID_usuario}/${this.producto.ID_producto}`;
  
    this.http.get<any>(apiUrlExiste).subscribe(
      (response) => {
        if (response && response.length === 0) {
          this.agregarProductoCarrito(this.usuario.ID_usuario, this.producto.ID_producto, 1);
          this.productoEnCarrito = true;
        }
      },
      (error) => {
        console.error('Error al verificar si el producto existe en el carrito:', error);
      }
    );
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
      } else {
        console.error('Error al actualizar la cantidad del producto en el carrito:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    }
  }
  
  agregarProductoCarrito(ID_usuario: number, ID_producto: number, cantidad: number) {
    const apiUrl = `${environment.apiUrl}/carrito-compras`;
    const body = {
      ID_usuario: ID_usuario,
      ID_producto: ID_producto,
      cantidad: cantidad
    };
  
    this.http.post(apiUrl, body).subscribe(
      (response) => {
        console.log('Producto agregado al carrito:', response);
      },
      (error) => {
        console.error('Error al agregar el producto al carrito:', error);
      }
    );
  }

  aumentarCantidad() {
    if (this.cantidad < this.producto.existencias) {
      this.cantidad++;
      this.actualizarCantidadProducto(this.idCarrito, this.cantidad);
    }
  }
  
  disminuirCantidad() {
    if (this.cantidad > 1) {
      this.cantidad--;
      this.actualizarCantidadProducto(this.idCarrito, this.cantidad);
    }
  }
  irAlCarrito() {
    this.navCtrl.navigateForward('/carrito');
  }
  

}
