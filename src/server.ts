import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';

const app = express();
const prisma = new PrismaClient();

// Puerto y URL base (local o Render)
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;


// CORS para permitir frontend local y en producción
const allowedOrigins = [
  'http://localhost:5173',
  'https://h2aqua.com.mx',
];

app.use(cors({
  origin: (origin, callback) => {
    // Peticiones sin origin (ej. pruebas internas) se permiten
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));


// Middleware JSON
app.use(express.json());

// Servir carpeta de uploads de forma estática
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Configuración de Multer para guardar imágenes en /uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Ruta simple de prueba
app.get("/", (req, res) => {
  res.send("API del spa facial funcionando");
});

// ---------- CLIENTES ----------

// Crear un nuevo cliente
app.post("/clientes", async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;

    if (!nombre || !email) {
      return res
        .status(400)
        .json({ error: "nombre y email son obligatorios" });
    }

    const nuevoCliente = await prisma.cliente.create({
      data: {
        nombre,
        email,
        telefono,
      },
    });

    res.status(201).json(nuevoCliente);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Ya existe un cliente con ese email" });
    }
    res.status(500).json({ error: "Error al crear cliente" });
  }
});

// Listar todos los clientes
app.get("/clientes", async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { fechaRegistro: "desc" },
    });
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
});

// ---------- SERVICIOS ----------

// Crear un nuevo servicio
app.post("/servicios", async (req, res) => {
  try {
    const { nombre, descripcion, duracionMinutos, precio } = req.body;

    if (!nombre || !duracionMinutos || !precio) {
      return res.status(400).json({
        error: "nombre, duracionMinutos y precio son obligatorios",
      });
    }

    const servicio = await prisma.servicio.create({
      data: {
        nombre,
        descripcion,
        duracionMinutos,
        precio,
      },
    });

    res.status(201).json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear servicio" });
  }
});

// Listar todos los servicios
app.get("/servicios", async (req, res) => {
  try {
    const servicios = await prisma.servicio.findMany({
      orderBy: { nombre: "asc" },
    });
    res.json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener servicios" });
  }
});

// ---------- SUBIDA DE IMÁGENES ----------


app.post('/upload-imagen', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió ningún archivo' });
  }

  const url = `${BASE_URL}/uploads/${req.file.filename}`;
  res.json({ url });
});

// ---------- PRODUCTOS ----------

// Crear un nuevo producto
// Crear un nuevo producto
app.post("/productos", async (req, res) => {
  try {
    console.log('BODY /productos:', req.body);

    const {
      nombre,
      descripcion,
      precio,
      stock,
      imagenUrl,
      categoria, // 'ITEM' | 'TERAPIA'
      seccion,   // número de sección en la tienda (1-4)
      destacado, // boolean
    } = req.body;

    if (!nombre || !precio) {
      return res
        .status(400)
        .json({ error: "nombre y precio son obligatorios" });
    }

    if (!categoria) {
      return res
        .status(400)
        .json({ error: "categoria es obligatoria (ITEM o TERAPIA)" });
    }

    const producto = await prisma.producto.create({
      data: {
        nombre,
        descripcion,
        precio,
        stock: stock ?? 0,
        imagenUrl,
        categoria,
        estado: "ACTIVO",
        seccion: seccion ?? 1,
        destacado: destacado ?? false,
      },
    });

    res.status(201).json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear producto" });
  }
});


// Listar todos los productos
app.get("/productos", async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { nombre: "asc" },
    });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Actualizar datos de un producto
app.patch("/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagenUrl, categoria, seccion, destacado } = req.body;

    const data: Record<string, any> = {};
    if (nombre !== undefined)      data.nombre      = nombre;
    if (descripcion !== undefined) data.descripcion = descripcion;
    if (precio !== undefined)      data.precio      = Number(precio);
    if (stock !== undefined)       data.stock       = Number(stock);
    if (imagenUrl !== undefined)   data.imagenUrl   = imagenUrl;
    if (categoria !== undefined)   data.categoria   = categoria;
    if (seccion !== undefined)     data.seccion     = Number(seccion);
    if (destacado !== undefined)   data.destacado   = Boolean(destacado);

    const producto = await prisma.producto.update({
      where: { id: Number(id) },
      data,
    });

    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// Eliminar TODOS los productos
app.delete("/productos", async (_req, res) => {
  try {
    await prisma.pedidoProducto.deleteMany();
    await prisma.producto.deleteMany();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar todos los productos" });
  }
});

// Eliminar un producto (solo una vez)
app.delete("/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.producto.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

// Actualizar estado de un producto (ACTIVO / AGOTADO / INACTIVO)
app.patch("/productos/:id/estado", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // "ACTIVO" | "AGOTADO" | "INACTIVO"

    if (!estado) {
      return res.status(400).json({ error: "estado es obligatorio" });
    }

    const producto = await prisma.producto.update({
      where: { id: Number(id) },
      data: { estado },
    });

    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar estado de producto" });
  }
});

// Productos visibles en la tienda (ACTIVO y AGOTADO)
app.get("/productos-tienda", async (_req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      where: {
        estado: { in: ["ACTIVO", "AGOTADO"] }, // INACTIVO no se muestra
      },
      orderBy: { nombre: "asc" },
    });

    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos para tienda" });
  }
});

// Productos destacados para el carrusel de la tienda
app.get("/productos-destacados", async (_req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      where: {
        destacado: true,
        estado: { in: ["ACTIVO", "AGOTADO"] },
      },
      orderBy: { nombre: "asc" },
    });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos destacados" });
  }
});

// ---------- CITAS ----------

// Crear una nueva cita
app.post("/citas", async (req, res) => {
  try {
    const { fechaHora, servicioId, notas, estado } = req.body;

    if (!fechaHora) {
      return res.status(400).json({
        error: "fechaHora es obligatoria",
      });
    }

    // por ahora usamos clienteId fijo (1) y servicioId fijo (1)
    const cita = await prisma.cita.create({
      data: {
        fechaHora: new Date(fechaHora),
        cliente: {
          connect: { id: 1 },      // Cliente genérico
        },
        servicio: {
          connect: { id: 1 },      // Servicio genérico de hidrógeno
        },
        notas,
        estado, // "PENDIENTE" por default si no mandas
      },
    });

    res.status(201).json(cita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear cita" });
  }
});


// Terapias disponibles para citas (productos con categoria TERAPIA)
app.get("/terapias-disponibles", async (_req, res) => {
  try {
    const terapias = await prisma.producto.findMany({
      where: {
        categoria: 'TERAPIA',
        estado: { in: ['ACTIVO', 'AGOTADO'] },
      },
      orderBy: { nombre: 'asc' },
    });
    res.json(terapias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener terapias disponibles" });
  }
});

// Listar todas las citas
app.get("/citas", async (req, res) => {
  try {
    const citas = await prisma.cita.findMany({
      orderBy: { fechaHora: "asc" },
      include: {
        cliente: true,
        servicio: true,
      },
    });
    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener citas" });
  }
});

// Actualizar solo el estado de una cita
app.patch("/citas/:id/estado", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // "PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"

    if (!estado) {
      return res.status(400).json({ error: "estado es obligatorio" });
    }

    const cita = await prisma.cita.update({
      where: { id: Number(id) },
      data: { estado },
    });

    res.json(cita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar estado de la cita" });
  }
});

// ---------- PEDIDOS (TIENDA) ----------

// Crear un nuevo pedido
app.post("/pedidos", async (req, res) => {
  try {
    const { clienteId, items } = req.body;
    // items: [{ productoId: number, cantidad: number }]

    if (!clienteId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "clienteId e items (con productoId y cantidad) son obligatorios",
      });
    }

    // Obtener precios actuales de los productos
    const productosIds = items.map((it: any) => it.productoId);
    const productos = await prisma.producto.findMany({
      where: { id: { in: productosIds } },
    });

    // Armar items con precioUnit y calcular total
    let total = 0;
    const itemsConPrecio = items.map((it: any) => {
      const prod = productos.find((p) => p.id === it.productoId);
      if (!prod) {
        throw new Error(`Producto no encontrado: ${it.productoId}`);
      }
      const precioUnit = prod.precio;
      total += precioUnit * it.cantidad;
      return {
        cantidad: it.cantidad,
        precioUnit,
        productoId: it.productoId,
      };
    });

    const pedido = await prisma.pedido.create({
      data: {
        clienteId,
        total,
        estado: "PENDIENTE",
        items: {
          create: itemsConPrecio,
        },
      },
      include: {
        cliente: true,
        items: {
          include: { producto: true },
        },
      },
    });

    res.status(201).json(pedido);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al crear pedido" });
  }
});

// Listar todos los pedidos
app.get("/pedidos", async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { fecha: "desc" },
      include: {
        cliente: true,
        items: {
          include: { producto: true },
        },
      },
    });
    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
});

// ─── Checkout: registrar cliente + pedido ────────────────────────────────────
// items: [{ productoId: number, cantidad: number }]  (gift cards excluded)
app.post("/checkout", async (req, res) => {
  try {
    const { nombre, email, telefono, direccion, items } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({ error: "nombre y email son obligatorios" });
    }

    // Find-or-create cliente
    let cliente = await prisma.cliente.findUnique({ where: { email } });
    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: { nombre, email, telefono: telefono || null, direccion: direccion || null },
      });
    } else {
      // Update info in case it changed
      cliente = await prisma.cliente.update({
        where: { email },
        data: { nombre, telefono: telefono || cliente.telefono, direccion: direccion || cliente.direccion },
      });
    }

    // Create pedido only if there are real product items
    let pedido = null;
    const productItems: { productoId: number; cantidad: number }[] =
      Array.isArray(items) ? items.filter((i: any) => i.productoId > 0) : [];

    if (productItems.length > 0) {
      const productosIds = productItems.map((it) => it.productoId);
      const productos = await prisma.producto.findMany({ where: { id: { in: productosIds } } });

      let total = 0;
      const itemsConPrecio = productItems.map((it) => {
        const prod = productos.find((p) => p.id === it.productoId);
        if (!prod) throw new Error(`Producto no encontrado: ${it.productoId}`);
        total += prod.precio * it.cantidad;
        return { cantidad: it.cantidad, precioUnit: prod.precio, productoId: it.productoId };
      });

      pedido = await prisma.pedido.create({
        data: {
          clienteId: cliente.id,
          total: Math.round(total),
          estado: "PENDIENTE",
          notas: direccion ? `Dirección de entrega: ${direccion}` : null,
          items: { create: itemsConPrecio },
        },
        include: { items: { include: { producto: true } } },
      });
    }

    res.status(201).json({ cliente, pedido });
  } catch (error: any) {
    console.error("Error en checkout:", error);
    res.status(500).json({ error: error.message || "Error al procesar el pedido" });
  }
});

// ─── Enviar tarjeta de regalo por correo ─────────────────────────────────────
app.post("/enviar-regalo", async (req, res) => {
  try {
    const { codigo, emailDestinatario, para, de, mensaje, monto, nombreTarjeta } = req.body;

    if (!codigo || !emailDestinatario || !para || !de || !monto) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
      port:   Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mensajeHtml = mensaje
      ? `<p style="font-style:italic; color:#4a6b75; margin:0 0 1.5rem; line-height:1.7;">"${mensaje}"</p>`
      : '';

    const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f2f8f9; font-family: Georgia, 'Times New Roman', serif;">
  <div style="max-width:560px; margin:0 auto; background:#f2f8f9; padding:32px 16px;">

    <!-- Header -->
    <div style="text-align:center; margin-bottom:28px;">
      <p style="margin:0; font-size:11px; letter-spacing:0.28em; text-transform:uppercase; color:#8eaab4; font-family: Arial, sans-serif;">Wellness · Hidrógeno Molecular</p>
      <h1 style="margin:6px 0 0; font-size:28px; font-weight:200; letter-spacing:0.04em; color:#1a3a40;">H2AQUA</h1>
    </div>

    <!-- Card visual -->
    <div style="border-radius:16px; overflow:hidden; margin-bottom:28px;
      background: linear-gradient(135deg, #0b4a55 0%, #006d77 40%, #00968a 75%, #00B7C4 100%);
      padding: 32px 28px;">
      <p style="margin:0 0 4px; font-size:9px; letter-spacing:0.25em; text-transform:uppercase; color:rgba(255,255,255,0.6); font-family:Arial,sans-serif;">H2AQUA · Tarjeta de Regalo</p>
      <p style="margin:0 0 20px; font-size:13px; color:rgba(255,255,255,0.7); font-family:Arial,sans-serif;">${nombreTarjeta}</p>
      <p style="margin:0; font-size:42px; font-weight:200; color:#fff; letter-spacing:0.02em; text-align:center;">$${Number(monto).toLocaleString('es-MX')}</p>
      <p style="margin:4px 0 0; font-size:11px; color:rgba(255,255,255,0.55); text-align:center; font-family:Arial,sans-serif; letter-spacing:0.1em;">MXN</p>
    </div>

    <!-- Content card -->
    <div style="background:#fff; border-radius:16px; padding:28px 28px 24px; margin-bottom:20px;">
      <p style="margin:0 0 6px; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#00B7C4; font-weight:bold; font-family:Arial,sans-serif;">Para</p>
      <p style="margin:0 0 20px; font-size:20px; font-weight:300; color:#1a3a40;">${para}</p>

      ${mensajeHtml}

      <p style="margin:0 0 8px; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#8eaab4; font-family:Arial,sans-serif;">Tu código de regalo</p>
      <div style="background:#f2f8f9; border-radius:10px; padding:16px; text-align:center; border: 1px solid rgba(0,169,192,0.20);">
        <p style="margin:0; font-size:22px; font-weight:700; letter-spacing:0.18em; color:#006d77; font-family: 'Courier New', monospace;">${codigo}</p>
      </div>

      <p style="margin:16px 0 0; font-size:12px; color:#8eaab4; line-height:1.6; font-family:Arial,sans-serif;">
        Presenta este código en nuestras instalaciones o mencionalo al hacer tu pedido en línea para hacer válida tu tarjeta de regalo.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;">
      <p style="margin:0 0 4px; font-size:11px; color:#8eaab4; font-family:Arial,sans-serif;">Con cariño de <strong style="color:#4a6b75;">${de}</strong></p>
      <p style="margin:0; font-size:10px; color:#aac5cc; font-family:Arial,sans-serif;">info@h2aqua.com.mx · Avenida de las Fuentes 665</p>
    </div>

  </div>
</body>
</html>`;

    await transporter.sendMail({
      from: `"H2AQUA" <${process.env.SMTP_USER}>`,
      to: emailDestinatario,
      subject: `🎁 Tu Tarjeta de Regalo H2AQUA · ${codigo}`,
      html,
    });

    res.json({ ok: true });
  } catch (error: any) {
    console.error('Error enviando regalo:', error);
    res.status(500).json({ error: error.message || "Error al enviar el correo" });
  }
});

// ---------- INICIO DEL SERVIDOR ----------

app.listen(PORT, () => {
  console.log(`Servidor escuchando en ${BASE_URL}`);
});
