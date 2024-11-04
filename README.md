# App Delivery

## Introducción

App Delivery es una aplicación diseñada para optimizar el proceso de recepción de pedidos y mejorar la experiencia del cliente. 
Ofrece a los usuarios realizar pedidos directamente al comercio sin depender de apps de marketplace, 
esto permite reducir costos de comisión y centralizar el control del negocio. La aplicación es sencilla e intuitiva, ofreciendo comodidad 
tanto para los usuarios como para los administradores del restaurante y los repartidores.

## Características

- **Clientes**:
    - Selección de productos desde un menú organizado en categorías.
    - Carrito de compras para agregar múltiples productos.
    - Seguimiento en tiempo real de la ubicación del repartidor.
    - Interfaz simple para el primer registro de clientes.

- **Administradores de restaurantes**:
    - Gestión centralizada de los pedidos recibidos.
    - Notificaciones en tiempo real sobre nuevos pedidos.
    - Asignación de repartidores a los pedidos.
    - Creación y gestión de categoras y productos en el menú.

- **Repartidores**:
    - Notificaciones de nuevos pedidos asignados.
    - Visualización de la ubicación del cliente en un mapa.
    - Posibilidad de llamar al cliente en caso de dificultades con la entrega.

## Stack Tecnológico

- **Lenguaje de programación**: Kotlin
- **Backend**: Node.js
- **Gestor de base de datos**: PostgreSQL
- **Almacenamiento de imágenes**: Firebase Storage
- **APIs**: Google Maps API para geolocalización, Retrofit para interacción con API RESTful
- **Notificaciones**: Firebase Cloud Messaging

## Integraciones y Funcionalidades

- **Integración App Kotlin con Backend Node.js**: Comunicación eficiente entre la app y el servidor.
- **Login y Registro con JWT (JSON Web Tokens)**: Autenticación segura de los usuarios.
- **Manejo de datos en tiempo real con Socket.IO**: Actualización en vivo de pedidos y asignaciones.
- **Notificaciones Push con Firebase Cloud Messaging**: Envío de notificaciones a múltiples usuarios.
- **Almacenamiento en la nube con Firebase Storage**: Gestión de imágenes de productos.
- **Geolocalización con Google Maps API**: Rastreo de la ubicación de los repartidores.
- **Peticiones HTTP con Retrofit**: Comunicación fluida con APIs RESTful.
- **Relación de datos con bases de datos SQL**: Gestión estructurada de la información.

## Requisitos del Sistema

- **Entorno de Desarrollo**: Android Studio Koala o superior
- **SDK de Android**: Versión 23 o superior
- **Versión de Kotlin**: 1.9.0 o superior




