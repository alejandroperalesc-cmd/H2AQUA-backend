import { useEffect, useState } from 'react';
import { obtenerProductos, API_URL } from './api';
import type { Producto } from './api';

function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // estado para edición
  const [productoEditandoId, setProductoEditandoId] = useState<number | null>(null);
  const [formEdicion, setFormEdicion] = useState<{
    nombre: string;
    descripcion: string;
    precio: string;
    imagenUrl: string;
    categoria?: string;
  }>({
    nombre: '',
    descripcion: '',
    precio: '',
    imagenUrl: '',
    categoria: '',
  });

  async function cargarProductos() {
    try {
      setCargando(true);
      const data = await obtenerProductos();
      setProductos(data);
      setCargando(false);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los productos');
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cambiarEstadoProducto(
    id: number,
    estado: 'ACTIVO' | 'AGOTADO' | 'INACTIVO',
  ) {
    try {
      await fetch(`${API_URL}/productos/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      await cargarProductos();
    } catch (err) {
      console.error(err);
      setError('No se pudo actualizar el estado del producto');
    }
  }

  async function eliminarProducto(id: number) {
    const confirmar = window.confirm('¿Seguro que quieres eliminar este producto?');
    if (!confirmar) return;

    try {
      await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE',
      });
      await cargarProductos();
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el producto');
    }
  }

  // iniciar edición
  function empezarEdicion(p: Producto) {
    setProductoEditandoId(p.id);
    setFormEdicion({
      nombre: p.nombre ?? '',
      descripcion: p.descripcion ?? '',
      precio: String(p.precio ?? ''),
      imagenUrl: p.imagenUrl ?? '',
      categoria: (p as any).categoria ?? '',
    });
  }

  function cancelarEdicion() {
    setProductoEditandoId(null);
  }

  // guardar cambios
  async function guardarEdicion(id: number) {
    try {
      const precioNumber = Number(formEdicion.precio);
      if (Number.isNaN(precioNumber)) {
        alert('El precio debe ser un número');
        return;
      }

      const resp = await fetch(`${API_URL}/productos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formEdicion.nombre,
          descripcion: formEdicion.descripcion,
          precio: precioNumber,
          imagenUrl: formEdicion.imagenUrl || null,
          categoria: formEdicion.categoria || undefined, // solo si tu modelo tiene categoria
        }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        console.error('Error al actualizar producto:', txt);
        alert('No se pudieron guardar los cambios del producto');
        return;
      }

      setProductoEditandoId(null);
      await cargarProductos();
    } catch (err) {
      console.error(err);
      alert('No se pudieron guardar los cambios del producto');
    }
  }

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Productos</h1>
      <ul>
        {productos.map((p) => {
          const enEdicion = productoEditandoId === p.id;

          return (
            <li
              key={p.id}
              style={{
                marginBottom: '1.5rem',
                borderBottom: '1px solid #ccc',
                paddingBottom: '1rem',
              }}
            >
              {!enEdicion && (
                <>
                  <div>
                    <strong>{p.nombre}</strong> - ${p.precio} MXN
                  </div>
                  <div>
                    <small>{p.descripcion}</small>
                  </div>
                  <div style={{ marginTop: '0.25rem' }}>
                    <small>
                      Estado:{' '}
                      <strong
                        style={{
                          color:
                            p.estado === 'ACTIVO'
                              ? 'green'
                              : p.estado === 'AGOTADO'
                              ? 'orange'
                              : 'gray',
                        }}
                      >
                        {p.estado}
                      </strong>
                    </small>
                  </div>
                  {p.imagenUrl && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <img
                        src={p.imagenUrl}
                        alt={p.nombre}
                        style={{ maxWidth: '200px', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                </>
              )}

              {enEdicion && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <label>
                    <span>Nombre</span>
                    <input
                      type="text"
                      value={formEdicion.nombre}
                      onChange={(e) =>
                        setFormEdicion((prev) => ({
                          ...prev,
                          nombre: e.target.value,
                        }))
                      }
                      style={{
                        width: '100%',
                        padding: '0.4rem 0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                      }}
                    />
                  </label>

                  <label>
                    <span>Descripción</span>
                    <textarea
                      value={formEdicion.descripcion}
                      onChange={(e) =>
                        setFormEdicion((prev) => ({
                          ...prev,
                          descripcion: e.target.value,
                        }))
                      }
                      style={{
                        width: '100%',
                        padding: '0.4rem 0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        minHeight: '60px',
                      }}
                    />
                  </label>

                  <label>
                    <span>Precio (MXN)</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formEdicion.precio}
                      onChange={(e) =>
                        setFormEdicion((prev) => ({
                          ...prev,
                          precio: e.target.value,
                        }))
                      }
                      style={{
                        width: '100%',
                        padding: '0.4rem 0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                      }}
                    />
                  </label>

                                    {/* Imagen: botón Examinar + vista previa */}
                  <label>
                    <span>Imagen</span>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      {formEdicion.imagenUrl && (
                        <img
                          src={formEdicion.imagenUrl}
                          alt={formEdicion.nombre}
                          style={{ maxWidth: '200px', borderRadius: '8px' }}
                        />
                      )}

                      {/* ESTE input muestra el botón "Examinar" */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const formData = new FormData();
                          formData.append('imagen', file);

                          try {
                            const resp = await fetch(
                              `${API_URL}/upload-imagen`,
                              {
                                method: 'POST',
                                body: formData,
                              },
                            );
                            if (!resp.ok) {
                              const txt = await resp.text();
                              console.error(
                                'Error al subir imagen:',
                                txt,
                              );
                              alert('No se pudo subir la imagen.');
                              return;
                            }
                            const data = await resp.json(); // { url: ... }

                            setFormEdicion((prev) => ({
                              ...prev,
                              imagenUrl: data.url,
                            }));
                          } catch (err) {
                            console.error(err);
                            alert('No se pudo subir la imagen.');
                          }
                        }}
                      />

                      {/* opcional: seguir pudiendo pegar una URL manual */}
                      <input
                        type="text"
                        placeholder="o pega una URL de imagen"
                        value={formEdicion.imagenUrl}
                        onChange={(e) =>
                          setFormEdicion((prev) => ({
                            ...prev,
                            imagenUrl: e.target.value,
                          }))
                        }
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.5rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #d1d5db',
                        }}
                      />
                    </div>
                  </label>


                  {typeof formEdicion.categoria !== 'undefined' && (
                    <label>
                      <span>Categoría</span>
                      <input
                        type="text"
                        value={formEdicion.categoria}
                        onChange={(e) =>
                          setFormEdicion((prev) => ({
                            ...prev,
                            categoria: e.target.value,
                          }))
                        }
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.5rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #d1d5db',
                        }}
                      />
                    </label>
                  )}

                  <div
                    style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <button onClick={cancelarEdicion}>Cancelar</button>
                    <button onClick={() => guardarEdicion(p.id)}>
                      Guardar cambios
                    </button>
                  </div>
                </div>
              )}

              {/* Acciones generales */}
              <div
                style={{
                  marginTop: '0.5rem',
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <button onClick={() => cambiarEstadoProducto(p.id, 'ACTIVO')}>
                  Marcar como ACTIVO
                </button>
                <button onClick={() => cambiarEstadoProducto(p.id, 'AGOTADO')}>
                  Marcar como AGOTADO
                </button>
                <button onClick={() => cambiarEstadoProducto(p.id, 'INACTIVO')}>
                  Marcar como INACTIVO
                </button>
                <button
                  onClick={() => empezarEdicion(p)}
                  style={{ marginLeft: 'auto' }}
                >
                  {productoEditandoId === p.id ? 'Editando...' : 'Editar'}
                </button>
                <button
                  style={{ color: 'white', backgroundColor: 'red' }}
                  onClick={() => eliminarProducto(p.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Productos;
