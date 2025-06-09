# Conversor XML / JSON / TXT + Cifrado de Tarjetas

Pequeña aplicación full-stack (Express + React) que:
- Convierte archivos **TXT ↔ XML ↔ JSON** manteniendo la estructura de los clientes.
- **Cifra** el número de tarjeta al generar XML/JSON (AES-256-GCM).
- **Descifra** la tarjeta al regenerar TXT.
- Maneja geometrías **GeoJSON** (polígonos) incrustadas en el XML/JSON.

## Tecnologías principales

| Capa | Stack |
|------|-------|
| **Backend** | Node 18, Express, fast-xml-parser, AES-256-GCM (crypto nativo) |
| **Frontend** | React 18 (Create React App), Axios |
| **Intercambio geoespacial** | Especificación **GeoJSON** para polígonos |

## Prerrequisitos

- **Node.js ≥ 18** y npm ≥ 9  
- (Opcional) `openssl` para generar claves de 32 bytes en hex.

## Instalación rápida

```bash
# clona el repo
git clone https://github.com/diegoengelhard/ARI-Proyecto-v2.git

# instala y corre el backend
cd backend && npm install
npm run dev &

# instala frontend
cd frontend && npm install
npm start
