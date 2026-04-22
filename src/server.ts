import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const app = express();
const prisma = new PrismaClient();

// Puerto y URL base (local o Render)
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;


// CORS para permitir frontend local y en producción
const allowedOrigins = [
  'http://localhost:5173',
  'https://h2aqua.com.mx',
  'https://www.h2aqua.com.mx',
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

// Servir carpeta de uploads de forma estática (fallback local)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL    ?? '',
  process.env.SUPABASE_SERVICE_KEY ?? '',
);
const SUPABASE_BUCKET = 'Productos';

// Multer — memory storage (file goes to Supabase, not disk)
const upload = multer({ storage: multer.memoryStorage() });

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

// ---------- SUBIDA DE IMÁGENES (Supabase Storage) ----------

app.post('/upload-imagen', upload.single('imagen'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió ningún archivo' });
  }

  try {
    const ext      = path.extname(req.file.originalname) || '.jpg';
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(filename);

    res.json({ url: data.publicUrl });
  } catch (err: any) {
    console.error('Supabase upload error:', err);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
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
    const { nombre, descripcion, precio, stock, imagenUrl, categoria, seccion, destacado, protocolo_limpieza, protocolo_kbeauty } = req.body;

    const data: Record<string, any> = {};
    if (nombre !== undefined)              data.nombre              = nombre;
    if (descripcion !== undefined)         data.descripcion         = descripcion;
    if (precio !== undefined)              data.precio              = Number(precio);
    if (stock !== undefined)               data.stock               = Number(stock);
    if (imagenUrl !== undefined)           data.imagenUrl           = imagenUrl;
    if (categoria !== undefined)           data.categoria           = categoria;
    if (seccion !== undefined)             data.seccion             = Number(seccion);
    if (destacado !== undefined)           data.destacado           = Boolean(destacado);
    if (protocolo_limpieza !== undefined)  data.protocolo_limpieza  = Boolean(protocolo_limpieza);
    if (protocolo_kbeauty !== undefined)   data.protocolo_kbeauty   = Boolean(protocolo_kbeauty);

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

// ─── Helper: emails de cita nueva (pendiente de pago) ─────────────────────────
async function sendCitaNuevaEmails(data: {
  nombre: string; telefono: string; correo?: string | null;
  terapia: string; fechaHora: Date; precio?: number | null;
}): Promise<void> {
  const transporter = nodemailer.createTransport({
    host:       process.env.SMTP_HOST || 'smtp.gmail.com',
    port:       Number(process.env.SMTP_PORT || 587),
    secure:     process.env.SMTP_PORT === '465',
    requireTLS: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const { nombre, telefono, correo, terapia, fechaHora, precio } = data;
  const fechaFmt = fechaHora.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City' });
  const horaFmt  = fechaHora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Mexico_City' });

  const adminHtml = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f2f8f9;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">
  <div style="text-align:center;margin-bottom:24px;">
    <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#8eaab4;">Wellness · Hidrógeno Molecular</p>
    <h1 style="margin:6px 0 0;font-size:28px;font-weight:200;color:#1a3a40;">H2AQUA</h1>
  </div>
  <div style="border-radius:16px;background:linear-gradient(135deg,#0b4a55,#006d77 50%,#00B7C4);padding:28px;text-align:center;margin-bottom:20px;">
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.65);">Nueva Cita Recibida</p>
    <p style="margin:0;font-size:22px;font-weight:300;color:#fff;">${terapia}</p>
  </div>
  <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;">
    <p style="margin:0 0 14px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#00B7C4;font-weight:bold;">Datos del Cliente</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;width:100px;">Nombre</td><td style="padding:5px 0;color:#1a3a40;font-size:13px;font-weight:600;">${nombre}</td></tr>
      <tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;">Teléfono</td><td style="padding:5px 0;color:#1a3a40;font-size:13px;">${telefono}</td></tr>
      ${correo ? `<tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;">Correo</td><td style="padding:5px 0;color:#1a3a40;font-size:13px;">${correo}</td></tr>` : ''}
    </table>
  </div>
  <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;">
    <p style="margin:0 0 14px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#00B7C4;font-weight:bold;">Detalles de la Cita</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;width:100px;">Terapia</td><td style="padding:5px 0;color:#1a3a40;font-size:13px;font-weight:600;">${terapia}</td></tr>
      <tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;">Fecha</td><td style="padding:5px 0;color:#1a3a40;font-size:13px;text-transform:capitalize;">${fechaFmt}</td></tr>
      <tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;">Hora</td><td style="padding:5px 0;color:#1a3a40;font-size:13px;font-weight:600;">${horaFmt}</td></tr>
      ${precio != null ? `<tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;">Precio</td><td style="padding:5px 0;color:#006d77;font-size:15px;font-weight:700;">$${precio.toLocaleString('es-MX')} MXN</td></tr>` : ''}
    </table>
  </div>
  <div style="background:rgba(255,193,7,0.1);border-radius:12px;padding:16px;border:1px solid rgba(255,193,7,0.3);text-align:center;">
    <p style="margin:0;font-size:13px;color:#856404;">Estado: <strong>PENDIENTE DE PAGO</strong> · Confirmar por WhatsApp o correo</p>
  </div>
  <div style="text-align:center;margin-top:20px;">
    <p style="margin:0 0 4px;font-size:11px;color:#8eaab4;">info@h2aqua.com.mx</p>
    <p style="margin:0;font-size:11px;color:#8eaab4;">WhatsApp: 55 2560 1138</p>
  </div>
</div>
</body></html>`;

  const clienteHtml = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f2f8f9;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">
  <div style="text-align:center;margin-bottom:24px;">
    <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#8eaab4;">Wellness · Hidrógeno Molecular</p>
    <h1 style="margin:6px 0 0;font-size:28px;font-weight:200;color:#1a3a40;">H2AQUA</h1>
  </div>
  <div style="border-radius:16px;background:linear-gradient(135deg,#0b4a55,#006d77 50%,#00B7C4);padding:28px;text-align:center;margin-bottom:20px;">
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.65);">Solicitud Recibida</p>
    <p style="margin:0;font-size:26px;font-weight:200;color:#fff;">Tu cita está registrada</p>
  </div>
  <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;">
    <p style="margin:0 0 14px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#00B7C4;font-weight:bold;">Resumen de tu Cita</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;width:100px;">Terapia</td><td style="padding:5px 0;color:#1a3a40;font-size:13px;font-weight:600;">${terapia}</td></tr>
      <tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;">Fecha</td><td style="padding:5px 0;color:#1a3a40;font-size:13px;text-transform:capitalize;">${fechaFmt}</td></tr>
      <tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;">Hora</td><td style="padding:5px 0;color:#1a3a40;font-size:13px;font-weight:600;">${horaFmt}</td></tr>
      ${precio != null ? `<tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;">Precio</td><td style="padding:5px 0;color:#006d77;font-size:15px;font-weight:700;">$${precio.toLocaleString('es-MX')} MXN</td></tr>` : ''}
    </table>
  </div>
  <div style="background:rgba(255,193,7,0.1);border-radius:16px;padding:20px;margin-bottom:16px;border:1px solid rgba(255,193,7,0.3);">
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#856404;text-transform:uppercase;letter-spacing:0.1em;">⏳ Pendiente de confirmación</p>
    <p style="margin:0;font-size:13px;color:#664d03;line-height:1.7;">Tu cita ha sido registrada y está <strong>pendiente de pago</strong>. Para confirmarla, comunícate con nosotros:<br><strong>WhatsApp: 55 2560 1138</strong> o escríbenos a <strong>info@h2aqua.com.mx</strong>. Una vez confirmado el pago recibirás un correo de confirmación.</p>
  </div>
  <div style="background:#fff;border-radius:16px;padding:20px;text-align:center;margin-bottom:16px;">
    <p style="margin:0 0 8px;font-size:12px;color:#8eaab4;">¿Necesitas ayuda?</p>
    <p style="margin:0 0 4px;font-size:14px;color:#006d77;font-weight:600;">info@h2aqua.com.mx</p>
    <p style="margin:0;font-size:13px;color:#006d77;">WhatsApp: 55 2560 1138</p>
  </div>
  <div style="text-align:center;margin-top:16px;">
    <p style="margin:0;font-size:10px;color:#aac5cc;">H2AQUA · Avenida de las Fuentes 665</p>
  </div>
</div>
</body></html>`;

  await transporter.sendMail({
    from: `"H2AQUA" <${process.env.SMTP_USER}>`,
    to:   process.env.SMTP_USER ?? 'h2aquamexico@gmail.com',
    subject: `📅 Nueva cita — ${nombre} · ${fechaFmt} ${horaFmt}`,
    html: adminHtml,
  });

  if (correo) {
    await transporter.sendMail({
      from: `"H2AQUA" <${process.env.SMTP_USER}>`,
      to:   correo,
      subject: `📅 Tu cita H2AQUA está registrada — ${fechaFmt} ${horaFmt}`,
      html: clienteHtml,
    });
  }
}

// ─── Helper: email de confirmación de cita ────────────────────────────────────
async function sendCitaConfirmadaEmail(data: {
  correo: string; nombre: string; terapia: string; fechaHora: Date; precio?: number | null;
}): Promise<void> {
  const transporter = nodemailer.createTransport({
    host:       process.env.SMTP_HOST || 'smtp.gmail.com',
    port:       Number(process.env.SMTP_PORT || 587),
    secure:     process.env.SMTP_PORT === '465',
    requireTLS: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const { correo, nombre, terapia, fechaHora, precio } = data;
  const fechaFmt = fechaHora.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City' });
  const horaFmt  = fechaHora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Mexico_City' });

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f2f8f9;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">
  <div style="text-align:center;margin-bottom:24px;">
    <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#8eaab4;">Wellness · Hidrógeno Molecular</p>
    <h1 style="margin:6px 0 0;font-size:28px;font-weight:200;color:#1a3a40;">H2AQUA</h1>
  </div>
  <div style="border-radius:16px;background:linear-gradient(135deg,#0b4a55,#006d77 50%,#00B7C4);padding:28px;text-align:center;margin-bottom:20px;">
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.65);">¡Cita Confirmada!</p>
    <p style="margin:0;font-size:26px;font-weight:200;color:#fff;">Te esperamos, ${nombre.split(' ')[0]}</p>
  </div>
  <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;">
    <p style="margin:0 0 14px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#00B7C4;font-weight:bold;">Detalles de tu Cita Confirmada</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;width:100px;">Terapia</td><td style="padding:5px 0;color:#1a3a40;font-size:13px;font-weight:600;">${terapia}</td></tr>
      <tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;">Fecha</td><td style="padding:5px 0;color:#1a3a40;font-size:13px;text-transform:capitalize;">${fechaFmt}</td></tr>
      <tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;">Hora</td><td style="padding:5px 0;color:#1a3a40;font-size:13px;font-weight:600;">${horaFmt}</td></tr>
      ${precio != null ? `<tr><td style="padding:5px 0;color:#8eaab4;font-size:13px;">Precio</td><td style="padding:5px 0;color:#006d77;font-size:15px;font-weight:700;">$${precio.toLocaleString('es-MX')} MXN</td></tr>` : ''}
    </table>
  </div>
  <div style="background:rgba(0,183,196,0.08);border-radius:16px;padding:20px;margin-bottom:16px;border:1px solid rgba(0,183,196,0.2);text-align:center;">
    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#006d77;">✅ Tu pago fue confirmado</p>
    <p style="margin:0;font-size:13px;color:#1a3a40;line-height:1.7;">Tu cita está <strong>confirmada</strong>. Te esperamos en nuestras instalaciones en la fecha y hora indicadas. Si necesitas hacer algún cambio, contáctanos con anticipación:<br><strong>WhatsApp: 55 2560 1138</strong> · info@h2aqua.com.mx</p>
  </div>
  <div style="background:#fff;border-radius:16px;padding:20px;text-align:center;margin-bottom:16px;">
    <p style="margin:0 0 8px;font-size:12px;color:#8eaab4;">¿Tienes dudas?</p>
    <p style="margin:0 0 4px;font-size:14px;color:#006d77;font-weight:600;">info@h2aqua.com.mx</p>
    <p style="margin:0;font-size:13px;color:#006d77;">WhatsApp: 55 2560 1138</p>
  </div>
  <div style="text-align:center;margin-top:16px;">
    <p style="margin:0;font-size:10px;color:#aac5cc;">H2AQUA · Avenida de las Fuentes 665</p>
  </div>
</div>
</body></html>`;

  await transporter.sendMail({
    from: `"H2AQUA" <${process.env.SMTP_USER}>`,
    to:   correo,
    subject: `✅ ¡Cita confirmada! ${terapia} — ${fechaFmt} ${horaFmt}`,
    html,
  });
}

// Crear una nueva cita
app.post("/citas", async (req, res) => {
  try {
    const { fechaHora, servicioId, notas, estado, nombre, telefono, correo, terapia, precio } = req.body;

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

    try {
      await sendCitaNuevaEmails({
        nombre:   nombre ?? 'Sin nombre',
        telefono: telefono ?? '',
        correo:   correo || null,
        terapia:  terapia ?? 'Terapia H2AQUA',
        fechaHora: new Date(fechaHora),
        precio:   precio ?? null,
      });
    } catch (emailErr: any) {
      console.error('Cita email error (non-fatal):', emailErr.message);
    }

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

    // Si se confirma, enviar email de confirmación al cliente
    if (estado === 'CONFIRMADA' && cita.notas) {
      try {
        const correoMatch = cita.notas.match(/Correo:\s*([\w.+%-]+@[\w.-]+\.[a-z]{2,})/i);
        const nombreMatch = cita.notas.match(/Nombre:\s*([^,]+)/);
        const terapiaMatch = cita.notas.match(/Terapia:\s*(.+)$/);
        const correoCliente = correoMatch?.[1] ?? null;
        const nombreCliente = nombreMatch?.[1]?.trim() ?? 'Cliente';
        const terapiaNombre = terapiaMatch?.[1]?.trim() ?? 'Terapia H2AQUA';

        if (correoCliente) {
          await sendCitaConfirmadaEmail({
            correo:    correoCliente,
            nombre:    nombreCliente,
            terapia:   terapiaNombre,
            fechaHora: new Date(cita.fechaHora),
          });
          console.log(`Confirmation email sent to ${correoCliente} for cita ${id}`);
        }
      } catch (emailErr: any) {
        console.error('Cita confirmation email error (non-fatal):', emailErr.message);
      }
    }

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

// ─── Helper: enviar correos de confirmación de pedido ────────────────────────
interface OrderEmailData {
  pedidoId: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  direccion?: string | null;
  items: Array<{ nombre: string; cantidad: number; precioUnit: number }>;
  total: number;
}

async function sendOrderEmails(data: OrderEmailData): Promise<void> {
  const numeroOrdenLog = `H2-${String(data.pedidoId).padStart(5, '0')}`;
  console.log('sendOrderEmails called for order:', numeroOrdenLog, '→', data.email);
  const transporter = nodemailer.createTransport({
    host:       process.env.SMTP_HOST || 'smtp.titan.email',
    port:       Number(process.env.SMTP_PORT || 587),
    secure:     process.env.SMTP_PORT === '465',
    requireTLS: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const { pedidoId, nombre, email, telefono, direccion, items, total } = data;
  const numeroOrden = `H2-${String(pedidoId).padStart(5, '0')}`;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #e8f0f2;color:#1a3a40;font-size:13px;">${item.nombre}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e8f0f2;text-align:center;color:#4a6b75;font-size:13px;">${item.cantidad}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e8f0f2;text-align:right;color:#1a3a40;font-size:13px;font-weight:600;">$${(item.precioUnit * item.cantidad).toLocaleString('es-MX')}</td>
    </tr>`).join('');

  const buildHtml = (isAdmin: boolean) => `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f2f8f9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#f2f8f9;padding:32px 16px;">
    <div style="text-align:center;margin-bottom:24px;">
      <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#8eaab4;">Wellness · Hidrógeno Molecular</p>
      <h1 style="margin:6px 0 0;font-size:28px;font-weight:200;letter-spacing:0.04em;color:#1a3a40;">H2AQUA</h1>
    </div>
    <div style="border-radius:16px;background:linear-gradient(135deg,#0b4a55,#006d77 50%,#00B7C4);padding:28px;text-align:center;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.65);">${isAdmin ? 'Nuevo Pedido Recibido' : 'Confirmación de Pedido'}</p>
      <p style="margin:0;font-size:36px;font-weight:200;color:#fff;letter-spacing:0.08em;font-family:'Courier New',monospace;">${numeroOrden}</p>
    </div>
    <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;">
      <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#00B7C4;font-weight:bold;">Datos del Cliente</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:4px 0;color:#8eaab4;font-size:13px;width:110px;">Nombre</td><td style="padding:4px 0;color:#1a3a40;font-size:13px;font-weight:600;">${nombre}</td></tr>
        <tr><td style="padding:4px 0;color:#8eaab4;font-size:13px;">Correo</td><td style="padding:4px 0;color:#1a3a40;font-size:13px;">${email}</td></tr>
        ${telefono ? `<tr><td style="padding:4px 0;color:#8eaab4;font-size:13px;">Teléfono</td><td style="padding:4px 0;color:#1a3a40;font-size:13px;">${telefono}</td></tr>` : ''}
      </table>
    </div>
    ${direccion ? `<div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;">
      <p style="margin:0 0 10px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#00B7C4;font-weight:bold;">Dirección de Envío</p>
      <p style="margin:0;color:#1a3a40;font-size:13px;line-height:1.8;">${direccion}</p>
    </div>` : ''}
    <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;">
      <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#00B7C4;font-weight:bold;">Productos</p>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;font-size:11px;color:#8eaab4;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e8f0f2;">Producto</th>
            <th style="text-align:center;font-size:11px;color:#8eaab4;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e8f0f2;">Cant.</th>
            <th style="text-align:right;font-size:11px;color:#8eaab4;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e8f0f2;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding-top:14px;font-size:14px;color:#4a6b75;font-weight:600;">Total</td>
            <td style="padding-top:14px;text-align:right;font-size:20px;color:#006d77;font-weight:700;">$${total.toLocaleString('es-MX')} <span style="font-size:12px;font-weight:400;color:#8eaab4;">MXN</span></td>
          </tr>
        </tfoot>
      </table>
    </div>
    ${!isAdmin ? `<div style="background:rgba(0,183,196,0.08);border-radius:16px;padding:20px;margin-bottom:16px;border:1px solid rgba(0,183,196,0.2);text-align:center;">
      <p style="margin:0;font-size:13px;color:#006d77;line-height:1.7;">Hemos recibido tu pedido. Nos pondremos en contacto contigo a la brevedad para coordinar la entrega.</p>
    </div>` : ''}
    <div style="text-align:center;padding-top:8px;">
      <p style="margin:0 0 4px;font-size:11px;color:#8eaab4;">info@h2aqua.com.mx · WhatsApp: 55 2560 1138</p>
      <p style="margin:0;font-size:10px;color:#aac5cc;">Avenida de las Fuentes 665</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"H2AQUA Tienda" <${process.env.SMTP_USER}>`,
    to:   process.env.SMTP_USER ?? 'h2aquamexico@gmail.com',
    subject: `🛒 Nuevo pedido ${numeroOrden} — ${nombre}`,
    html: buildHtml(true),
  });

  await transporter.sendMail({
    from: `"H2AQUA" <${process.env.SMTP_USER}>`,
    to:   email,
    subject: `✅ Confirmación de pedido ${numeroOrden} — H2AQUA`,
    html: buildHtml(false),
  });
}

// ─── Checkout: registrar cliente + pedido ────────────────────────────────────
// items: [{ productoId: number, cantidad: number }]  (gift cards excluded)
app.post("/checkout", async (req, res) => {
  console.log('Checkout called with data:', JSON.stringify(req.body));
  try {
    const { nombre, email, telefono, direccion, items, estado: estadoEnvio } = req.body;

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

      // Lookup shipping cost for the selected state
      let costoEnvio = 0;
      if (estadoEnvio) {
        const ceRow = await (prisma as any).costoEnvio.findUnique({ where: { estado: estadoEnvio } });
        if (ceRow) costoEnvio = ceRow.costo;
      }

      let total = 0;
      const itemsConPrecio = productItems.map((it) => {
        const prod = productos.find((p) => p.id === it.productoId);
        if (!prod) throw new Error(`Producto no encontrado: ${it.productoId}`);
        total += prod.precio * it.cantidad;
        return { cantidad: it.cantidad, precioUnit: prod.precio, productoId: it.productoId };
      });
      total += costoEnvio;

      const notasParts: string[] = [];
      if (direccion) notasParts.push(`Dirección de entrega: ${direccion}`);
      if (estadoEnvio) notasParts.push(`Estado: ${estadoEnvio}`);
      if (costoEnvio > 0) notasParts.push(`Costo de envío: $${costoEnvio}`);

      pedido = await prisma.pedido.create({
        data: {
          clienteId: cliente.id,
          total: Math.round(total),
          estado: "PENDIENTE",
          notas: notasParts.length > 0 ? notasParts.join(' | ') : null,
          items: { create: itemsConPrecio },
        },
        include: { items: { include: { producto: true } } },
      });
      console.log('Order created:', pedido.id);
    }

    if (pedido) {
      console.log('Calling sendOrderEmails...');
      try {
        await sendOrderEmails({
          pedidoId:  pedido.id,
          nombre:    cliente.nombre,
          email:     cliente.email,
          telefono:  cliente.telefono,
          direccion: direccion || null,
          items:     (pedido.items as any[]).map(i => ({
            nombre:    i.producto?.nombre ?? `Producto #${i.productoId}`,
            cantidad:  i.cantidad,
            precioUnit: i.precioUnit,
          })),
          total: pedido.total,
        });
        console.log('sendOrderEmails completed');
      } catch (emailErr: any) {
        console.error('sendOrderEmails ERROR:', emailErr.message);
      }
    }

    res.status(201).json({ cliente, pedido });
  } catch (error: any) {
    console.error("Error en checkout:", error);
    res.status(500).json({ error: error.message || "Error al procesar el pedido" });
  }
});

// ─── Costos de envío por estado ──────────────────────────────────────────────

app.get("/costos-envio", async (_req, res) => {
  try {
    const costos = await (prisma as any).costoEnvio.findMany({ orderBy: { estado: 'asc' } });
    res.json(costos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/costos-envio/:estado", async (req, res) => {
  try {
    const { estado } = req.params;
    const { costo } = req.body;
    if (costo === undefined || isNaN(Number(costo))) {
      return res.status(400).json({ error: 'costo es requerido y debe ser un número' });
    }
    const updated = await (prisma as any).costoEnvio.update({
      where: { estado },
      data:  { costo: Number(costo) },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Helper: enviar tarjeta de regalo por correo ─────────────────────────────
interface GiftCardData {
  codigo: string;
  emailDestinatario: string;
  para: string;
  de: string;
  mensaje?: string;
  monto: number;
  nombreTarjeta: string;
}

async function sendGiftCardEmail(gift: GiftCardData): Promise<void> {
  const transporter = nodemailer.createTransport({
    host:       process.env.SMTP_HOST || 'smtp.titan.email',
    port:       Number(process.env.SMTP_PORT || 587),
    secure:     process.env.SMTP_PORT === '465',
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const { codigo, emailDestinatario, para, de, mensaje, monto, nombreTarjeta } = gift;
  const mensajeHtml = mensaje
    ? `<p style="font-style:italic; color:#4a6b75; margin:0 0 1.5rem; line-height:1.7;">"${mensaje}"</p>`
    : '';

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f2f8f9; font-family: Georgia, 'Times New Roman', serif;">
  <div style="max-width:560px; margin:0 auto; background:#f2f8f9; padding:32px 16px;">
    <div style="text-align:center; margin-bottom:28px;">
      <p style="margin:0; font-size:11px; letter-spacing:0.28em; text-transform:uppercase; color:#8eaab4; font-family: Arial, sans-serif;">Wellness · Hidrógeno Molecular</p>
      <h1 style="margin:6px 0 0; font-size:28px; font-weight:200; letter-spacing:0.04em; color:#1a3a40;">H2AQUA</h1>
    </div>
    <div style="border-radius:16px; overflow:hidden; margin-bottom:28px;
      background: linear-gradient(135deg, #0b4a55 0%, #006d77 40%, #00968a 75%, #00B7C4 100%);
      padding: 32px 28px;">
      <p style="margin:0 0 4px; font-size:9px; letter-spacing:0.25em; text-transform:uppercase; color:rgba(255,255,255,0.6); font-family:Arial,sans-serif;">H2AQUA · Tarjeta de Regalo</p>
      <p style="margin:0 0 20px; font-size:13px; color:rgba(255,255,255,0.7); font-family:Arial,sans-serif;">${nombreTarjeta}</p>
      <p style="margin:0; font-size:42px; font-weight:200; color:#fff; letter-spacing:0.02em; text-align:center;">$${Number(monto).toLocaleString('es-MX')}</p>
      <p style="margin:4px 0 0; font-size:11px; color:rgba(255,255,255,0.55); text-align:center; font-family:Arial,sans-serif; letter-spacing:0.1em;">MXN</p>
    </div>
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
    <div style="text-align:center;">
      <p style="margin:0 0 4px; font-size:11px; color:#8eaab4; font-family:Arial,sans-serif;">Con cariño de <strong style="color:#4a6b75;">${de}</strong></p>
      <p style="margin:0; font-size:10px; color:#aac5cc; font-family:Arial,sans-serif;">info@h2aqua.com.mx · WhatsApp: 55 2560 1138 · Avenida de las Fuentes 665</p>
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
}

// ─── Enviar tarjeta de regalo por correo ─────────────────────────────────────
app.post("/enviar-regalo", async (req, res) => {
  try {
    const { codigo, emailDestinatario, para, de, mensaje, monto, nombreTarjeta } = req.body;

    if (!codigo || !emailDestinatario || !para || !de || !monto) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    try {
      await sendGiftCardEmail({ codigo, emailDestinatario, para, de, mensaje, monto, nombreTarjeta });
      res.json({ ok: true, emailSent: true });
    } catch (mailError: any) {
      console.error('SMTP error (non-fatal):', mailError.message);
      res.json({ ok: true, emailSent: false, smtpError: mailError.message });
    }
  } catch (error: any) {
    console.error('Error en enviar-regalo:', error);
    res.status(500).json({ error: error.message || "Error al procesar la solicitud" });
  }
});

// ─── PayPal ───────────────────────────────────────────────────────────────────

const PAYPAL_BASE =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

async function getPayPalToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID ?? '';
  const secret   = process.env.PAYPAL_SECRET ?? '';
  const creds    = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method:  'POST',
    headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    'grant_type=client_credentials',
  });
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

// POST /api/paypal/create-order — creates a PayPal order and returns the orderID
app.post('/api/paypal/create-order', async (req, res) => {
  try {
    const { total } = req.body as { total: number };
    if (!total || total <= 0) return res.status(400).json({ error: 'Invalid total' });

    const token    = await getPayPalToken();
    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: 'MXN', value: Number(total).toFixed(2) },
          description: 'H2AQUA · Tienda en línea',
        }],
      }),
    });
    const order = await orderRes.json() as { id: string };
    res.json({ orderID: order.id });
  } catch (error: any) {
    console.error('PayPal create-order:', error);
    res.status(500).json({ error: 'Error creating PayPal order' });
  }
});

// POST /api/paypal/capture-order — captures payment after user approves
app.post('/api/paypal/capture-order', async (req, res) => {
  try {
    const { orderID } = req.body as { orderID: string };
    if (!orderID) return res.status(400).json({ error: 'orderID is required' });

    const token      = await getPayPalToken();
    const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    const capture = await captureRes.json() as { status: string; id: string };

    if (capture.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Payment was not completed by PayPal' });
    }

    res.json({ status: capture.status, orderID: capture.id });
  } catch (error: any) {
    console.error('PayPal capture-order:', error);
    res.status(500).json({ error: error.message || 'Error capturing PayPal payment' });
  }
});

// ─── Clip ─────────────────────────────────────────────────────────────────────

const CLIP_BASE = 'https://api.payclip.com';

function getClipAuthHeader(): string {
  const apiKey    = process.env.CLIP_API_KEY    ?? '';
  const secretKey = process.env.CLIP_SECRET_KEY ?? '';
  return `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString('base64')}`;
}

// Temporary in-memory store for pending Clip payments (keyed by payment_request_id)
interface ClipPendingOrder {
  nombre:    string;
  email:     string;
  telefono:  string;
  direccion: string;
  items:     { productoId: number; cantidad: number }[];
  regalos:   GiftCardData[];
}
const clipPendingOrders = new Map<string, ClipPendingOrder>();

// POST /api/clip/create-payment — create a Clip payment link and return the URL
app.post('/api/clip/create-payment', async (req, res) => {
  try {
    const { nombre, email, telefono, direccion, items, regalos, total } = req.body as {
      nombre: string; email: string; telefono?: string; direccion?: string;
      items?: { productoId: number; cantidad: number }[];
      regalos?: GiftCardData[];
      total: number;
    };

    if (!nombre || !email || !total) {
      return res.status(400).json({ error: 'nombre, email y total son obligatorios' });
    }

    const frontendUrl = process.env.FRONTEND_URL ?? 'https://h2aqua.com.mx';
    const webhookUrl  = `${BASE_URL}/api/clip/webhook`;
    const expiresAt   = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours

    const clipRes = await fetch(`${CLIP_BASE}/v2/checkout`, {
      method:  'POST',
      headers: {
        'Authorization': getClipAuthHeader(),
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        amount:               Number(total),
        currency:             'MXN',
        purchase_description: `H2AQUA · Pedido de ${nombre}`.slice(0, 250),
        webhook_url:          webhookUrl,
        redirection_url: {
          success:  `${frontendUrl}?clip=success&nombre=${encodeURIComponent(nombre)}`,
          error:    `${frontendUrl}?clip=error`,
          default:  frontendUrl,
        },
        expires_at: expiresAt,
        metadata:   { email, nombre },
      }),
    });

    if (!clipRes.ok) {
      const errBody = await clipRes.text();
      console.error('Clip create-payment error:', clipRes.status, errBody);
      return res.status(502).json({ error: 'Error al crear el pago con Clip' });
    }

    const clipData = await clipRes.json() as {
      payment_request_id:  string;
      payment_request_url: string;
    };

    const paymentUrl = clipData.payment_request_url;
    if (!paymentUrl) {
      console.error('Clip: no URL in response', clipData);
      return res.status(502).json({ error: 'Clip no devolvió una URL de pago' });
    }

    // Store order data until webhook confirms
    clipPendingOrders.set(clipData.payment_request_id, {
      nombre,
      email,
      telefono:  telefono  ?? '',
      direccion: direccion ?? '',
      items:     items     ?? [],
      regalos:   regalos   ?? [],
    });
    // Auto-remove after 4 hours
    setTimeout(() => clipPendingOrders.delete(clipData.payment_request_id), 4 * 60 * 60 * 1000);

    res.json({ url: paymentUrl, paymentRequestId: clipData.payment_request_id });

  } catch (error: any) {
    console.error('Clip create-payment:', error);
    res.status(500).json({ error: error.message || 'Error al crear el pago con Clip' });
  }
});

// POST /api/clip/webhook — Clip calls this when a payment completes
app.post('/api/clip/webhook', async (req, res) => {
  // Always respond 200 quickly so Clip doesn't retry
  res.status(200).json({ ok: true });

  try {
    const { payment_request_id, resource_status } = req.body as {
      payment_request_id: string;
      resource_status:    string;
    };

    console.log('Clip webhook:', { payment_request_id, resource_status });

    if (resource_status !== 'COMPLETED') return;

    const pending = clipPendingOrders.get(payment_request_id);
    if (!pending) {
      console.warn('Clip webhook: no pending order for', payment_request_id);
      return;
    }

    // Verify payment with Clip before fulfilling (avoid spoofed webhooks)
    try {
      const checkRes = await fetch(
        `${CLIP_BASE}/v2/checkout/${payment_request_id}`,
        { headers: { 'Authorization': getClipAuthHeader() } },
      );
      if (checkRes.ok) {
        const checkData = await checkRes.json() as { resource_status?: string; status?: string };
        const confirmed = checkData.resource_status === 'COMPLETED' || checkData.status === 'approved';
        if (!confirmed) {
          console.warn('Clip webhook: status not confirmed via API', checkData);
          return;
        }
      }
    } catch (verifyErr) {
      console.warn('Clip webhook: could not verify via API (proceeding anyway):', verifyErr);
    }

    const { nombre, email, telefono, direccion, items, regalos } = pending;

    // Find-or-create cliente
    let cliente = await prisma.cliente.findUnique({ where: { email } });
    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: { nombre, email, telefono: telefono || null, direccion: direccion || null },
      });
    } else {
      cliente = await prisma.cliente.update({
        where: { email },
        data: { nombre, telefono: telefono || cliente.telefono, direccion: direccion || cliente.direccion },
      });
    }

    // Create pedido for real product items
    const productItems = items.filter((i) => i.productoId > 0);
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

      await prisma.pedido.create({
        data: {
          clienteId: cliente.id,
          total:     Math.round(total),
          estado:    'PENDIENTE',
          notas:     `Pago Clip · ${payment_request_id}${direccion ? `\nEntrega: ${direccion}` : ''}`,
          items:     { create: itemsConPrecio },
        },
      });
    }

    // Send gift card emails
    for (const regalo of regalos) {
      if (!regalo.codigo || !regalo.emailDestinatario) continue;
      try {
        await sendGiftCardEmail(regalo);
      } catch (mailErr: any) {
        console.warn('Clip webhook: gift card email failed (non-fatal):', mailErr.message);
      }
    }

    clipPendingOrders.delete(payment_request_id);
    console.log('Clip webhook: order fulfilled for', email);

  } catch (error: any) {
    console.error('Clip webhook processing error:', error);
  }
});

// ---------- INICIO DEL SERVIDOR ----------

app.listen(PORT, () => {
  console.log(`Servidor escuchando en ${BASE_URL}`);
});
