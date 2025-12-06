<template>
  <div class="card">
    <!-- BOTÓN QUE ABRE EL DIALOG -->
    <q-btn color="primary" label="Registrar nuevo producto" @click="abrirNuevo" />

    <!-- DIALOG -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 60%; max-width: 900px;">
        <q-card-section>
          <h3 class="title">{{ isEditing ? 'Editar Producto' : 'Registrar Producto' }}</h3>
        </q-card-section>

        <q-card-section>
          <!-- AQUÍ VA TU FORMULARIO (SIN CAMBIAR CAMPOS) -->
          <form class="login-form" @submit.prevent="guardarProducto" novalidate>
            <div class="form-group">
              <div class="input-wrapper">
                <input
                  v-model="nombre"
                  :class="{ 'has-value': !!nombre }"
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  autocomplete="name"
                />
                <label for="nombre">Nombre</label>
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <input
                  v-model="descripcion"
                  :class="{ 'has-value': !!descripcion }"
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  required
                />
                <label for="descripcion">Descripción</label>
              </div>
            </div>

            <div style="display:flex; gap:16px;">
              <div class="form-group" style="flex:1;">
                <div class="input-wrapper">
                  <input
                    v-model.number="precio"
                    :class="{ 'has-value': !!precio }"
                    type="number"
                    id="precio"
                    name="precio"
                    step="0.01"
                    required
                  />
                  <label for="precio">Precio</label>
                </div>
              </div>

              <div class="form-group" style="flex:1;">
                <div class="input-wrapper">
                  <input
                    v-model.number="cantidad"
                    :class="{ 'has-value': !!cantidad }"
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    required
                  />
                  <label for="cantidad">Cantidad</label>
                </div>
              </div>
            </div>

            <div class="form-group" style="flex:1;">
              <div class="input-wrapper">
                <input v-model="marca"
                :class="{ 'has-value': !!marca }"
                type="text" id="marca" name="marca" />
                <label for="marca">Marca</label>
              </div>
            </div>

            <div style="display:flex; gap:16px;">
              <div class="form-group" style="flex:1;">
                <div class="input-wrapper">
                  <select
                    v-model="categoriaId"
                    :class="{ 'has-value': !!categoriaId }"
                    id="categoria"
                    name="categoria"
                    :disabled="loadingCategories"
                  >
                    <option value="">
                      {{ loadingCategories ? 'Cargando categorías...' : 'Seleccione categoría' }}
                    </option>
                    <option
                      v-for="c in categorias"
                      :key="c.id"
                      :value="c.id"
                    >
                      {{ c.nombre || (c.raw && (c.raw.Nombre || c.raw.nombre)) || 'Sin nombre' }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div style="display:flex; gap:16px;">
              <div class="form-group" style="flex:1;">
                <div class="input-wrapper">
                  <select
                    v-model="disponible"
                    :class="{ 'has-value': !!disponible }"
                    id="disponible"
                    name="disponible"
                  >
                    <option value="D">Disponible</option>
                    <option value="X">No disponible</option>
                  </select>
                </div>
              </div>

              <div class="form-group" style="flex:1;">
                <div class="input-wrapper">
                  <select
                    v-model="estado"
                    :class="{ 'has-value': !!estado }"
                    id="estado"
                    name="estado"
                  >
                    <option value="N">Nuevo</option>
                    <option value="U">Usado</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label style="margin-bottom: 6px; display:block;">Imágenes del producto (1 a 3)</label>
              <input
                ref="imagenesInput"
                type="file"
                accept="image/*"
                multiple
                @change="onImagesSelected"
              />
              <small v-if="imagenError" class="error-text">{{ imagenError }}</small>

              <div v-if="imagenesPreview.length" class="image-preview-container">
                <img
                  v-for="(src, index) in imagenesPreview"
                  :key="index"
                  :src="src"
                  class="image-preview"
                />
              </div>
            </div>
          </form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="cerrarDialog" />
          <q-btn
            :label="isEditing ? 'Actualizar' : 'Guardar'"
            color="primary"
            @click="guardarProducto"
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- LISTADO -->
    <h2 class="title" style="margin-top: 40px;">Listado de Productos</h2>

    <div v-if="loadingLista" class="loading">Cargando productos...</div>

    <table v-if="!loadingLista && productos.length" class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Categoría</th>
          <th>Estado</th>
          <th>Disponible</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in productos" :key="p.idProducto || p.id">
          <td>{{ p.idProducto || p.id }}</td>
          <td>{{ p.nombre || p.Nombre }}</td>
          <td>{{ p.descripcion || p.Descripcion }}</td>
          <td>{{ p.precio ?? p.Precio }}</td>
          <td>
            {{ p.categoriaNombre
              || (p.categoria && (p.categoria.nombre || p.categoria.Nombre))
              || '-' }}
          </td>
          <td>{{ p.estado || p.Estado }}</td>
          <td>{{ p.disponible || p.Disponible }}</td>
          <td>
            <div style="display:flex; gap:6px;">
              <q-btn
                dense flat round
                color="primary"
                icon="edit"
                @click="editarProducto(p)"
              />
              <q-btn
                dense flat round
                color="negative"
                icon="delete"
                @click="eliminarProducto(p.idProducto || p.id)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loadingLista && !productos.length" class="empty">
      No se encontraron productos.
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductoForm',
  data () {
    return {
      // formulario
      nombre: '',
      descripcion: '',
      marca: '',
      precio: null,
      cantidad: null,
      categoriaId: '',
      categorias: [],
      loadingCategories: false,
      disponible: 'D',
      estado: 'N',
      loading: false,

      // imágenes
      imagenesArchivo: [],
      imagenesPreview: [],
      imagenError: '',

      // listado
      productos: [],
      loadingLista: false,

      // dialog / edición
      dialog: false,
      isEditing: false,
      editingId: null
    }
  },
  methods: {
    // === COMBOS ===
    fetchCategorias () {
      this.loadingCategories = true
      this.$api
        .get('api/Categoria')
        .then((res) => {
          const raw = Array.isArray(res.data) ? res.data : []
          this.categorias = raw
            .map((it) => {
              return {
                id: it.id ?? it.Id ?? it.idCategoria ?? it.IdCategoria ?? it.id_categoria ?? null,
                nombre:
                  it.nombre ?? it.Nombre ?? it.nombreCategoria ?? it.NombreCategoria ?? it.descripcion ?? '',
                raw: it
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

    // === LISTADO ===
    getProductos () {
      this.loadingLista = true
      this.$api
        .get('api/Producto')
        .then((res) => {
          this.productos = Array.isArray(res.data) ? res.data : []
        })
        .catch((err) => {
          const msg = err?.response?.data?.message || err.message || 'No se pudieron cargar productos.'
          this.$q.notify({ type: 'negative', position: 'top', message: msg })
          console.error('Error fetching productos:', err)
          this.productos = []
        })
        .finally(() => {
          this.loadingLista = false
        })
    },

    // === IMÁGENES ===
    onImagesSelected (event) {
      this.imagenError = ''
      const files = Array.from(event.target.files || [])

      if (files.length === 0) {
        this.imagenesArchivo = []
        this.imagenesPreview = []
        // para edición podrías no obligar, así que no marcamos error aquí
        return
      }

      if (files.length > 3) {
        this.imagenError = 'Solo puede seleccionar hasta 3 imágenes. Se tomarán las 3 primeras.'
      }

      this.imagenesArchivo = files.slice(0, 3)
      this.imagenesPreview = this.imagenesArchivo.map((file) => URL.createObjectURL(file))
    },

    // === CRUD PRODUCTO ===
    async guardarProducto () {
      // Validaciones básicas
      if (!this.nombre || !this.descripcion || !this.categoriaId) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: 'Completa los campos obligatorios.'
        })
        return
      }

      // Para NUEVO: imágenes obligatorias (1 a 3)
      if (!this.isEditing) {
        if (!this.imagenesArchivo.length) {
          this.imagenError = 'Debe adjuntar al menos una imagen.'
          return
        }
        if (this.imagenesArchivo.length > 3) {
          this.imagenError = 'Solo puede adjuntar hasta 3 imágenes.'
          return
        }
      }

      this.loading = true
      this.imagenError = ''

      try {
        const payload = {
          Nombre: this.nombre,
          Descripcion: this.descripcion,
          Marca: this.marca || null,
          Precio: this.precio,
          Cantidad: this.cantidad,
          Motivo: 'V', // Venta
          IdCategoria: this.categoriaId ? Number(this.categoriaId) : null,
          Estado: String(this.estado), // N / U
          Disponible: String(this.disponible),
          IdUsuario: localStorage.getItem('idUsuario')
        }

        // === MODO EDICIÓN ===
        if (this.isEditing && this.editingId != null) {
          await this.$api.put(`api/Producto/${this.editingId}`, payload)

          // Si el usuario seleccionó nuevas imágenes, las subimos
          if (this.imagenesArchivo.length) {
            const formData = new FormData()
            this.imagenesArchivo.forEach((file) => {
              formData.append('files', file)
            })

            await this.$api.post(`api/Producto/${this.editingId}/imagenes`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
          }

          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Producto actualizado correctamente.'
          })
        } else {
          // === NUEVO PRODUCTO ===
          const res = await this.$api.post('api/Producto', payload)
          const data = res.data || {}
          const idProducto = data.idProducto || data.id || null

          if (!idProducto) {
            throw new Error('No se recibió el ID del producto desde el servidor.')
          }

          const formData = new FormData()
          this.imagenesArchivo.forEach((file) => {
            formData.append('files', file)
          })

          await this.$api.post(`api/Producto/${idProducto}/imagenes`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })

          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Producto e imágenes guardados correctamente.'
          })
        }

        this.cerrarDialog()
        this.getProductos()
      } catch (err) {
        console.error('Error en guardarProducto:', err)
        const msg = err?.response?.data?.message || err.message || 'Error al guardar producto.'
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: msg
        })
      } finally {
        this.loading = false
      }
    },

    editarProducto (p) {
      this.isEditing = true
      this.editingId = p.idProducto || p.id || p.IdProducto || null

      this.nombre = p.nombre || p.Nombre || ''
      this.descripcion = p.descripcion || p.Descripcion || ''
      this.marca = p.marca || p.Marca || ''
      this.precio = p.precio ?? p.Precio ?? null
      this.cantidad = p.cantidad ?? p.Cantidad ?? null
      this.categoriaId =
        p.idCategoria || p.IdCategoria || (p.categoria && (p.categoria.id || p.categoria.Id)) || ''
      this.estado = p.estado || p.Estado || 'N'
      this.disponible = p.disponible || p.Disponible || 'D'

      // En edición no cargamos previews de imágenes antiguas (podrías extenderlo luego)
      this.imagenesArchivo = []
      this.imagenesPreview = []
      this.imagenError = ''

      this.dialog = true
    },

    eliminarProducto (id) {
      this.$q
        .dialog({
          title: 'Eliminar producto',
          message: '¿Está seguro de que desea eliminar este producto?',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$api
            .delete(`api/Producto/${id}`)
            .then(() => {
              this.$q.notify({ type: 'positive', message: 'Producto eliminado correctamente.' })
              this.getProductos()
            })
            .catch((err) => {
              const msg = err?.response?.data?.message || err.message || 'Error al eliminar producto.'
              this.$q.notify({ type: 'negative', message: msg })
              console.error(err)
            })
        })
    },

    abrirNuevo () {
      this.limpiarFormulario()
      this.isEditing = false
      this.editingId = null
      this.dialog = true
    },

    cerrarDialog () {
      this.dialog = false
      this.limpiarFormulario()
    },

    limpiarFormulario () {
      this.nombre = ''
      this.descripcion = ''
      this.marca = ''
      this.precio = null
      this.cantidad = null
      this.categoriaId = ''
      this.disponible = 'D'
      this.estado = 'N'

      this.imagenesArchivo = []
      this.imagenesPreview = []
      this.imagenError = ''

      if (this.$refs.imagenesInput) {
        this.$refs.imagenesInput.value = null
      }

      this.isEditing = false
      this.editingId = null
    }
  },
  mounted () {
    this.fetchCategorias()
    this.getProductos()
  }
}
</script>

<style>
/* Puedes reutilizar parte del estilo de campañas para card / table, y tu estilo de form */

/* CARD PRINCIPAL (como campañas) */
.card {
  background: white;
  width: 100%;
  min-width: 900px;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  margin: 40px auto;
}

.title {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #1e293b;
}

/* TABLA LISTADO (copiado de campañas) */
.tabla {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.tabla th {
  background: #f1f5f9;
  padding: 10px;
  font-weight: 600;
  color: #334155;
}

.tabla td {
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.tabla tr:hover {
  background: #f8fafc;
}

.loading,
.empty {
  text-align: center;
  padding: 1rem;
}

/* === TUS ESTILOS DE FORMULARIO ORIGINALES === */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }

.login-form { margin-top: 10px; }

.form-group { margin-bottom: 16px; }
.input-wrapper { position: relative; display: flex; flex-direction: column; }
.input-wrapper input, .input-wrapper select {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  outline: none;
}
.input-wrapper label {
  position: absolute;
  left: 16px;
  top: 12px;
  color: #64748b;
  font-size: 16px;
  transition: all 0.2s ease;
  pointer-events: none;
}
.input-wrapper input:focus + label,
.input-wrapper input.has-value + label,
.input-wrapper select:focus + label {
  transform: translateY(-8px) scale(0.675);
  color: #6366f1;
}

.image-preview-container {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.image-preview {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.error-text {
  color: #e53935;
  font-size: 12px;
}
</style>
