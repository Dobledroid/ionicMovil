describe('Registro - Registro de usuario', () => {
  it('should allow a user to register with valid data', () => {
    // Log para verificar la visita a la página
    cy.log('Visiting the registration page');
    cy.visit('/registro');

    // Log para verificar la entrada del nombre
    cy.log('Entering name');
    cy.get('input[name="nombre"]').type('Carlos');

    // Log para verificar la entrada del apellido paterno
    cy.log('Entering last name');
    cy.get('input[name="apellidoPaterno"]').type('Exequiel');

    // Log para verificar la entrada del apellido materno
    cy.log('Entering mother last name');
    cy.get('input[name="apellidoMaterno"]').type('Ramirez');

    // Log para verificar la entrada del correo electrónico
    cy.log('Entering email');
    cy.get('input[name="correoElectronico"]').type('correo@valido.com');

    // Log para verificar la entrada de la contraseña
    cy.log('Entering password');
    cy.get('input[name="contrasenia"]').type('ContraseñaValida123@');

    // Log para verificar la confirmación de la contraseña
    cy.log('Confirming password');
    cy.get('input[name="confirmarContrasenia"]').type('ContraseñaValida123@');

    // Log para verificar la aceptación de los términos y condiciones
    cy.log('Accepting terms');
    cy.get('ion-checkbox[name="aceptaTerminos"]').click();

    // Log para hacer clic en el botón de crear cuenta
    cy.log('Clicking the create account button');
    cy.get('ion-button[type="submit"]').click();

    // Interceptar la solicitud de registro y simular la respuesta exitosa
    cy.intercept('POST', '/api/users/register', {
      statusCode: 200,
      body: { msg: 'Cuenta creada con éxito' },
    }).as('registerRequest');

    // Hacer clic en el botón de "Crear Cuenta"
    cy.get('ion-button[type="submit"]').click();

    cy.wait(2000); // Espera adicional si es necesario
    cy.url().should('include', '/iniciar-sesion');

  });

});
