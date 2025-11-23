<template>
  <div class="card">
    <h2 class="title">Formulario</h2>

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
    </div>
  </div>
</template>

<style>
/* -------- RESET --------- */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ---- Contenedor de página ---- */
body {
  font-family: "Inter", "Segoe UI", Roboto, sans-serif;
  background: #f1f5f9;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #334155;
}

/* ----- Card principal ----- */
.card {
  background: white;
  width: 100%;
  min-width: 800px;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.3s ease-in-out;
}

.title {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #1e293b;
}

/* ----- Formulario Grid ----- */
.formulario {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

/* ----- Labels ----- */
label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 6px;
  color: #475569;
}

/* ----- Inputs ----- */
input {
  padding: 0.7rem 0.9rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  background: #fff;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* ----- Responsive ----- */
@media (max-width: 640px) {
  .formulario {
    grid-template-columns: 1fr;
  }
}

/* ----- Animación ----- */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    IniciarSesion() {
      let endpointURL = 'api/usuario/signin'
      let payload = {
        email: this.email,
        clave: this.password,
      }
      this.$api
        .post(endpointURL, payload)
        .then((response) => {
          // Aquí puedes manejar la respuesta exitosa, como redirigir al usuario
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Inicio de sesión exitoso.',
          })
          // Guardar el token en el almacenamiento local
          localStorage.setItem('token', JSON.stringify(response.data.token))
          // Redireccionar a product
          this.$router.push('/')
        })
        .catch((error) => {
          // Aquí puedes manejar los errores, como mostrar mensajes de error al usuario
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: 'Error al iniciar sesión. ' + error.response.data.message,
          })
        })
    },
  },
}
</script>
