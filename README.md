# Sport GYM Center Huejutla - Aplicación Móvil

## Descripción del Proyecto

El proyecto **Sport GYM Center Huejutla** es una aplicación móvil diseñada para mejorar la experiencia de los usuarios del gimnasio mediante una plataforma digital eficiente. La app permite gestionar membresías, realizar pagos, y comprar productos de manera intuitiva y accesible desde dispositivos móviles.

### Objetivos del Proyecto

1. **Optimizar los procesos operativos** del gimnasio.
2. **Facilitar la gestión de pagos** y renovaciones de membresías a los usuarios.
3. **Mejorar la experiencia del cliente** al ofrecer una plataforma móvil accesible y fácil de usar.

### Metodología de Trabajo

El desarrollo de esta aplicación se lleva a cabo bajo la metodología **ágil** mediante iteraciones con entregables continuos, utilizando **SCRUM** para organizar las tareas. Esto nos permite realizar mejoras constantes y ajustarnos a las necesidades del cliente y los usuarios.

---

## Herramienta de Control de Versiones

El proyecto utiliza **Git** como herramienta de control de versiones, alojando el repositorio en **GitHub**. El flujo de trabajo se gestiona a través de la estrategia **Git Flow**, lo que nos permite tener un control riguroso del desarrollo, incluyendo las ramas principales:

- **main**: Contiene la versión estable del código lista para producción.
- **develop**: Rama donde se integran las nuevas características antes de pasar a producción.

### Flujo de Trabajo

1. Crear una rama `feature/nueva-caracteristica` para añadir nuevas funcionalidades.
2. Una vez terminada la implementación, realizar un **Pull Request** hacia la rama `develop`.
3. Al estar listo para el despliegue, se crea una rama `release/versión` y finalmente se fusiona con `main`.

---

## Estrategia de Versionamiento y Gestión de Ramas

Para el control de versiones se sigue el esquema de **Versionamiento Semántico** (SemVer), que se compone de tres valores:

- **MAJOR**: Cambios que introducen incompatibilidad con versiones anteriores.
- **MINOR**: Nuevas funcionalidades añadidas de forma retrocompatible.
- **PATCH**: Corrección de errores sin afectar la compatibilidad existente.

El flujo de ramas sigue la estructura propuesta por **Git Flow**, donde cada nuevo cambio es desarrollado en ramas `feature/`, probado en `develop`, y finalmente fusionado en `main` para el despliegue.

---

## Estrategia de Despliegue y Entornos

### Entornos de Despliegue

1. **Entorno de Desarrollo**:
    - Uso de emuladores y simuladores para Android e iOS.
    - CI/CD con **GitHub Actions** que automatiza el proceso de testing y generación de builds.

2. **Entorno de Producción**:
    - Despliegue en **Google Play Store** para Android y en la **App Store** para iOS.
    - Las builds finales para producción se generan utilizando **Expo** y son subidas a las tiendas oficiales.

### Proceso de CI/CD

- Cada commit en la rama `develop` dispara un pipeline de integración continua que ejecuta pruebas unitarias y de integración.
- Cuando se realiza un merge a la rama `main`, se genera automáticamente una build para ser desplegada en producción.

---

## Instrucciones de Instalación y Ejecución

### 1. Clonar el Repositorio

Para clonar el proyecto desde GitHub, usa el siguiente comando:

```bash
git clone https://github.com/usuario/proyecto-app-movil.git
cd proyecto-app-movil


