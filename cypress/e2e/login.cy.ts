describe('Iniciar Sesión - Login Flow', () => {
  // Caso de prueba 1: Inicio de sesión exitoso con credenciales válidas
  it('should allow a user to log in with valid credentials', () => {
    // Log para verificar la visita a la página
    cy.log('Visiting the login page');
    cy.visit('/iniciar-sesion');
    cy.wait(2000);
    // Log para verificar la entrada de correo
    cy.log('Entering email');
    cy.get('input[name="email"]').type('carlosexequiel360@gmail.com');

    // Log para verificar la entrada de contraseña
    cy.log('Entering password');
    cy.get('input[name="password"]').type('carlosexequiel360@gmail.coM');

    // Esperar a que el botón de submit esté habilitado
    cy.get('ion-button[type="submit"]').should('not.be.disabled');

    // Log para hacer clic en el botón de iniciar sesión
    cy.log('Clicking the submit button');
    cy.get('ion-button[type="submit"]').click();

    // Verificar que la URL haya cambiado y el inicio haya sido exitoso
    cy.url().should('include', '/inicio');
    cy.log('Login successful, URL includes /inicio');
  });

// Caso de prueba 2: Error al iniciar sesión con credenciales incorrectas
it('should show an error message for invalid credentials', () => {
  // Log para verificar la visita a la página
  cy.log('Visiting the login page');
  cy.visit('/iniciar-sesion');

  // Log para verificar la entrada de correo incorrecto
  cy.log('Entering incorrect email');
  cy.get('input[name="email"]').type('correo@incorrecto.com');

  // Log para verificar la entrada de contraseña incorrecta
  cy.log('Entering incorrect password');
  cy.get('input[name="password"]').type('contraseñaerronea');

  // Log para hacer clic en el botón de iniciar sesión
  cy.log('Clicking the submit button');
  cy.get('ion-button[type="submit"]').click();

  // Interceptar la llamada XHR para el login y simular la respuesta 401
  cy.intercept('POST', '/api/users/login', {
    statusCode: 401,
    body: { msg: 'Credenciales incorrectas' }
  }).as('loginRequest');

  // Esperar a que la solicitud de login falle
  cy.wait('@loginRequest');

  // Verificar que la respuesta tenga el código de estado 401 (error de autenticación)
  cy.get('@loginRequest').its('response.statusCode').should('eq', 401);

  // Verificar que el mensaje de error sea el esperado en la respuesta
  cy.get('@loginRequest')
    .its('response.body')
    .should('have.property', 'msg', 'Credenciales incorrectas');

  
});

});