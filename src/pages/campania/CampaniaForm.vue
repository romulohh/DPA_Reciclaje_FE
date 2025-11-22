<template>

  <div class="formulario">
    <label for="titulo">Título</label>
    <input v-model="titulo" type="text" id="titulo" name="titulo" required autocomplete="titulo" />
    
    <label for="descripcion">descripcion</label>
    <input v-model="descripcion" type="text" id="descripcion" name="descripcion" required autocomplete="descripcion" />
    
    <label for="fecini">Fecha Inicio</label>
    <input v-model="fecini" type="date" id="fecini" name="fecini" required autocomplete="fecini" />
    
    <label for="fecfin">Fecha Fin</label>
    <input v-model="fecfin" type="date" id="fecfin" name="fecfin" required autocomplete="fecfin" />
    
  </div>

</template>
<style>
/* Basic Login Form - Clean & Simple */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  line-height: 1.6;
  color: #334155;
}

.formulario {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1em;
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
