<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Producto</h2>
        <p>Gestiona la información del producto</p>
      </div>

      <form class="login-form" @submit.prevent="guardarProducto" novalidate>
        <div class="form-group">
          <div class="input-wrapper">
            <input v-model="nombre" type="text" id="nombre" name="nombre" required autocomplete="name" />
            <label for="nombre">Nombre</label>
          </div>
        </div>

        <div class="form-group">
          <div class="input-wrapper">
            <input v-model="descripcion" type="text" id="descripcion" name="descripcion" required />
            <label for="descripcion">Descripción</label>
          </div>
        </div>

        <div style="display:flex; gap:16px;">
          <div class="form-group" style="flex:1;">
            <div class="input-wrapper">
              <input v-model.number="precio" type="number" id="precio" name="precio" step="0.01" required />
              <label for="precio">Precio</label>
            </div>
          </div>

          <div class="form-group" style="flex:1;">
            <div class="input-wrapper">
              <input v-model.number="cantidad" type="number" id="cantidad" name="cantidad" required />
              <label for="cantidad">Cantidad</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <div class="input-wrapper">
            <select v-model="categoriaId" id="categoria" name="categoria" :disabled="loadingCategories">
              <option value="">{{ loadingCategories ? 'Cargando categorías...' : 'Seleccione categoría' }}</option>
              <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre || (c.raw && (c.raw.Nombre || c.raw.nombre)) || 'Sin nombre' }}</option>
            </select>
          </div>
        </div>

        <div style="display:flex; gap:16px;">
          <div class="form-group" style="flex:1;">
            <div class="input-wrapper">
              <input v-model="marca" type="text" id="marca" name="marca" />
              <label for="marca">Marca</label>
            </div>
          </div>

          <div class="form-group" style="flex:1;">
            <div class="input-wrapper">
              <select v-model="disponible" id="disponible" name="disponible">
                <option value="1">Disponible</option>
                <option value="0">No disponible</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-group">
          <div class="input-wrapper">
            <input v-model="motivo" type="text" id="motivo" name="motivo" />
            <label for="motivo">Motivo</label>
          </div>
        </div>

        <div class="form-group">
          <div class="input-wrapper">
            <select v-model="estado" id="estado">
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>
        </div>

        <button type="submit" class="login-btn" :class="{ loading: loading }">
          <span class="btn-text">Guardar</span>
          <span class="btn-loader"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<style>
/* Reuse styles from auth pages for consistent look */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
.login-container { width: 100%; max-width: 700px; margin: 40px auto; }
.login-card { background: white; border-radius: 12px; padding: 28px; border: 1px solid #e2e8f0; }
.login-header { text-align: center; margin-bottom: 20px; }
.form-group { margin-bottom: 16px; }
.input-wrapper { position: relative; display: flex; flex-direction: column; }
.input-wrapper input, .input-wrapper select { background: white; border: 2px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; font-size: 16px; outline: none; }
.input-wrapper label { position: absolute; left: 16px; top: 12px; color: #64748b; font-size: 16px; transition: all 0.2s ease; pointer-events: none; }
.input-wrapper input:focus + label, .input-wrapper input.has-value + label, .input-wrapper select:focus + label { transform: translateY(-8px) scale(0.675); color: #6366f1; }
.login-btn { width: 100%; background: #6366f1; border: none; border-radius: 8px; padding: 12px 24px; color: white; font-size: 16px; font-weight: 600; cursor: pointer; position: relative; }
.login-btn.loading { pointer-events: none; background: #a5a6f6; }
.btn-loader { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid white; border-radius: 50%; opacity: 0; animation: spin 1s linear infinite; }
.login-btn.loading .btn-loader { opacity: 1; }
@keyframes spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
</style>

<script>
export default {
  name: 'ProductoForm',
  data() {
    return {
      nombre: '',
      descripcion: '',
      marca: '',
      precio: null,
      cantidad: null,
      motivo: '',
      categoriaId: '',
      categorias: [],
      loadingCategories: false,
      estado: 'A',
      disponible: '1',
      loading: false,
    }
  },
  methods: {
    fetchCategorias() {
      this.loadingCategories = true
      this.$api
        .get('api/Categoria')
        .then((res) => {
          const raw = Array.isArray(res.data) ? res.data : []
          // Normalizar posibles nombres de propiedades desde el backend y filtrar ids vacíos
          this.categorias = raw
            .map((it) => {
              return {
                id: it.id ?? it.Id ?? it.idCategoria ?? it.IdCategoria ?? it.id_categoria ?? null,
                nombre:
                  it.nombre ?? it.Nombre ?? it.nombreCategoria ?? it.NombreCategoria ?? it.descripcion ?? '',
                raw: it,
              }
            })
            .filter((c) => c.id !== null && c.id !== undefined)
        })
        .catch((err) => {
          const msg = err?.response?.data?.message || err.message || 'No se pudieron cargar categorías.'
          this.$q.notify({ type: 'negative', position: 'top', message: msg })
          console.error('Error fetching categorias:', err)
          this.categorias = []
        })
        .finally(() => {
          this.loadingCategories = false
        })
    },
    guardarProducto() {
      this.loading = true
      const payload = {
        Nombre: this.nombre,
        Descripcion: this.descripcion,
        Marca: this.marca || null,
        Precio: this.precio,
        Cantidad: this.cantidad,
        Motivo: this.motivo || null,
        IdCategoria: this.categoriaId ? Number(this.categoriaId) : null,
        // Guardar Estado como '1' (activo) o '0' (inactivo)
        Estado: String(this.estado),
        Disponible: String(this.disponible),
      }

      // Usamos el ProductoController en el backend: api/Producto
      this.$api.post('api/Producto', payload)
        .then(() => {
          this.$q.notify({ type: 'positive', position: 'top', message: 'Producto guardado correctamente.' })
          // limpiar formulario
          this.nombre = ''
          this.descripcion = ''
          this.marca = ''
          this.precio = null
          this.cantidad = null
          this.motivo = ''
          this.categoriaId = ''
          this.estado = 'A'
          this.disponible = '1'
        })
        .catch((err) => {
          const msg = err?.response?.data?.message || err.message || 'Error al guardar producto.'
          this.$q.notify({ type: 'negative', position: 'top', message: msg })
        })
        .finally(() => { this.loading = false })
    }
  },
  mounted() {
    this.fetchCategorias()
  }
}
</script>
