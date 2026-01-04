# 🇹🇭 NVT - Nuestro Viaje a Tailandia

Aplicación web geoespacial para planificar y explorar lugares en Tailandia. Construida con React, Leaflet.js y Dexie.js para funcionalidad offline.

**🌐 Live Demo:** https://nv-tailandia.vercel.app/

## ✨ Características

- **Mapa Interactivo**: Visualización con Google Maps tiles y marcadores personalizados con iconos representativos
- **Sincronización Inteligente**: La lista filtra automáticamente lugares visibles en el mapa
- **Base de Datos Offline**: 36 puntos turísticos precargados con Dexie.js (IndexedDB)
- **Búsqueda Avanzada**: Busca lugares o añade nuevos usando Nominatim API
- **Gestión Completa**: Agrega, elimina y restaura lugares
- **Diseño Profesional**: Tarjetas con imágenes reales de Pexels e información detallada
- **Calculadora de Baht**: Acceso directo a conversión de moneda
- **Tooltips Informativos**: Explicación de abreviaturas de transporte

## 🚀 Instalación Local

### Requisitos
- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clona o crea el proyecto**
```bash
# Si usas GitHub Codespaces, el repositorio ya está listo
# Si trabajas local:
git clone <tu-repo>
cd nvt-tailandia
```

2. **Instala dependencias**
```bash
npm install
```

3. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

4. **Abre en el navegador**
```
http://localhost:5173
```

## 📦 Deploy en Vercel

### Opción 1: Desde GitHub

1. **Push tu código a GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Conecta con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "Add New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente Vite
   - Haz clic en "Deploy"

### Opción 2: Desde Vercel CLI

```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel

# Para producción
vercel --prod
```

### Opción 3: Desde GitHub Codespaces

```bash
# Construye el proyecto
npm run build

# Instala Vercel CLI
npm i -g vercel

# Deploy directo
vercel --prod
```

## 🛠️ Estructura del Proyecto

```
nvt-tailandia/
├── index.html              # HTML principal con Leaflet CSS
├── package.json            # Dependencias del proyecto
├── vite.config.js          # Configuración de Vite
├── src/
│   ├── main.jsx           # Punto de entrada React
│   ├── App.jsx            # Componente principal
│   ├── App.css            # Estilos globales
│   ├── db/
│   │   └── database.js    # Configuración Dexie.js
│   ├── data/
│   │   └── initialPlaces.js  # 36 lugares precargados
│   ├── components/
│   │   ├── Map.jsx        # Componente mapa Leaflet
│   │   ├── Sidebar.jsx    # Barra lateral con lista
│   │   ├── PlaceCard.jsx  # Tarjeta de lugar
│   │   └── SearchBar.jsx  # Búsqueda y controles
│   └── utils/
│       └── nominatim.js   # API de geolocalización
```

## 🎨 Características Técnicas

### Marcadores Personalizados
Cada lugar tiene su propio icono representativo:
- 🏯 Gran Palacio
- 🛕 Wat Pho
- ⛩️ Wat Arun
- 🏮 Chinatown
- 🍻 Khao San Road
- 🏝️ Railay Beach
- 🐘 Elephant Nature Park
- 💆 Spas
- 🏨 Hoteles
- Y muchos más...

### Información en Tarjetas
- Icono visual representativo
- Imagen de alta calidad (Pexels)
- Nombre del lugar
- Descripción breve
- ⏱️ Tiempo de visita sugerido
- 🚇 Transporte recomendado (con tooltip explicativo)
- 👔 Código de vestimenta
- 💰 Precio de entrada
- 🌸 Disponibilidad de masajes

### Transportes Explicados
Pasa el mouse sobre los iconos de transporte para ver más información:
- **BTS**: Skytrain (tren elevado)
- **MRT**: Metro subterráneo
- **Barco**: Barco Express del río Chao Phraya
- **Grab**: Aplicación de taxi (como Uber)
- **Scooter**: Moto rentada
- **Tour**: Tour organizado con transporte incluido

### Base de Datos
- **36 lugares iniciales** distribuidos en:
  - Bangkok (11 lugares)
  - Chiang Mai (5 lugares)
  - Chiang Rai (3 lugares)
  - Kanchanaburi (4 lugares)
  - Ayutthaya (1 lugar)
  - Mercados (2 lugares)
  - Koh Samui (4 lugares)
  - Krabi (2 lugares)
  - Phuket (2 lugares)

## 📝 Uso

### Búsqueda
1. Escribe en el campo de búsqueda para filtrar lugares
2. Presiona **Enter** para buscar nuevas ubicaciones en el mapa de Tailandia
3. Haz clic en **"Guardar Lugar"** para añadirlo a tu viaje

### Navegación
- Haz zoom y desplaza el mapa
- La lista se actualiza automáticamente mostrando solo lugares visibles
- Haz clic en una tarjeta para centrar el mapa en ese lugar

### Gestión
- **Eliminar**: Botón 🗑️ en cada tarjeta
- **Reset**: Restaura los 36 lugares originales

## 🔧 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Preview del build
```

## 🌐 Tecnologías

- **React 18** - UI Framework
- **Vite** - Build tool
- **Leaflet.js** - Mapas interactivos
- **Dexie.js** - Base de datos IndexedDB
- **Nominatim API** - Geocodificación
- **Unsplash** - Imágenes de lugares
- **Google Maps Tiles** - Mapas base

## 📄 Licencia

Este proyecto es privado y de uso personal.

## 👨‍💻 Desarrollado por

Senior React Developer especializado en aplicaciones geoespaciales.

---

¡Disfruta planeando tu viaje a Tailandia! 🏝️✈️