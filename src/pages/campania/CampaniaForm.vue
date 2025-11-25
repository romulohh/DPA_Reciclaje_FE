<template>
  <div class="card">
    <h2 class="title">Registro de Campañas</h2>

    <!-- BOTÓN QUE ABRE EL DIALOG -->
    <div class="btn-area">
      <q-btn color="primary" label="Registrar campaña" @click="dialog = true" />
    </div>

    <!-- DIALOG -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 50%; padding: 20px;">
        <q-card-section>
          <h3 class="title">Registrar Campaña</h3>
        </q-card-section>

        <q-card-section>
          <!-- FORMULARIO -->
          <div class="formulario">
            <div class="input-group">
              <label for="titulo">Título</label>
              <input v-model="titulo" type="text" id="titulo" required />
            </div>

            <div class="input-group">
              <label for="descripcion">Descripción</label>
              <input v-model="descripcion" type="text" id="descripcion" required />
            </div>

            <div class="input-group">
              <label for="fecini">Fecha Inicio</label>
              <input v-model="fecini" type="date" id="fecini" required />
            </div>

            <div class="input-group">
              <label for="fecfin">Fecha Fin</label>
              <input v-model="fecfin" type="date" id="fecfin" required />
            </div>

            <!-- DEPARTAMENTO -->
            <div class="input-group">
              <label for="departamento">Departamento</label>
              <select 
                id="departamento" 
                v-model="departamentoSeleccionado" 
                @change="onDepartamentoChange"
              >
                <option value="">Seleccione departamento</option>
                <option 
                  v-for="d in departamentos" 
                  :key="d.idDepartamento" 
                  :value="d.idDepartamento"
                >
                  {{ d.nombre }}
                </option>
              </select>
            </div>

            <!-- PROVINCIA -->
            <div class="input-group">
              <label for="provincia">Provincia</label>
              <select 
                id="provincia" 
                v-model="provinciaSeleccionada" 
                @change="onProvinciaChange"
                :disabled="!provincias.length"
              >
                <option value="">Seleccione provincia</option>
                <option 
                  v-for="p in provincias" 
                  :key="p.idProvincia" 
                  :value="p.idProvincia"
                >
                  {{ p.nombre }}
                </option>
              </select>
            </div>

            <!-- DISTRITO -->
            <div class="input-group">
              <label for="distrito">Distrito</label>
              <select 
                id="distrito" 
                v-model="distritoSeleccionado"
                :disabled="!distritos.length"
              >
                <option value="">Seleccione distrito</option>
                <option 
                  v-for="t in distritos" 
                  :key="t.idDistrito" 
                  :value="t.idDistrito"
                >
                  {{ t.nombre }}
                </option>
              </select>
            </div>


            
            
          </div>
        </q-card-section>

        <!-- BOTONES -->
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="dialog = false" />
          <q-btn label="Guardar" color="primary" @click="guardarCampania" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- LISTADO -->
    <h2 class="title" style="margin-top: 40px;">Listado de Campañas</h2>

    <div v-if="loading" class="loading">Cargando campañas...</div>

    <table v-if="!loading && campanias.length > 0" class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Descripción</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>ID Distrito</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in campanias" :key="item.idCampania">
          <td>{{ item.idCampania }}</td>
          <td>{{ item.título }}</td>
          <td>{{ item.descripcion }}</td>
          <td>{{ formatFecha(item.fechaInicio) }}</td>
          <td>{{ formatFecha(item.fechaFin) }}</td>
          <td>{{ item.idDistrito }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loading && campanias.length === 0" class="empty">
      No se encontraron campañas.
    </div>
  </div>
</template>

<script>
export default {
  name: "CampaniaForm",

  data() {
    return {
      // formulario
      titulo: "",
      descripcion: "",
      fecini: "",
      fecfin: "",
      idDistrito: 0,

      // tabla
      campanias: [],
      loading: false,
      dialog: false ,

      departamentos: [],
      provincias: [],
      distritos: [],
      departamentoSeleccionado: '',
      provinciaSeleccionada: '',
      distritoSeleccionado: '',
    };
  },

  methods: {
    getCampanias() {
      this.loading = true;
      this.$api
        .get("api/campania")
        .then((response) => {
          this.campanias = response.data;
        })
        .catch((err) => console.error(err))
        .finally(() => (this.loading = false));
    },

    // lenar los combos
    fetchDepartamentos() {
      this.$api
        .get('api/Departamento')
        .then((res) => {
          this.departamentos = Array.isArray(res.data) ? res.data : []
        })
        .catch((err) => {
          const msg = err?.response?.data?.message || err.message || 'No se pudieron cargar departamentos.'
          this.$q.notify({ type: 'negative', position: 'top', message: msg })
        })
    },
    fetchProvincias() {
      if (!this.departamentoSeleccionado) {
        this.provincias = []
        return
      }
      // Intentar pedir al backend filtrando por idDepartamento
      this.$api
        .get('api/Provincia/byDepartamento/' + this.departamentoSeleccionado )
        .then((res) => {
          this.provincias = Array.isArray(res.data) ? res.data : []
        })
        .catch((err) => {
          // fallback: intentar cargar todo y filtrar (por si backend no soporta param)
          this.$api
            .get('api/Provincia')
            .then((r) => {
              const all = Array.isArray(r.data) ? r.data : []
              this.provincias = all.filter((p) => String(p.idDepartamento) === String(this.departamentoSeleccionado))
            })
            .catch(() => {
              const msg = err?.response?.data?.message || err.message || 'No se pudieron cargar provincias.'
              this.$q.notify({ type: 'negative', position: 'top', message: msg })
            })
        })
    },
    fetchDistritos() {
      if (!this.provinciaSeleccionada) {
        this.distritos = []
        return
      }
      this.$api
        .get('api/Distrito/byProvincia/' + this.provinciaSeleccionada )
        .then((res) => {
          this.distritos = Array.isArray(res.data) ? res.data : []
        })
        .catch((err) => {
          // fallback: cargar todo y filtrar
          this.$api
            .get('api/Distrito')
            .then((r) => {
              const all = Array.isArray(r.data) ? r.data : []
              this.distritos = all.filter((t) => String(t.idProvincia) === String(this.provinciaSeleccionada))
            })
            .catch(() => {
              const msg = err?.response?.data?.message || err.message || 'No se pudieron cargar distritos.'
              this.$q.notify({ type: 'negative', position: 'top', message: msg })
            })
        })
    },

    // cambiar la direccion
    onDepartamentoChange() {
      this.provinciaSeleccionada = ''
      this.distritoSeleccionado = ''
      this.provincias = []
      this.distritos = []
      this.fetchProvincias()
    },

    onProvinciaChange() {
      this.distritoSeleccionado = ''
      this.distritos = []
      this.fetchDistritos()
    },

    guardarCampania() {
      const payload = {
        título: this.titulo,
        descripcion: this.descripcion,
        fechaInicio: this.fecini,
        fechaFin: this.fecfin,
        idDistrito: this.distritoSeleccionado,
        idUsuario: 1, // Provisional hasta que tengas auth
      };

      this.$api
        .post("api/campania", payload)
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: "Campaña registrada correctamente",
          });

          this.dialog = false;
          this.limpiarFormulario();
          this.getCampanias();
        })
        .catch((err) => {
          this.$q.notify({
            type: "negative",
            message: "Error al registrar campaña",
          });
          console.error(err);
        });
    },

    limpiarFormulario() {
      this.titulo = "";
      this.descripcion = "";
      this.fecini = "";
      this.fecfin = "";
      this.idDistrito = 0;
    },

    formatFecha(fecha) {
      return fecha ? fecha.split("T")[0] : "";
    },
  },

  mounted() {
    this.getCampanias();
    this.fetchDepartamentos();
  },
};
</script>

<style>
/* -------- RESET --------- */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", sans-serif;
  background: #f1f5f9;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #334155;
}

.card {
  background: white;
  width: 100%;
  min-width: 900px;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #1e293b;
}

.formulario {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 6px;
  color: #475569;
}

input {
  padding: 0.7rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

input:focus {
  border-color: #6366f1;
}

.btn-area {
  margin-top: 20px;
  text-align: center;
}

.btn-guardar {
  background: #4f46e5;
  border: none;
  padding: 10px 25px;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-guardar:hover {
  background: #4338ca;
}

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

/* -------- ESTILO PARA SELECT (COMBOBOX) -------- */
select {
  padding: 0.7rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #334155;
}

select:focus {
  border-color: #6366f1;
  outline: none;
}

select:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

/* Para que se vea igual cuando el mouse está encima */
select:hover:not(:disabled) {
  border-color: #94a3f6;
}

</style>
