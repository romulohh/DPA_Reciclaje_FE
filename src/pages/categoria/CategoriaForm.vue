<template>
  <div class="card">
    <!-- BOTÓN QUE ABRE EL DIALOG -->
    <q-btn color="primary" label="Registrar nueva categoría" @click="abrirNuevo" />

    <!-- DIALOG -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 40%; max-width: 500px;">
        <q-card-section>
          <h3 class="title">{{ isEditing ? 'Editar Categoría' : 'Registrar Categoría' }}</h3>
        </q-card-section>

        <q-card-section>
          <form @submit.prevent="guardarCategoria">
            <div class="form-group">
              <div class="input-wrapper">
                <input
                  v-model="nombre"
                  :class="{ 'has-value': !!nombre }"
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                />
                <label for="nombre">Nombre</label>
              </div>
            </div>
          </form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="cerrarDialog" />
          <q-btn
            :label="isEditing ? 'Actualizar' : 'Guardar'"
            color="primary"
            @click="guardarCategoria"
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- LISTADO -->
    <h2 class="title" style="margin-top: 40px;">Listado de Categorías</h2>

    <div v-if="loadingLista" class="loading">Cargando categorías...</div>

    <table v-if="!loadingLista && categoriasLista.length" class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th style="width: 130px;">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in categoriasLista" :key="c.idCategoria || c.IdCategoria">
          <td>{{ c.idCategoria || c.IdCategoria }}</td>
          <td>{{ c.nombre || c.Nombre }}</td>
          <td>
            <div style="display:flex; gap:6px;">
              <q-btn
                dense flat round
                color="primary"
                icon="edit"
                @click="editarCategoria(c)"
              />
              <q-btn
                dense flat round
                color="negative"
                icon="delete"
                @click="eliminarCategoria(c.idCategoria || c.IdCategoria)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loadingLista && !categoriasLista.length" class="empty">
      No se encontraron categorías.
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoriaForm',
  data () {
    return {
      nombre: '',
      categoriasLista: [],
      loading: false,
      loadingLista: false,

      dialog: false,
      isEditing: false,
      editingId: null
    }
  },
  methods: {
    // === LISTADO ===
    getCategorias () {
      this.loadingLista = true
      this.$api
        .get('api/Categoria')
        .then((res) => {
          this.categoriasLista = Array.isArray(res.data) ? res.data : []
        })
        .catch((err) => {
          const msg = err?.response?.data?.message || err.message || 'No se pudieron cargar categorías.'
          this.$q.notify({ type: 'negative', position: 'top', message: msg })
          console.error('Error fetching categorias:', err)
          this.categoriasLista = []
        })
        .finally(() => {
          this.loadingLista = false
        })
    },

    // === CRUD CATEGORÍA ===
    async guardarCategoria () {
      if (!this.nombre) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: 'El nombre es obligatorio.'
        })
        return
      }

      this.loading = true
      try {
        const payload = { nombre: this.nombre }

        if (this.isEditing && this.editingId != null) {
          // PUT api/Categoria/{id}
          await this.$api.put(`api/Categoria/${this.editingId}`, payload)
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Categoría actualizada correctamente.'
          })
        } else {
          // POST api/Categoria
          await this.$api.post('api/Categoria', payload)
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Categoría registrada correctamente.'
          })
        }

        this.cerrarDialog()
        this.getCategorias()
      } catch (err) {
        const msg = err?.response?.data?.message || err.message || 'Error al guardar categoría.'
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: msg
        })
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    editarCategoria (cat) {
      this.isEditing = true
      this.editingId = cat.idCategoria || cat.IdCategoria || null
      this.nombre = cat.nombre || cat.Nombre || ''
      this.dialog = true
    },

    eliminarCategoria (id) {
      this.$q.dialog({
        title: 'Eliminar categoría',
        message: '¿Está seguro de que desea eliminar esta categoría?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api
          .delete(`api/Categoria/${id}`)
          .then(() => {
            this.$q.notify({ type: 'positive', message: 'Categoría eliminada correctamente.' })
            this.getCategorias()
          })
          .catch((err) => {
            const msg = err?.response?.data?.message || err.message || 'Error al eliminar categoría.'
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
      this.isEditing = false
      this.editingId = null
    }
  },
  mounted () {
    this.getCategorias()
  }
}
</script>

<style>
/* Reutilizo estilos de Product/Campaña para que se vea igual */

/* CARD PRINCIPAL */
.card {
  background: white;
  width: 100%;
  min-width: 600px;
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

/* TABLA LISTADO */
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

/* FORMULARIO SENCILLO CON LABEL FLOTANTE (igual que productos) */
.form-group { margin-bottom: 16px; }
.input-wrapper { position: relative; display: flex; flex-direction: column; }
.input-wrapper input {
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
.input-wrapper input.has-value + label {
  transform: translateY(-8px) scale(0.675);
  color: #6366f1;
}
</style>
