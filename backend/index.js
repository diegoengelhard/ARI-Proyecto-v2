/* backend/index.js */
const express = require('express');
const cors    = require('cors');
const conversionRoutes = require('./routes/conversionRoutes');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

//  ⬇⬇⬇  MONTA TUS RUTAS  ⬇⬇⬇
app.use('/api', conversionRoutes);

//  ─────────────────────────────────────────────────────────
//  Ahora sí: inspeccionamos una vez que Express ya tiene router
//  (lo hacemos dentro del listen para no romper el arranque)
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);

  // Mostrar rutas registradas
  app._router.stack
    .filter(r => r.route && r.route.path)
    .forEach(r => console.log(
      Object.keys(r.route.methods)[0].toUpperCase().padEnd(6),
      r.route.path
    ));
});
