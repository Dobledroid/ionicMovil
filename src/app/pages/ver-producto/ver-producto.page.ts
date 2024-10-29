import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  arrowForward,
  closeCircle,
  arrowBackOutline,
  remove,
  add,
  chevronDownOutline,
  heart,
  heartOutline,
} from 'ionicons/icons';

import * as moment from 'moment';
import 'moment/locale/es';
import { SessionService } from 'src/app/services/session.service';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from 'src/app/components/star-rating/star-rating.component';
import { CurrencyService } from 'src/app/services/currency.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-ver-producto',
  templateUrl: './ver-producto.page.html',
  styleUrls: ['./ver-producto.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    HeaderComponent,
    FormsModule,
    StarRatingComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VerProductoPage implements OnInit {
  producto: any;
  usuario: any;
  galleryImages: any[] = [];
  selectedImage: string = '';
  currentIndex: number = 0;
  startX: number = 0;
  zoomLevel: number = 1;
  isLoading: boolean = true;
  idCarrito: number = 0;
  productoId: string = '';
  productoEnCarrito: boolean = false;
  cantidad: number = 1;
  rutaAnterior: string = '';
  previousUrl: string = '';
  calificacion: number = 0;
  selectedSegment: string = 'descripcion';
  isTitleExpanded: boolean = false;

  resenas: any[] = [];
  comentario: string = '';
  isFavorite: boolean = false;
  idFavorito: number | null = null;
  sinStock: boolean = false;

  currency: string = 'MXN';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private navCtrl: NavController,
    private sessionService: SessionService,
    private router: Router,
    private toastController: ToastController,
    private currencyService: CurrencyService,
    private headerService: HeaderService
  ) {
    addIcons({
      arrowBack,
      arrowForward,
      closeCircle,
      arrowBackOutline,
      remove,
      add,
      chevronDownOutline,
      heart,
      heartOutline,
    });
  }

  async ngOnInit() {
    await this.obtenerUbicacionUsuario();
    this.route.queryParams.subscribe((params) => {
      const fullPreviousUrl = params['previousUrl'] || '/inicio';
      this.previousUrl = fullPreviousUrl.split('?')[0];
      // console.log('Ruta previa:', this.previousUrl);
    });

    const user = await this.sessionService.get('user');
    if (user) {
      this.usuario = user;
    }

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.getProductDetails(productId);
      this.obtenerResenas(productId);
      if (user) {
        this.checkProductInCart(productId);
        this.checkIfFavorite(user.ID_usuario, productId);
      }
    }
  }

  async obtenerUbicacionUsuario() {
    try {
      const response: any = await this.http
        .get('http://ip-api.com/json')
        .toPromise();
      // console.log('Ubicación del usuario:', response);

      if (response && response.countryCode) {
        this.currency = response.countryCode === 'MX' ? 'MXN' : 'USD';
      }
    } catch (error) {
      console.error('Error al obtener la ubicación del usuario:', error);
    }
  }

  toggleTitle() {
    this.isTitleExpanded = !this.isTitleExpanded;
  }

  onSegmentChange(event: any) {
    this.selectedSegment = event.detail.value;
  }

  formatDescription(description: string): string {
    if (!description) {
      return '';
    }

    // Reemplazar saltos de línea (\r\n) por <br> para que se muestren como saltos de línea
    let formattedDescription = description.replace(/\r\n/g, '<br>');

    // Reemplazar ciertos textos para agregar listas de viñetas
    formattedDescription = formattedDescription.replace(/•/g, '<li>');

    // Si tienes una lista de viñetas, envuélvelas en <ul></ul>
    formattedDescription = formattedDescription.replace(
      /(<li>.*?<\/li>)/g,
      '<ul>$1</ul>'
    );

    return formattedDescription;
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
              console.error(
                'Error al obtener la cantidad del producto en el carrito:',
                error
              );
            }
          );
        } else {
          this.productoEnCarrito = false;
          this.cantidad = 1;
        }
      },
      (error) => {
        console.error(
          'Error al verificar si el producto existe en el carrito:',
          error
        );
      }
    );
  }

  getProductDetails(id: string) {
    this.isLoading = true;
    const apiUrl = `${environment.apiUrl}/products-with-imagensIonic/${id}`;

    this.http.get<any>(apiUrl).subscribe(
      async (response) => {
        this.producto = response;
        // console.log('Detalles del producto:', this.producto);
        if (this.producto && this.producto.descripcion) {
          this.producto.descripcionFormateada = this.formatDescription(
            this.producto.descripcion
          );
        }
        this.productoId = this.producto.ID_producto;
        this.galleryImages = this.producto.imagenes.map(
          (imagenUrl: string) => ({
            src: imagenUrl,
            alt: this.producto.nombre,
          })
        );
        if (this.currency === 'USD') {
          this.producto.precioConvertido = await this.convertirPrecio(
            this.producto.precioFinal
          );
        } else {
          this.producto.precioConvertido = this.producto.precioFinal;
        }
        this.selectedImage = this.galleryImages[0]?.src;
        this.sinStock = this.producto.existencias <= 0;
        this.isLoading = false;
        // console.log('Imágenes del producto:', this.galleryImages);
      },
      (error) => {
        console.error('Error al obtener los detalles del producto:', error);
        this.isLoading = false;
      }
    );
  }

  async convertirPrecio(precioMXN: number): Promise<number> {
    try {
      return await this.currencyService.convertCurrency(
        'MXN',
        'USD',
        precioMXN
      );
    } catch (error) {
      console.error('Error al convertir moneda:', error);
      return precioMXN; // Retornar el precio original si falla la conversión
    }
  }

  obtenerResenas(id: string) {
    this.http
      .get(`${environment.apiUrl}/resenas/${id}`)
      .subscribe((response: any) => {
        this.resenas = response;
      });
  }

  async enviarResena() {
    const user = await this.sessionService.get('user');

    if (!user) {
      const toast = await this.toastController.create({
        message: 'Por favor, inicia sesión para dejar una reseña.',
        duration: 3000,
        position: 'top',
        buttons: [
          {
            text: 'Iniciar sesión',
            handler: () => {
              this.navCtrl.navigateForward('/iniciar-sesion'); 
            },
          },
          {
            text: 'Registrarse',
            handler: () => {
              this.navCtrl.navigateForward('/registrarse'); 
            },
          },
        ],
      });
      await toast.present();
      return;
    }

    if (!this.comentario || this.comentario.trim() === '') {
      const toast = await this.toastController.create({
        message: 'Por favor, escribe un comentario antes de enviarlo.',
        duration: 3000,
        position: 'top',
      });
      await toast.present();
      return;
    }

    // Validar si hay una calificación
    if (this.calificacion === 0) {
      const toast = await this.toastController.create({
        message:
          'Por favor, selecciona una calificación antes de enviar la reseña.',
        duration: 3000,
        position: 'top',
      });
      await toast.present();
      return;
    }

    const nuevaResena = {
      ID_usuario: user.ID_usuario,
      ID_producto: this.producto.ID_producto,
      comentario: this.comentario,
      calificacion: this.calificacion,
    };

    try {
      const response = await this.http
        .post(`${environment.apiUrl}/resenas`, nuevaResena)
        .toPromise();

      if (response) {
        const successToast = await this.toastController.create({
          message: 'Reseña enviada con éxito',
          duration: 3000,
          position: 'top',
          color: 'success',
        });
        await successToast.present();
        this.comentario = '';
        this.calificacion = 0;
        // Actualizar la lista de reseñas
        // console.log('id mandando', this.productoId);
        this.obtenerResenas(this.productoId);
      } else {
        const errorToast = await this.toastController.create({
          message: 'Hubo un error al enviar la reseña',
          duration: 3000,
          position: 'top',
          color: 'danger',
        });
        await errorToast.present();
      }
    } catch (error) {
      const networkErrorToast = await this.toastController.create({
        message: 'Error de red al enviar la reseña',
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
      await networkErrorToast.present();
    }
  }

  onRatingChange(newRating: number) {
    this.calificacion = newRating;
  }
  formatearFecha(fecha: string): string {
    return moment(fecha).locale('es').format('D MMM YYYY'); // Ejemplo: 2 oct 2024
  }
  goBack() {
    this.navCtrl.back();
  }

  openLightbox(imageUrl: string) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById(
      'lightbox-image'
    ) as HTMLImageElement;

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
    const lightboxImage = document.getElementById(
      'lightbox-image'
    ) as HTMLImageElement;

    if (lightbox) {
      lightbox.style.display = 'none';

      // Remover el evento de zoom cuando se cierra el lightbox
      lightboxImage.removeEventListener('wheel', this.handleZoom.bind(this));
    }
  }

  handleZoom(event: WheelEvent) {
    event.preventDefault();
    const lightboxImage = document.getElementById(
      'lightbox-image'
    ) as HTMLImageElement;

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
    if (!this.usuario) {
      this.navCtrl.navigateRoot('/iniciar-sesion');
      return;
    }

    const apiUrlExiste = `${environment.apiUrl}/carrito-compras-existe-prod/${this.usuario.ID_usuario}/${this.producto.ID_producto}`;

    this.http.get<any>(apiUrlExiste).subscribe(
      async (response) => {
        // console.log('response', response);
        if (response && response.existeRegistro === false) {
          this.agregarProductoCarrito(
            this.usuario.ID_usuario,
            this.producto.ID_producto,
            this.cantidad
          );
          this.productoEnCarrito = true;
        } else if (response && response.existeRegistro === true) {
          this.actualizarCantidadProducto(
            response.ID_carrito,
            response.cantidad + this.cantidad
          );
        }
      },
      (error) => {
        console.error(
          'Error al verificar si el producto existe en el carrito:',
          error
        );
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const successToast = await this.toastController.create({
          message: 'Cantidad del producto actualizada con éxito.',
          duration: 3000,
          position: 'top',
          color: 'success',
        });
        await successToast.present();
      } else {
        const errorToast = await this.toastController.create({
          message:
            'Hubo un error al actualizar la cantidad del producto en el carrito.',
          duration: 3000,
          position: 'top',
          color: 'danger',
        });
        await errorToast.present();
      }
      await this.headerService.fetchTotalProductosEnCarrito();
    } catch (error) {
      console.error(
        'Error al actualizar la cantidad del producto en el carrito:',
        error
      );
      const networkErrorToast = await this.toastController.create({
        message:
          'Error de red al actualizar la cantidad del producto en el carrito.',
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
      await networkErrorToast.present();
    }
  }

  async agregarProductoCarrito(
    ID_usuario: number,
    ID_producto: number,
    cantidad: number
  ) {
    // console.log(ID_usuario, ID_producto, cantidad);
    const apiUrl = `${environment.apiUrl}/carrito-compras`;
    const body = {
      ID_usuario: ID_usuario,
      ID_producto: ID_producto,
      cantidad: cantidad,
    };

    this.http.post(apiUrl, body).subscribe(
      async (response) => {
        const successToast = await this.toastController.create({
          message: 'Producto agregado al carrito con éxito.',
          duration: 3000,
          position: 'top',
          color: 'success',
        });
        await successToast.present();
        await this.headerService.fetchTotalProductosEnCarrito();
      },

      async (error) => {
        console.error('Error al agregar el producto al carrito:', error);
        const errorToast = await this.toastController.create({
          message: 'Hubo un error al agregar el producto al carrito.',
          duration: 3000,
          position: 'top',
          color: 'danger',
        });
        await errorToast.present();
      }
    );
  }

  disminuirCantidadPr() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  aumentarCantidadPr() {
    if (this.cantidad < this.producto?.existencias) {
      this.cantidad++;
    }
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

  async checkIfFavorite(userId: number, productId: string) {
    try {
      const response = await fetch(
        `${environment.apiUrl}/favoritos/${userId}/${productId}`
      );
      if (response.ok) {
        const data = await response.json();
        this.idFavorito = data.ID_favorito;
        this.isFavorite = data.isFavorito;
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  }

  async toggleFavorite() {
    if (!this.usuario) {
      const toast = await this.toastController.create({
        message:
          'Por favor, inicia sesión para agregar productos a tus favoritos.',
        duration: 3000,
        position: 'top',
        buttons: [
          {
            text: 'Iniciar sesión',
            handler: () => {
              this.navCtrl.navigateForward('/iniciar-sesion');
            },
          },
        ],
      });
      await toast.present();
      return;
    }

    try {
      if (this.isFavorite) {
        // Eliminar de favoritos
        const deleteResponse = await fetch(
          `${environment.apiUrl}/favorito/${this.idFavorito}`,
          {
            method: 'DELETE',
          }
        );

        if (deleteResponse.ok) {
          this.isFavorite = false;
          const toast = await this.toastController.create({
            message: 'Producto eliminado de favoritos',
            duration: 3000,
            position: 'top',
            color: 'danger',
          });
          await toast.present();
        } else {
          console.error('Error al eliminar el producto de favoritos');
        }
      } else {
        // Agregar a favoritos
        const addResponse = await fetch(`${environment.apiUrl}/favoritos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ID_usuario: this.usuario.ID_usuario,
            ID_producto: parseInt(this.productoId, 10),
          }),
        });

        if (addResponse.ok) {
          const data = await addResponse.json();
          this.idFavorito = data.ID_favorito;
          this.isFavorite = true;
          const toast = await this.toastController.create({
            message: 'Producto agregado a favoritos',
            duration: 3000,
            position: 'top',
            color: 'success',
          });
          await toast.present();
        } else {
          console.error('Error al agregar el producto a favoritos');
        }
      }
      await this.headerService.fetchCantidadFavoritos();
    } catch (error) {
      console.error('Error de red:', error);
    }
  }
}
