<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="https://raw.githubusercontent.com/LaSalleGracia-Projectes/projecte-aplicaci-web-client-g2edgarcodd/refs/heads/main/src/assets/streamhub.png" alt="StreamHub Logo" width="120" height="120">

  <h3 align="center">StreamHub - Plataforma de Agregación de Streaming</h3>

  <p align="center">
    Descubre, explora y gestiona contenido de múltiples plataformas en un solo lugar
    <br />
    <a href="https://github.com/edgarcodd/projecte-aplicaci-web-client-g2edgarcodd"><strong>Explorar documentación »</strong></a>
    <br />
    <a href="https://github.com/edgarcodd/projecte-aplicaci-web-client-g2edgarcodd">Ver Demo</a>
    ·
    <a href="https://github.com/edgarcodd/projecte-aplicaci-web-client-g2edgarcodd/issues/new?labels=bug&template=bug-report---.md">Reportar Bug</a>
    ·
    <a href="https://github.com/edgarcodd/projecte-aplicaci-web-client-g2edgarcodd/issues/new?labels=enhancement&template=feature-request---.md">Solicitar Función</a>
  </p>
</div>

# 🎬 StreamHub - Plataforma de Agregación de Streaming

## 📺 Sobre el Proyecto

[![StreamHub Screen Shot](https://raw.githubusercontent.com/LaSalleGracia-Projectes/projecte-aplicaci-web-client-g2edgarcodd/refs/heads/main/src/assets/scr.png)


StreamHub es una aplicación web moderna desarrollada con React y Vite que permite a los usuarios descubrir, explorar y gestionar contenido de múltiples plataformas de streaming desde un único lugar. La aplicación ofrece una experiencia de usuario intuitiva y visual con un diseño moderno y responsivo.

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Tabla de Contenidos</summary>
  <ol>
    <li>
      <a href="#sobre-el-proyecto">Sobre el Proyecto</a>
      <ul>
        <li><a href="#objetivos-del-proyecto">Objetivos del Proyecto</a></li>
        <li><a href="#características-principales">Características Principales</a></li>
        <li><a href="#tecnologías-utilizadas">Tecnologías Utilizadas</a></li>
      </ul>
    </li>
    <li>
      <a href="#instalación-y-configuración">Instalación y Configuración</a>
      <ul>
        <li><a href="#requisitos-previos">Requisitos Previos</a></li>
        <li><a href="#pasos-de-instalación">Pasos de Instalación</a></li>
        <li><a href="#despliegue">Despliegue</a></li>
      </ul>
    </li>
    <li><a href="#arquitectura">Arquitectura</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#uso">Uso</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contribuyentes">Contribuyentes</a></li>
    <li><a href="#licencia">Licencia</a></li>
    <li><a href="#agradecimientos">Agradecimientos</a></li>
  </ol>
</details>

### 🎯 Objetivos del Proyecto

- Unificar el contenido de diferentes plataformas de streaming en una sola interfaz
- Proporcionar herramientas de búsqueda y descubrimiento de contenido avanzadas
- Ofrecer recomendaciones personalizadas basadas en preferencias del usuario
- Crear una comunidad de usuarios que comparten opiniones sobre películas y series
- Facilitar la decisión de qué ver y dónde verlo

### 🌟 Características Principales

#### 🔎 Exploración de Contenido:

- **Exploración Centralizada:**

  - Búsqueda unificada en múltiples plataformas
  - Filtrado por género, año, valoración y proveedor
  - Visualización en modo cuadrícula o lista
  - Secciones de tendencias y nuevos lanzamientos

- **Detalles de Contenido:**

  - Información detallada de películas y series
  - Enlaces directos a las plataformas correspondientes
  - Visualización de tráileres integrados
  - Información del reparto y equipo técnico

- **Gestión Personal:**
  - Creación de listas personalizadas
  - Favoritos y "Por ver"
  - Historial de visualización
  - Recomendaciones basadas en preferencias

#### 👥 Funcionalidades Sociales:

- **Foro de Discusión:**

  - Creación y participación en temas
  - Categorías por tipo de contenido
  - Sistema de valoraciones y respuestas
  - Tendencias en la comunidad

- **Blog de Contenido:**
  - Artículos sobre cine y televisión
  - Reseñas y análisis de nuevos estrenos
  - Noticias del mundo del streaming
  - Guías y recomendaciones temáticas

#### 🔧 Personalización:

- **Perfil de Usuario:**

  - Estadísticas de visualización
  - Géneros favoritos
  - Personalización de preferencias
  - Gestión de suscripciones

- **Configuración Avanzada:**
  - Selección de idioma (Español, Catalán, Inglés)
  - Integración con APIs externas
  - Notificaciones personalizadas
  - Información meteorológica contextual

### 🛠️ Tecnologías Utilizadas

#### Frontend

- **Librería Principal:**

  - React 19
  - Vite 6
  - React Router 7

- **UI/UX:**

  - CSS personalizado
  - Sistema de componentes modular
  - Diseño responsive
  - Animaciones y transiciones

- **Gestión de Estado:**
  - Context API de React
  - Hooks personalizados
  - Almacenamiento local

#### Servicios e Integraciones

- **APIs:**
  - The Movie Database (TMDB)
  - Servicios de autenticación
  - APIs de proveedores de streaming
  - API de pronóstico del tiempo

#### Internacionalización

- **Soporte Multiidioma:**
  - Español
  - Catalán
  - Inglés
  - Sistema de traducciones personalizado

### Construido Con

[![React][React.js]][React-url]
[![Vite][Vite.js]][Vite-url]
[![React Router][ReactRouter.js]][ReactRouter-url]
[![FontAwesome][FontAwesome.js]][FontAwesome-url]

### 📚 Dependencias Principales

```json
{
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.7.2",
    "@fortawesome/free-brands-svg-icons": "^6.7.2",
    "@fortawesome/free-regular-svg-icons": "^6.7.2",
    "@fortawesome/free-solid-svg-icons": "^6.7.2",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "framer-motion": "^12.9.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-parallax-tilt": "^1.7.293",
    "react-router-dom": "^7.3.0",
    "react-transition-group": "^4.4.5"
  },
  "devDependencies": {
    "@eslint/js": "^9.21.0",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.21.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^15.15.0",
    "vite": "^6.2.0"
  }
}
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18.0 o superior
- npm 9.0 o superior o yarn 1.22 o superior
- Un navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet para acceso a APIs

### Pasos de Instalación

1. **Clonar el Repositorio:**

   ```bash
   git clone https://github.com/edgarcodd/projecte-aplicaci-web-client-g2edgarcodd.git
   cd projecte-aplicaci-web-client-g2edgarcodd
   ```

2. **Instalar Dependencias:**

   ```bash
   npm install
   # o con yarn
   yarn install
   ```

3. **Configurar Variables de Entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto:

   ```
   VITE_API_URL=https://api.example.com
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_WEATHER_API_KEY=your_weather_api_key
   ```

4. **Iniciar el Servidor de Desarrollo:**

   ```bash
   npm run dev
   # o con yarn
   yarn dev
   ```

5. **Compilar para Producción:**
   ```bash
   npm run build
   # o con yarn
   yarn build
   ```

### Despliegue

#### Despliegue del Frontend (React)

1. **Construye la aplicación para producción:**

   ```bash
   npm run build
   ```

2. **Verifica la build localmente:**

   ```bash
   npm run preview
   ```

3. **Despliega en tu hosting preferido:**

   - Para Netlify, GitHub Pages, Vercel: Conecta tu repositorio y configura:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Node version: `18.x` o superior

4. **Configuración de variables de entorno en producción:**
   - Asegúrate de configurar las variables de entorno en tu plataforma de hosting
   - Configura correctamente el CORS en el backend para permitir peticiones desde tu dominio de producción

#### Integración con Backend

- Asegúrate de que las URLs de la API estén configuradas correctamente para el entorno de producción
- Verifica que el backend esté configurado para recibir peticiones desde el dominio donde se despliega el frontend
- Prueba exhaustivamente las funcionalidades que requieren comunicación con el backend

## 🏗️ Arquitectura

### Estructura del Proyecto

```
streamhub/
├── public/                # Archivos estáticos
│   ├── favicon.ico        # Icono del sitio
│   └── robots.txt         # Configuración para rastreadores web
├── src/                   # Código fuente
│   ├── assets/            # Recursos estáticos
│   │   ├── images/        # Imágenes
│   │   ├── logos/         # Logotipos
│   │   └── icons/         # Iconos
│   ├── components/        # Componentes reutilizables
│   │   ├── ui/            # Componentes de interfaz
│   │   ├── layout/        # Componentes de estructura
│   │   └── features/      # Componentes específicos
│   ├── pages/             # Páginas/Vistas
│   │   ├── Home/          # Página de inicio
│   │   ├── Explore/       # Exploración de contenido
│   │   ├── Detail/        # Detalle de contenido
│   │   ├── Profile/       # Perfil de usuario
│   │   └── Forum/         # Foro de discusión
│   ├── context/           # Context API
│   │   ├── AuthContext.jsx       # Contexto de autenticación
│   │   └── ContentContext.jsx     # Contexto de contenido
│   ├── hooks/             # Hooks personalizados
│   ├── services/          # Servicios y API
│   ├── utils/             # Utilidades y helpers
│   ├── i18n/              # Internacionalización
│   ├── App.jsx            # Componente principal
│   └── main.jsx           # Punto de entrada
├── .env.example           # Ejemplo de variables de entorno
├── vite.config.js         # Configuración de Vite
├── package.json           # Dependencias y scripts
└── README.md              # Documentación
```

### Patrones de Diseño Implementados

- **Component Pattern** - Arquitectura basada en componentes reutilizables
- **Context API Pattern** - Gestión de estado global con Context API
- **Custom Hooks Pattern** - Abstracción de lógica reutilizable
- **Compound Components** - Componentes que trabajan juntos
- **Container/Presentational Pattern** - Separación de lógica y presentación

## 🧪 Testing

### Testing Frontend

- Ejecuta tests unitarios con Vitest:
  ```bash
  npm run test
  ```
- Tests de UI con Testing Library:
  ```bash
  npm run test:ui
  ```
- Asegúrate de verificar la compatibilidad en múltiples navegadores.

### Cobertura de Código

- Ejecuta tests con cobertura:
  ```bash
  npm run test:coverage
  ```
- La meta es mantener al menos 70% de cobertura en componentes críticos.

## 📱 Uso

Aquí puedes ver ejemplos útiles de cómo utilizar StreamHub:

- **Búsqueda de contenido**: Utiliza la barra de búsqueda para encontrar películas y series
- **Gestión de listas**: Crea y organiza tus colecciones personales
- **Integración social**: Comparte opiniones y recomendaciones con otros usuarios

Para más ejemplos, consulta la [Documentación completa](https://github.com/edgarcodd/projecte-aplicaci-web-client-g2edgarcodd) o mira el [Video demostrativo](https://example.com)

## 🚧 Roadmap

- [x] Integración con API de TMDB
- [x] Sistema de autenticación de usuarios
- [ ] Integración con proveedores de streaming adicionales
- [ ] Sistema de recomendaciones avanzado
  - [x] Basado en géneros favoritos
  - [ ] Basado en comportamiento de usuarios similares
- [ ] Aplicación móvil complementaria

## 👥 Contribuyentes

- **gr1fox** - _Desarrollador Principal_ - [GitHub](https://github.com/gr1f0x)
- **gr1fox** - _UI/UX Designer_ - [GitHub](https://github.com/gr1f0x)
- **RatWithHat** - _Desarrollador Backend_ - [GitHub](https://github.com/RatWitHat)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 🙏 Agradecimientos

- **Frameworks y Librerías:**
  - React por el framework frontend
  - Vite por la herramienta de construcción
  - FontAwesome por los iconos
- **APIs:**
  - TMDB por los datos de películas y series
  - APIs de streaming por la integración de contenido
- **Inspiración:**
  - JustWatch por el concepto
  - Netflix por la experiencia de usuario
  - Letterboxd por las características sociales
- **Recursos:**
  - [Choose an Open Source License](https://choosealicense.com)
  - [Img Shields](https://shields.io)
  - [GitHub Pages](https://pages.github.com)

---

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/edgarcodd/projecte-aplicaci-web-client-g2edgarcodd.svg?style=for-the-badge
[contributors-url]: https://github.com/edgarcodd/projecte-aplicaci-web-client-g2edgarcodd/graphs/contributors
[license-shield]: https://img.shields.io/github/license/edgarcodd/projecte-aplicaci-web-client-g2edgarcodd.svg?style=for-the-badge
[license-url]: https://github.com/edgarcodd/projecte-aplicaci-web-client-g2edgarcodd/blob/master/LICENSE.txt
[product-screenshot]: ./src/assets/images/screenshot.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vite.js]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[ReactRouter.js]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[ReactRouter-url]: https://reactrouter.com/
[FontAwesome.js]: https://img.shields.io/badge/Font_Awesome-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white
[FontAwesome-url]: https://fontawesome.com/
