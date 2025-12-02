<template>
  <div class="card">
    <h2 class="title">Registro de Campañas</h2>

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

      <div class="input-group">
        <label for="distrito">ID Distrito</label>
        <input v-model="idDistrito" type="number" id="distrito" required />
      </div>
    </div>

    <!-- BOTÓN GUARDAR -->
    <div class="btn-area">
      <button class="btn-guardar" @click="guardarCampania">
        Guardar
      </button>
    </div>

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

    guardarCampania() {
      const payload = {
        título: this.titulo,
        descripcion: this.descripcion,
        fechaInicio: this.fecini,
        fechaFin: this.fecfin,
        idDistrito: this.idDistrito,
        idUsuario: 1, // Provisional hasta que tengas auth
      };

      this.$api
        .post("api/campania", payload)
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: "Campaña registrada correctamente",
          });

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
</style>
