// TiendaProductos.tsx
import React, { useEffect, useState } from 'react';
import type { ItemCarrito } from './App';

const API_URL = 'http://localhost:3000';

interface ProductoTienda {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  categoria: string | null; // 'TERAPIA' | 'ITEM' | otros
  imagenUrl: string | null;
  estado: 'ACTIVO' | 'AGOTADO' | 'INACTIVO';
}

interface TiendaProductosProps {
  carrito: ItemCarrito[];
  onAgregarAlCarrito: (item: Omit<ItemCarrito, 'cantidad'>) => void;
}

const TiendaProductos: React.FC<TiendaProductosProps> = ({
  carrito,
  onAgregarAlCarrito,
}) => {
  const [productos, setProductos] = useState<ProductoTienda[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargarProductosTienda() {
    try {
      setCargando(true);
      setError(null);

      const resp = await fetch(`${API_URL}/productos-tienda`);
      if (!resp.ok) {
        throw new Error('Error al obtener productos para tienda');
      }
      const data: ProductoTienda[] = await resp.json();
      setProductos(data);
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar los productos de la tienda');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProductosTienda();
  }, []);

  const terapias = productos.filter(
    (p) => p.categoria === 'TERAPIA' && p.estado !== 'INACTIVO',
  );
  const items = productos.filter(
    (p) => p.categoria === 'ITEM' && p.estado !== 'INACTIVO',
  );

  if (cargando) {
    return (
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '2.5rem 0 4rem',
        }}
      >
        <p>Cargando productos de la tienda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '2.5rem 0 4rem',
        }}
      >
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '2.5rem 0 4rem',
      }}
    >
      <header
        style={{
          marginBottom: '1.5rem',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '0.25rem',
            color: '#111827',
          }}
        >
          Tienda en línea
        </h1>
        <p
          style={{
            margin: 0,
            color: '#4B5563',
            fontSize: '0.98rem',
          }}
        >
          Elige entre terapias y productos para complementar tu experiencia.
        </p>
      </header>

      {/* Sección de Terapias */}
      <section
        style={{
          marginBottom: '2.5rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.4rem',
            marginBottom: '0.75rem',
            color: '#111827',
          }}
        >
          Terapias
        </h2>

        {terapias.length === 0 && (
          <p
            style={{
              margin: 0,
              color: '#6B7280',
              fontSize: '0.95rem',
            }}
          >
            No hay terapias disponibles por el momento.
          </p>
        )}

        {terapias.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {terapias.map((p) => {
              const agotado = p.estado === 'AGOTADO' || p.stock <= 0;

              return (
                <article
                  key={p.id}
                  style={{
                    borderRadius: '1rem',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    padding: '1.25rem 1.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    boxShadow:
                      '0 18px 35px rgba(15, 23, 42, 0.06), 0 4px 10px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  {p.imagenUrl && (
                    <img
                      src={p.imagenUrl}
                      alt={p.nombre}
                      style={{
                        width: '100%',
                        maxHeight: '180px',
                        objectFit: 'cover',
                        borderRadius: '0.8rem',
                        marginBottom: '0.6rem',
                      }}
                    />
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          marginBottom: '0.2rem',
                          color: '#111827',
                        }}
                      >
                        {p.nombre}
                      </h3>
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '0.15rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          backgroundColor: '#A2E4B8',
                          color: '#111827',
                          fontSize: '0.75rem',
                        }}
                      >
                        Terapia
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        color: '#111827',
                      }}
                    >
                      ${p.precio} MXN
                    </p>
                  </div>

                  {p.descripcion && (
                    <p
                      style={{
                        margin: 0,
                        color: '#4B5563',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {p.descripcion}
                    </p>
                  )}

                  <div
                    style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.85rem',
                        color: agotado ? '#b91c1c' : '#4B5563',
                      }}
                    >
                      {agotado
                        ? 'No disponible temporalmente'
                        : `Lugares disponibles: ${p.stock}`}
                    </span>

                    <button
                      disabled={agotado}
                      onClick={() =>
                        onAgregarAlCarrito({
                          id: p.id,
                          nombre: p.nombre,
                          precio: p.precio,
                        })
                      }
                      style={{
                        padding: '0.55rem 1.2rem',
                        borderRadius: '999px',
                        border: 'none',
                        backgroundColor: agotado ? '#e5e7eb' : '#81D8D0',
                        color: agotado ? '#9ca3af' : '#ffffff',
                        cursor: agotado ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                      }}
                    >
                      {agotado ? 'No disponible' : 'Añadir al carrito'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Sección de Productos */}
      <section>
        <h2
          style={{
            fontSize: '1.4rem',
            marginBottom: '0.75rem',
            color: '#111827',
          }}
        >
          Productos
        </h2>

        {items.length === 0 && (
          <p
            style={{
              margin: 0,
              color: '#6B7280',
              fontSize: '0.95rem',
            }}
          >
            No hay productos disponibles por el momento.
          </p>
        )}

        {items.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {items.map((p) => {
              const agotado = p.estado === 'AGOTADO' || p.stock <= 0;

              return (
                <article
                  key={p.id}
                  style={{
                    borderRadius: '1rem',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    padding: '1.25rem 1.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    boxShadow:
                      '0 18px 35px rgba(15, 23, 42, 0.06), 0 4px 10px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  {p.imagenUrl && (
                    <img
                      src={p.imagenUrl}
                      alt={p.nombre}
                      style={{
                        width: '100%',
                        maxHeight: '180px',
                        objectFit: 'cover',
                        borderRadius: '0.8rem',
                        marginBottom: '0.6rem',
                      }}
                    />
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          marginBottom: '0.2rem',
                          color: '#111827',
                        }}
                      >
                        {p.nombre}
                      </h3>
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '0.15rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          backgroundColor: '#E5E7EB',
                          color: '#111827',
                          fontSize: '0.75rem',
                        }}
                      >
                        Producto
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        color: '#111827',
                      }}
                    >
                      ${p.precio} MXN
                    </p>
                  </div>

                  {p.descripcion && (
                    <p
                      style={{
                        margin: 0,
                        color: '#4B5563',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {p.descripcion}
                    </p>
                  )}

                  <div
                    style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.85rem',
                        color: agotado ? '#b91c1c' : '#4B5563',
                      }}
                    >
                      {agotado
                        ? 'Agotado temporalmente'
                        : `Stock: ${p.stock} pzas`}
                    </span>

                    <button
                      disabled={agotado}
                      onClick={() =>
                        onAgregarAlCarrito({
                          id: p.id,
                          nombre: p.nombre,
                          precio: p.precio,
                        })
                      }
                      style={{
                        padding: '0.55rem 1.2rem',
                        borderRadius: '999px',
                        border: 'none',
                        backgroundColor: agotado ? '#e5e7eb' : '#81D8D0',
                        color: agotado ? '#9ca3af' : '#ffffff',
                        cursor: agotado ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                      }}
                    >
                      {agotado ? 'No disponible' : 'Añadir al carrito'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Resumen simple de carrito en esta vista */}
      <section
        style={{
          marginTop: '2.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <h2
          style={{
            fontSize: '1.2rem',
            marginBottom: '0.75rem',
            color: '#111827',
          }}
        >
          Carrito
        </h2>
        {carrito.length === 0 && <p>No hay productos en el carrito</p>}
        {carrito.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            {carrito.map((item) => (
              <div key={item.id}>
                {item.nombre} x {item.cantidad} = $
                {item.precio * item.cantidad}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TiendaProductos;