"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// Puerto y URL base (local o Render)
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
// CORS para permitir frontend local y en producción
const allowedOrigins = [
    'http://localhost:5173',
    'https://h2aqua.com.mx',
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Peticiones sin origin (ej. pruebas internas) se permiten
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));
// Middleware JSON
app.use(express_1.default.json());
// Servir carpeta de uploads de forma estática
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
// Configuración de Multer para guardar imágenes en /uploads
const storage = multer_1.default.diskStorage({
    destination: path_1.default.join(__dirname, '..', 'uploads'),
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});
const upload = (0, multer_1.default)({ storage });
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
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
        const { nombre, descripcion, precio, stock, imagenUrl, categoria, // 'ITEM' | 'TERAPIA'
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
                stock: stock !== null && stock !== void 0 ? stock : 0,
                imagenUrl,
                categoria,
                estado: "ACTIVO",
            },
        });
        res.status(201).json(producto);
    }
    catch (error) {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener productos" });
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
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener productos para tienda" });
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
                    connect: { id: 1 }, // Cliente genérico
                },
                servicio: {
                    connect: { id: 1 }, // Servicio genérico de hidrógeno
                },
                notas,
                estado, // "PENDIENTE" por default si no mandas
            },
        });
        res.status(201).json(cita);
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
        const productosIds = items.map((it) => it.productoId);
        const productos = await prisma.producto.findMany({
            where: { id: { in: productosIds } },
        });
        // Armar items con precioUnit y calcular total
        let total = 0;
        const itemsConPrecio = items.map((it) => {
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener pedidos" });
    }
});
// ---------- INICIO DEL SERVIDOR ----------
app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${BASE_URL}`);
});
