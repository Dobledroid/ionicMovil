import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./pages/inicio/inicio.page').then(m => m.InicioPage),
      },
      {
        path: 'tienda',
        loadComponent: () => import('./pages/tienda/tienda.page').then(m => m.TiendaPage),
      },
      {
        path: 'carrito',
        loadComponent: () => import('./pages/carrito/carrito.page').then(m => m.CarritoPage),
      },
      
      {
        path: 'cuenta',
        loadComponent: () => import('./pages/cuenta/cuenta.page').then( m => m.CuentaPage)
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'iniciar-sesion',
    loadComponent: () => import('./pages/iniciar-sesion/iniciar-sesion.page').then(m => m.IniciarSesionPage),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage),
  },
  {
    path: 'ver-producto/:id',
    loadComponent: () => import('./pages/ver-producto/ver-producto.page').then( m => m.VerProductoPage)
  },
  {
    path: 'pago',
    loadComponent: () => import('./pages/pago/pago.page').then( m => m.PagoPage)
  },
  {
    path: 'productos/:ID_categoria',
    loadComponent: () => import('./pages/productos/productos.page').then( m => m.ProductosPage)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.page').then( m => m.CheckoutPage)
  },
  {
    path: 'agregardireccion',
    loadComponent: () => import('./pages/direcciones/agregardireccion/agregardireccion.page').then( m => m.AgregardireccionPage)
  },
  {
    path: 'direcciones',
    loadComponent: () => import('./pages/direcciones/direcciones/direcciones.page').then( m => m.DireccionesPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
  },
  {
    path: 'compras',
    loadComponent: () => import('./pages/compras/compras.page').then( m => m.ComprasPage)
  },
  {
    path: 'detalle-compra/:id',
    loadComponent: () => import('./pages/compras/detalles-compras/detalles-compras.page').then( m => m.DetallesComprasPage)
  },
  {
    path: 'cambiarcontrasenia',
    loadComponent: () => import('./pages/cambiarcontrasenia/cambiarcontrasenia.page').then( m => m.CambiarcontraseniaPage)
  },
  {
    path: 'recuperacion',
    loadComponent: () => import('./pages/recuperacion/recuperacion/recuperacion.page').then( m => m.RecuperacionPage)
  },
  {
    path: 'token',
    loadComponent: () => import('./pages/recuperacion/token/token.page').then( m => m.TokenPage)
  },
  {
    path: 'reseteo',
    loadComponent: () => import('./pages/recuperacion/reseteo/reseteo.page').then( m => m.ReseteoPage)
  },
  {
    path: 'encuesta',
    loadComponent: () => import('./pages/encuesta/encuesta.page').then( m => m.EncuestaPage)
  },
  {
    path: '**',
    redirectTo: '',
  },
];
