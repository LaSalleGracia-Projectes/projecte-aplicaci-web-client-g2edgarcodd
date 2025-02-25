# Proyecto Streamhub

Streamhub es una moderna aplicación web de streaming y descubrimiento de películas y series construida con Next.js, React y Material Tailwind. Ofrece una experiencia de usuario intuitiva y atractiva para explorar contenido multimedia.

## Características

- Diseño moderno y responsive
- Navegación intuitiva con menús desplegables
- Carrusel de películas destacadas
- Visualización de Top 10 películas populares
- Tarjetas de películas interactivas
- Blog de noticias y artículos sobre cine
- Foro de discusión para usuarios
- Búsqueda integrada
- Multiples idiomas (Español, Catalán, Inglés)
- Perfiles de usuario personalizables

## Estructura del Proyecto

```
streamhub/
├── public/
│   └── images/
│       └── placeholder.jpg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── SearchOverlay.jsx
│   │   ├── home/
│   │   │   ├── Hero.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── Top10Slider.jsx
│   │   │   └── SubscriptionForm.jsx
│   │   └── ui/
│   │       ├── LanguageSelector.jsx
│   │       └── ProfileDropdown.jsx
│   ├── pages/
│   │   ├── _app.js
│   │   ├── index.js
│   │   ├── explorar.js
│   │   ├── blog.js
│   │   └── foro.js
│   ├── styles/
│   │   ├── globals.css
│   │   └── Home.module.css
│   ├── hooks/
│   │   └── useSlider.js
│   └── data/
│       └── movies.js
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
└── README.md
```

## Instalación

1. Crea un nuevo proyecto de Next.js:
```bash
npx create-next-app streamhub
cd streamhub
```

2. Instala las dependencias necesarias:
```bash
npm install @material-tailwind/react framer-motion react-icons
```

3. Configura Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Configuración de Tailwind CSS

Edita `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FBC500',
          dark: '#e5aa00',
        },
        background: {
          DEFAULT: '#060D17',
          light: '#30343F',
        },
        text: {
          DEFAULT: '#F6F6F7',
          secondary: '#C6C8CD',
        }
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
      animation: {
        'heart-beat': 'heart-beat 1s ease-in-out 1',
      },
      keyframes: {
        'heart-beat': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}
```

## Estilos Globales

Edita `src/styles/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  padding: 0;
  margin: 0;
  font-family: Lato, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  background-color: #060D17;
  color: #F6F6F7;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
```

## Componentes Principales

### Navegación y Layout

- **Header.jsx**: Barra de navegación principal con elementos desplegables
- **Footer.jsx**: Pie de página con información de copyright
- **SearchOverlay.jsx**: Overlay para búsqueda a pantalla completa

### Componentes de la Página Principal

- **Hero.jsx**: Banner principal con carrusel automático
- **Top10Slider.jsx**: Slider horizontal para mostrar las 10 películas principales
- **MovieCard.jsx**: Tarjeta para mostrar información de películas
- **SubscriptionForm.jsx**: Formulario para suscripción a newsletter

### Componentes de UI

- **LanguageSelector.jsx**: Selector de idioma desplegable
- **ProfileDropdown.jsx**: Menú desplegable para el perfil de usuario

### Hooks Personalizados

- **useSlider.js**: Hook para manejar la funcionalidad de sliders/carruseles

## Páginas

- **_app.js**: Configuración global de la aplicación
- **index.js**: Página principal (home)
- **explorar.js**: Página para explorar/buscar películas
- **blog.js**: Blog con artículos sobre cine y series
- **foro.js**: Foro de discusión para usuarios

## Datos de muestra

- **movies.js**: Datos de muestra para películas/series

## Ejecución del Proyecto

Para ejecutar el proyecto en modo de desarrollo:

```bash
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:3000`.

## Build para Producción

Para generar una versión de producción:

```bash
npm run build
```

Y para iniciar la versión de producción:

```bash
npm start
```

## Características por implementar

- Autenticación de usuarios
- Página de detalles de película/serie
- Sistema de reseñas y valoraciones
- Reproductor de vídeo integrado
- Recomendaciones personalizadas
- Listas personalizadas (favoritos, ver más tarde, etc.)
- Notificaciones para nuevos lanzamientos
- Integración con APIs de películas reales

## Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios
4. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
5. Haz push a la rama (`git push origin feature/amazing-feature`)
6. Abre un Pull Request