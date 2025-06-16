
# Conversor XML / JSON / TXT + Cifrado de Tarjetas

Pequeña aplicación **full-stack** (Express + React) que facilita la conversión de datos entre distintos formatos, garantizando la seguridad de la información sensible y el manejo de datos geoespaciales bajo estándares abiertos.

---

## ️✨ Características principales

| Funcionalidad | Descripción |
|---------------|-------------|
| **Conversión de formatos** | Transformación bidireccional **TXT ↔ XML ↔ JSON**, preservando la estructura de los clientes. |
| **Cifrado de datos sensibles** | Algoritmo **AES-256-GCM**: cifra automáticamente el número de tarjeta al convertir a XML/JSON y lo descifra al volver a TXT. |
| **Soporte geoespacial** | Procesa polígonos y puntos de ubicación, convirtiéndolos a **GeoJSON** para máxima compatibilidad con SIG. |

---

## 🛠️ Tecnologías principales

| Capa | Stack |
|------|-------|
| **Backend** | Node 18, Express, fast-xml-parser, AES-256-GCM (`crypto` nativo) |
| **Frontend** | React 18 (Create React App), Axios |
| **Intercambio geoespacial** | Especificación **GeoJSON** para polígonos y puntos |

---

## 📋 Prerrequisitos

- **Node.js ≥ 18** y **npm ≥ 9**  
- (Opcional) `openssl` para generar claves de 32 bytes en hex:  
  ```bash
  openssl rand -hex 32   # genera clave AES-256

# 1. Clona el repositorio
```bash
git clone https://github.com/diegoengelhard/ARI-Proyecto-v2.git
cd ARI-Proyecto-v2
```

# 2. Instala y ejecuta el backend
```bash
cd backend-v2
npm install
npm run dev &          # servidor en segundo plano (http://localhost:3000)
```

# 3. Instala y ejecuta el frontend
```bash
cd ../frontend
npm install
npm start              # abre http://localhost:4000
```
