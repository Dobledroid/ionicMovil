// describe('Agregar producto al carrito', () => {
//   beforeEach(() => {
//     // Visitar la página de inicio de sesión
//     cy.visit('http://localhost:8100/iniciar-sesion');

//     // Completar el formulario de login
//     cy.get('input[name="email"]').type('carlosexequiel360@gmail.com');
//     cy.get('input[name="password"]').type('carlosexequiel360@gmail.coM');
//     cy.get('ion-button[type="submit"]').click();
//   });

//   it('Debería redirigir a /inicio y luego a /ver-producto/3', () => {
//     // Verificar que el login fue exitoso y redirige a /inicio
//     cy.url().should('include', '/inicio');

//     // Ahora redirigir manualmente a /ver-producto/3 (simulando navegación a la página de producto)
//     cy.visit('/ver-producto/3');

//     // Interceptar la solicitud POST al backend
//     cy.intercept('POST', '**/api/carrito-compras').as('addToCart');

//     // Verificar que el botón de agregar al carrito está visible
//     cy.get('ion-button.add-to-cart-button').should('be.visible');

//     // Hacer clic en el botón de agregar al carrito
//     cy.get('ion-button.add-to-cart-button').click();

//     // Esperar a que la solicitud POST se complete
//     cy.wait('@addToCart', { timeout: 10000 })  // Aumenta el timeout si es necesario
//     .then((interception) => {
//       // Depurar la interceptación
//       console.log('Solicitud interceptada:', interception);
//     });

//     // Verificar que el producto fue agregado al carrito
//     cy.get('ion-toast').should(
//       'contain.text',
//       'Producto agregado al carrito con éxito'
//     );
//   });
// });
