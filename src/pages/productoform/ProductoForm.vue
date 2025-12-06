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

        <div style="display:flex; gap:16px;">
          <div class="form-group" style="flex:1;">
          <div class="input-wrapper">
            <select v-model="categoriaId" id="categoria" name="categoria" :disabled="loadingCategories">
              <option value="">{{ loadingCategories ? 'Cargando categorías...' : 'Seleccione categoría' }}</option>
              <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre || (c.raw && (c.raw.Nombre || c.raw.nombre)) || 'Sin nombre' }}</option>
            </select>
          </div>

          <div class="form-group" style="flex:1;">
            <div class="input-wrapper">
              <input v-model="marca" type="text" id="marca" name="marca" />
              <label for="marca">Marca</label>
            </div>
          </div>
          
          </div>
        </div>
        <div style="display:flex; gap:16px;">
          

          <div class="form-group" style="flex:1;">
            <div class="input-wrapper">
              <select v-model="disponible" id="disponible" name="disponible">
                <option value="D">Disponible</option>
                <option value="X">No disponible</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="flex:1;">
            <div class="input-wrapper">
              <select v-model="estado" id="estado" name="estado">
                <option value="N">Nuevo</option>
                <option value="U">Usado</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Campos Motivo y Estado eliminados; se guardan como 'V' (Venta) y 'A' (Activo) por defecto -->

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
      categoriaId: '',
      categorias: [],
      loadingCategories: false,
      disponible: 'D',
      estado: 'N',
      loading: false,

      // Manejo de imágenes
      imagenesArchivo: [],   // File[]
      imagenesPreview: [],   // URLs para mostrar en el form
      imagenError: '',       // Mensaje de validación de imágenes
    }
  },
  methods: {
    fetchCategorias() {
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

    // Manejo de selección de imágenes
    onImagesSelected(event) {
      this.imagenError = ''
      const files = Array.from(event.target.files || [])

      if (files.length === 0) {
        this.imagenesArchivo = []
        this.imagenesPreview = []
        this.imagenError = 'Debe seleccionar al menos una imagen.'
        return
      }

      if (files.length > 3) {
        this.imagenError = 'Solo puede seleccionar hasta 3 imágenes. Se tomarán las 3 primeras.'
      }

      this.imagenesArchivo = files.slice(0, 3)
      this.imagenesPreview = this.imagenesArchivo.map((file) => URL.createObjectURL(file))
      console.log('Imágenes seleccionadas:', this.imagenesArchivo)
      console.log('Previews generadas:', this.imagenesPreview)
    },

    // ⬇⬇⬇ AQUÍ VA LA LÓGICA NUEVA PARA GUARDAR PRODUCTO + IMÁGENES ⬇⬇⬇
    async guardarProducto() {
      // Validaciones básicas del formulario
      if (!this.nombre || !this.descripcion || !this.categoriaId) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: 'Completa los campos obligatorios.'
        })
        return
      }

      // Validación de imágenes (1 a 3)
      if (!this.imagenesArchivo.length) {
        this.imagenError = 'Debe adjuntar al menos una imagen.'
        return
      }
      if (this.imagenesArchivo.length > 3) {
        this.imagenError = 'Solo puede adjuntar hasta 3 imágenes.'
        return
      }

      this.loading = true
      this.imagenError = ''

      try {
        // 1) Crear el producto (sin enviar Imagen en el payload)
        const payload = {
          Nombre: this.nombre,
          Descripcion: this.descripcion,
          Marca: this.marca || null,
          Precio: this.precio,
          Cantidad: this.cantidad,
          Motivo: 'V', // Venta
          IdCategoria: this.categoriaId ? Number(this.categoriaId) : null,
          Estado: String(this.estado), // N NUEVO U USADO
          Disponible: String(this.disponible),
          IdUsuario: localStorage.getItem('idUsuario')
        }

        console.log('Payload a enviar:', payload)

        const res = await this.$api.post('api/Producto', payload)

        // El backend devuelve: { idProducto = id }
        const data = res.data || {}
        const idProducto = data.idProducto || data.id || null

        console.log('Respuesta al crear producto:', data)

        if (!idProducto) {
          throw new Error('No se recibió el ID del producto desde el servidor.')
        }

        // 2) Subir las imágenes al endpoint: POST api/Producto/{id}/imagenes
        const formData = new FormData()
        this.imagenesArchivo.forEach((file) => {
          formData.append('files', file) // "files" debe coincidir con el nombre del parámetro en el backend
        })

        const resImgs = await this.$api.post(`api/Producto/${idProducto}/imagenes`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        console.log('Respuesta al subir imágenes:', resImgs.data)

        // 3) Notificar éxito y limpiar formulario
        this.$q.notify({
          type: 'positive',
          position: 'top',
          message: 'Producto e imágenes guardados correctamente.'
        })

        // limpiar formulario
        this.nombre = ''
        this.descripcion = ''
        this.marca = ''
        this.precio = null
        this.cantidad = null
        this.categoriaId = ''
        this.disponible = '1'

        this.imagenesArchivo = []
        this.imagenesPreview = []
        this.imagenError = ''

        if (this.$refs.imagenesInput) {
          this.$refs.imagenesInput.value = null
        }
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
    }
  },
  mounted() {
    this.fetchCategorias()
  }
}
</script>

