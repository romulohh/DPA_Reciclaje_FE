<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Registro</h2>
        <p>Complete sus datos para crear una cuenta</p>
      </div>

      <form class="login-form" id="registerForm" @submit.prevent="IniciarRegistro" novalidate>
        <div style="display: flex; gap: 16px;">
          <div class="form-group" :class="{ error: errors.nombres }">
            <div class="input-wrapper">
              <input v-model="nombres" type="text" id="nombres" name="nombres" required autocomplete="given-name" style="flex: 1;" />
              <label for="nombres">Nombres</label>
            </div>
            <span class="error-message" v-if="errors.nombres">{{ errors.nombres }}</span>
          </div>
          <div class="form-group" :class="{ error: errors.apellidos }">
            <div class="input-wrapper">
              <input v-model="apellidos" type="text" id="apellidos" name="apellidos" required autocomplete="family-name" />
              <label for="apellidos">Apellidos</label>
            </div>
            <span class="error-message" v-if="errors.apellidos">{{ errors.apellidos }}</span>
          </div>
        </div>

        <div style="display: flex; gap: 16px; justify-content: center;">
          <div class="form-group" :class="{ error: errors.email }">
            <div class="input-wrapper">
              <input v-model="email" type="email" id="email" name="email" required autocomplete="email" />
              <label for="email">Correo</label>
            </div>
            <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
          </div>

          <div class="form-group" :class="{ error: errors.clave }">
            <div class="input-wrapper password-wrapper">
              <input v-model="clave" :type="showPassword ? 'text' : 'password'" id="clave" name="clave"
                required autocomplete="new-password"/>
                <label for="clave">Clave</label>
              <button type="button" class="password-toggle" id="passwordToggle"
                aria-label="Toggle password visibility" @click="togglePassword">
                <span class="eye-icon" :class="{ 'show-password': showPassword }"></span>
              </button>
            </div>
            <span class="error-message" v-if="errors.clave">{{ errors.clave }}</span>
          </div>
        </div>

        <div style="display: flex; gap: 16px;">
          <div class="form-group" :class="{ error: errors.direccion }">
            <div class="input-wrapper">
              <input v-model="direccion" type="text" id="direccion" name="direccion" required
                autocomplete="street-address"/>
              <label for="direccion">Dirección</label>
            </div>
            <span class="error-message" v-if="errors.direccion">{{ errors.direccion }}</span>
          </div>

          <!-- Selects dependientes: Departamento -> Provincia -> Distrito -->
          <div class="form-group" :class="{ error: errors.departamento }">
            <div class="input-wrapper">
              <select v-model="departamentoSeleccionado" id="departamento" name="departamento"
                @change="onDepartamentoChange">
                <option value="">Seleccione departamento</option>
                <option v-for="d in departamentos" :key="d.idDepartamento" :value="d.idDepartamento">
                  {{ d.nombre }}
                </option>
              </select>
              <!-- <label for="departamento">Departamento</label> -->
            </div>
            <span class="error-message" v-if="errors.departamento">{{ errors.departamento }}</span>
          </div>
        </div>

        <div style="display: flex; gap: 16px;">
          <div class="form-group" :class="{ error: errors.provincia }">
            <div class="input-wrapper">
              <select v-model="provinciaSeleccionada" id="provincia" name="provincia"
                @change="onProvinciaChange" :disabled="!provincias.length">
                <option value="">Seleccione provincia</option>
                <option v-for="p in provincias" :key="p.idProvincia" :value="p.idProvincia">
                  {{ p.nombre }}
                </option>
              </select>
              <!-- <label for="provincia">Provincia</label> -->
            </div>
            <span class="error-message" v-if="errors.provincia">{{ errors.provincia }}</span>
          </div>
          <div class="form-group" :class="{ error: errors.distrito }">
            <div class="input-wrapper">
              <select v-model="distritoSeleccionado" id="distrito" name="distrito" :disabled="!distritos.length">
                <option value="">Seleccione distrito</option>
                <option v-for="t in distritos" :key="t.idDistrito" :value="t.idDistrito">{{ t.nombre }}</option>
              </select>
              <!-- <label for="distrito">Distrito</label> -->
            </div>
            <span class="error-message" v-if="errors.distrito">{{ errors.distrito }}</span>
          </div>
        </div>

        <button @click="IniciarRegistro" type="submit" class="login-btn">
          <span class="btn-text">Registrarse</span>
          <span class="btn-loader"></span>
        </button>
      </form>

      <div class="signup-link">
        <p>
          ¿Ya tiene cuenta?
          <a @click.prevent="$router.push('/login')" href="#">Iniciar sesión</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* Copiado y adaptado desde LoginForm.vue - estilos compartidos */

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

.login-container {
  width: 100%;
  max-width: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.login-header p {
  color: #64748b;
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 20px;
}

.input-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

.input-wrapper input {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px 8px 16px;
  color: #1e293b;
  font-size: 16px;
  transition: all 0.2s ease;
  width: 100%;
  outline: none;
}

.input-wrapper input::placeholder {
  color: transparent;
}

.input-wrapper label {
  position: absolute;
  left: 16px;
  top: 12px;
  color: #64748b;
  font-size: 16px;
  transition: all 0.2s ease;
  pointer-events: none;
  transform-origin: left top;
}

.input-wrapper input:focus,
.input-wrapper input:valid,
.input-wrapper input.has-value {
  border-color: #6366f1;
}

.input-wrapper input:focus + label,
.input-wrapper input:valid + label,
.input-wrapper input.has-value + label {
  transform: translateY(-8px) scale(0.675);
  color: #6366f1;
  font-weight: 500;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 48px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #64748b;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #1e293b;
}

.eye-icon {
  display: block;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='1.5'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'/%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'/%3e%3c/svg%3e");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: background-image 0.2s ease;
}

.eye-icon.show-password {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='1.5'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88'/%3e%3c/svg%3e");
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 4px;
  margin-left: 4px;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.2s ease;
}

.form-group.error .input-wrapper input {
  border-color: #ef4444;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.remember-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.remember-wrapper input[type='checkbox'] {
  display: none;
}

.checkbox-label {
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkmark {
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  background: white;
}

.forgot-password {
  color: #6366f1;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #4f46e5;
}

.login-btn {
  width: 100%;
  background: #6366f1;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  margin-bottom: 24px;
}

.login-btn:hover {
  background: #4f46e5;
}

.login-btn:active {
  transform: translateY(1px);
}

.login-btn.loading {
  pointer-events: none;
  background: #a5a6f6;
}

.btn-text {
  transition: opacity 0.2s ease;
}

.btn-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  opacity: 0;
  animation: spin 1s linear infinite;
  transition: opacity 0.2s ease;
}

.login-btn.loading .btn-text {
  opacity: 0;
}

.login-btn.loading .btn-loader {
  opacity: 1;
}

.signup-link {
  text-align: center;
}

.signup-link p {
  color: #64748b;
  font-size: 0.875rem;
}

.signup-link a {
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.signup-link a:hover {
  color: #4f46e5;
}

.success-message {
  display: block;
  text-align: center;
  padding: 32px 20px;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease;
}

.success-icon {
  width: 48px;
  height: 48px;
  background: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  margin: 0 auto 16px;
  animation: successPulse 0.5s ease;
}

.success-message h3 {
  color: #1e293b;
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.success-message p {
  color: #64748b;
  font-size: 0.875rem;
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes successPulse {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px;
    margin: 10px;
  }

  .login-header h2 {
    font-size: 1.5rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

/* Estilos para selects (misma apariencia que los inputs) */
.input-wrapper select {
  background: rgb(250, 250, 250);
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  color: #1e293b;
  font-size: 16px;
  transition: all 0.2s ease;
  width: 100%;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  /* asegurar que el desplegable se muestre por encima cuando esté enfocado */
  position: relative;
  z-index: 1;
}

.input-wrapper select:focus {
  border-color: #6366f1;
  z-index: 9999;
}

.input-wrapper select[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Forzar color y fondo de las opciones (algún navegador/tema puede requerirlo) */
.input-wrapper select option {
  color: #1e293b;
  background: white;
}

/* si quieres un indicador visual tipo flecha a la derecha */
.input-wrapper.select-with-arrow {
  position: relative;
}
.input-wrapper.select-with-arrow::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2364748b'%3e%3cpath d='M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z'/%3e%3c/svg%3e");
  background-size: contain;
  background-repeat: no-repeat;
}
</style>

<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      nombres: '',
      apellidos: '',
      email: '',
      clave: '',
      direccion: '',
      departamentos: [],
      provincias: [],
      distritos: [],
      departamentoSeleccionado: '',
      provinciaSeleccionada: '',
      distritoSeleccionado: '',
      showPassword: false,
      loading: false,
      success: false,
      errors: {},
    }
  },
  methods: {
    // Cargas de listas
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
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    validate() {
      this.errors = {}
      if (!this.nombres) this.errors.nombres = 'Ingrese nombres'
      if (!this.apellidos) this.errors.apellidos = 'Ingrese apellidos'
      if (!this.email) this.errors.email = 'Ingrese correo electrónico'
      else if (!/.+@.+\..+/.test(this.email)) this.errors.email = 'Correo inválido'
      if (!this.clave) this.errors.clave = 'Ingrese una clave'
      if (!this.direccion) this.errors.direccion = 'Ingrese dirección'
      if (!this.departamentoSeleccionado) this.errors.departamento = 'Seleccione departamento'
      if (!this.provinciaSeleccionada) this.errors.provincia = 'Seleccione provincia'
      if (!this.distritoSeleccionado) this.errors.distrito = 'Seleccione distrito'
      return Object.keys(this.errors).length === 0
    },
    IniciarRegistro() {
      if (!this.validate()) return
      this.loading = true
      let endpointURL = 'api/usuario/SignUp'
      let payload = {
        Nombres: this.nombres,
        Apellidos: this.apellidos,
        Email: this.email,
        Clave: this.clave,
        Direccion: this.direccion,
        IdDepartamento: this.departamentoSeleccionado,
        IdProvincia: this.provinciaSeleccionada,
        IdDistrito: this.distritoSeleccionado,
        Rol: 'U',
        Situacion: 'C',
        Estado: 'A',
      }

      this.$api
        .post(endpointURL, payload)
        .then(() => {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Registro exitoso.',
          })
          this.success = true
          // redirigir a login o dashboard
          setTimeout(() => {
            this.$router.push('/login')
          }, 800)
        })
        .catch((error) => {
          const msg = error?.response?.data?.message || error.message || 'Error en el registro.'
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: 'Error al registrarse. ' + msg,
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  mounted() {
    this.fetchDepartamentos()
  },
}
</script>
