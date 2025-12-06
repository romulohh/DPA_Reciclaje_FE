<template>
  <q-layout view="hHr lpR fFf">
    <HeaderForm />

    <q-page-container>
      <q-page class="q-pa-md">
        <div class="carrito-detalle-container">
          <div class="carrito-header">
            <h2>Carrito de Compras</h2>
          </div>

          <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p>Cargando carrito...</p>
          </div>

          <div v-else-if="!carritoItems || carritoItems.length === 0" class="carrito-vacio">
            <div class="empty-icon">🛒</div>
            <h3>Tu carrito está vacío</h3>
            <p>Agrega productos para comenzar a comprar</p>
            <button class="btn-seguir-comprando" @click="$router.push('/principal')">
              Seguir Comprando
            </button>
          </div>

          <div v-else class="carrito-content">
            <div class="carrito-items">
              <div v-for="item in carritoItems" :key="item.idCarritoItem" class="carrito-item" >
                <div class="item-image">
                    <img :src="getImageUrl(item.producto.imagen)" :alt="item.producto.nombre" @error="handleImageError" />
                </div>
                <div class="item-details">
                  <h3 class="item-nombre">{{ item.producto.nombre }}</h3>
                  <p class="item-nombre">{{ item.producto.descripcion }}</p>
                </div>
                <div class="item-precio">
                  <span class="precio-label">Precio:</span>
                  <span class="precio-valor">S/ {{ formatPrecio(item.producto.precio) }}</span>
                </div>
              </div>
            </div>

            <div class="carrito-resumen">
              <div class="resumen-card">
                <h3>Resumen de Compra</h3>
                <div class="resumen-linea">
                  <span>Subtotal:</span>
                  <span>S/ {{ formatPrecio(subtotal) }}</span>
                </div>
                <div class="resumen-linea">
                  <span>Cantidad de items:</span>
                  <span>{{ carritoItems.length }}</span>
                </div>
                <div class="resumen-total">
                  <span>Total:</span>
                  <span>S/ {{ formatPrecio(total) }}</span>
                </div>
                <button class="btn-pagar" @click="handlePagar" :disabled="!carritoItems.length">
                  Pagar
                </button>
                <button class="btn-seguir-comprando-secondary" @click="$router.push('/home')">
                  Seguir Comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import HeaderForm from 'src/components/HeaderForm.vue'

export default {
  name: 'CarritoDetalle',
  components: {
    HeaderForm,
  },
  data() {
    return {
      carritoItems: [],
      loading: false,
      idUsuario: null,
      idCarrito: null,
    }
  },
  computed: {
    subtotal() {
      return this.carritoItems.reduce((sum, item) => sum + (parseFloat(item.producto.precio) || 0), 0)
    },
    total() {
      return this.subtotal
    },
  },
  mounted() {
    this.loadCarrito()
  },
  methods: {
    getImageUrl(nombreArchivo) {
      return new URL(`/src/assets/images/producto/${nombreArchivo}`, import.meta.url).href
    },
    loadCarrito() {
      this.loading = true
      let idUsuario = localStorage.getItem('idUsuario')
      let token = localStorage.getItem('token')

      if (!idUsuario) {
        this.$q.notify({
          type: 'warning',
          position: 'top',
          message: 'Debe iniciar sesión para ver su carrito',
        })
        this.$router.push('/login')
        return
      }

      let endpointURL = `api/Carrito/active/${idUsuario}`

      this.$api
        .get(endpointURL, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then((response) => {
          let data = response.data
          this.carritoItems = data[0].items
          // Procesar respuesta según estructura del backend
          // if (Array.isArray(data)) {
          //   this.carritoItems = data
          // } else if (data.items && Array.isArray(data.items)) {
          //   this.carritoItems = data.items
          //   this.idCarrito = data.idCarrito
          // } else if (data.carrito) {
          //   this.carritoItems = data.carrito.items || []
          //   this.idCarrito = data.carrito.idCarrito
          // } else {
          //   this.carritoItems = []
          // }
          console.log('Carrito cargado: ', this.carritoItems)
          console.log('Carrito productos: ', this.carritoItems[0].producto.nombre)
          // Guardar idCarrito en localStorage si viene en la respuesta
          if (this.idCarrito) {
            localStorage.setItem('idCarrito', this.idCarrito)
          }
        })
        .catch((error) => {
          const msg =
            error?.response?.data?.message ||
            error.message ||
            'Error al cargar el carrito.'
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: msg,
          })
          this.carritoItems = []
        })
        .finally(() => {
          this.loading = false
        })
    },
    formatPrecio(precio) {
      const num = parseFloat(precio) || 0
      return num.toFixed(2)
    },
    handleImageError(event) {
      event.target.src = '/assets/images/producto/default.jpg'
    },
    handlePagar() {
      this.$q.notify({
        type: 'info',
        position: 'top',
        message: 'Funcionalidad de pago en desarrollo',
      })
      // TODO: Implementar lógica de pago
    },
  },
}
</script>

<style scoped>
.carrito-detalle-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 60vh;
}

.carrito-header {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
}

.carrito-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Carrito Vacío */
.carrito-vacio {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.carrito-vacio h3 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 10px;
}

.carrito-vacio p {
  color: #64748b;
  margin-bottom: 30px;
}

/* Contenido del Carrito */
.carrito-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
  align-items: start;
}

.carrito-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.carrito-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: box-shadow 0.2s ease;
}

.carrito-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-nombre {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.item-descripcion {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

.item-precio {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.precio-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
}

.precio-valor {
  font-size: 1.25rem;
  font-weight: 700;
  color: #6366f1;
}

/* Resumen */
.carrito-resumen {
  position: sticky;
  top: 20px;
}

.resumen-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
}

.resumen-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.resumen-linea {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  color: #64748b;
  font-size: 0.875rem;
}

.resumen-total {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  margin-top: 10px;
  border-top: 2px solid #e2e8f0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

/* Botones */
.btn-pagar {
  width: 100%;
  background: #6366f1;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
}

.btn-pagar:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-pagar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-seguir-comprando,
.btn-seguir-comprando-secondary {
  width: 100%;
  background: white;
  border: 2px solid #6366f1;
  border-radius: 8px;
  padding: 12px 24px;
  color: #6366f1;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;
}

.btn-seguir-comprando:hover,
.btn-seguir-comprando-secondary:hover {
  background: #f8f9ff;
}

/* Responsive */
@media (max-width: 768px) {
  .carrito-content {
    grid-template-columns: 1fr;
  }

  .carrito-resumen {
    position: static;
  }

  .carrito-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .item-precio {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
