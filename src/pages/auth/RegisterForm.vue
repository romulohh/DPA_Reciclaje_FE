<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Registro</h2>
        <p>Complete sus datos para crear una cuenta</p>
      </div>

      <form class="login-form" id="registerForm" @submit.prevent="IniciarRegistro" novalidate>
        <div style="display: flex; gap: 16px;">
          <div class="form-group" :class="{ error: errors.nombres }" style="flex:1;">
            <div class="input-wrapper">
              <input v-model="nombres" type="text" id="nombres" name="nombres" required autocomplete="given-name" />
              <label for="nombres">Nombres</label>
            </div>
            <span class="error-message" v-if="errors.nombres">{{ errors.nombres }}</span>
          </div>
          <div class="form-group" :class="{ error: errors.apellidos }" style="flex:1;">
            <div class="input-wrapper">
              <input v-model="apellidos" type="text" id="apellidos" name="apellidos" required autocomplete="family-name"  />
              <label for="apellidos">Apellidos</label>
            </div>
            <span class="error-message" v-if="errors.apellidos">{{ errors.apellidos }}</span>
          </div>
        </div>

        <div style="display: flex; gap: 16px;">
          <div class="form-group" :class="{ error: errors.email }" style="flex:1;">
            <div class="input-wrapper">
              <input v-model="email" type="email" id="email" name="email" required autocomplete="email"  />
              <label for="email">Correo</label>
            </div>
            <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
          </div>

          <div class="form-group" :class="{ error: errors.clave }" style="flex:1;">
            <div class="input-wrapper password-wrapper">
              <input v-model="clave" :type="showPassword ? 'text' : 'password'" id="clave" name="clave"
                required autocomplete="new-password" />
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
          <div class="form-group" :class="{ error: errors.direccion }" style="flex:1;">
            <div class="input-wrapper">
              <input v-model="direccion" type="text" id="direccion" name="direccion" required
                autocomplete="street-address" />
              <label for="direccion">Dirección</label>
            </div>
            <span class="error-message" v-if="errors.direccion">{{ errors.direccion }}</span>
          </div>

          <!-- Selects dependientes: Departamento -> Provincia -> Distrito -->
          <div class="form-group" :class="{ error: errors.departamento }" style="flex:1;">
            <div class="input-wrapper">
              <select v-model="departamentoSeleccionado" id="departamento" name="departamento"
                @change="onDepartamentoChange" >
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
          <div class="form-group" :class="{ error: errors.provincia }" style="flex:1;">
            <div class="input-wrapper">
              <select v-model="provinciaSeleccionada" id="provincia" name="provincia"
                @change="onProvinciaChange" :disabled="!provincias.length" >
                <option value="">Seleccione provincia</option>
                <option v-for="p in provincias" :key="p.idProvincia" :value="p.idProvincia">
                  {{ p.nombre }}
                </option>
              </select>
              <!-- <label for="provincia">Provincia</label> -->
            </div>
            <span class="error-message" v-if="errors.provincia">{{ errors.provincia }}</span>
          </div>
          <div class="form-group" :class="{ error: errors.distrito }" style="flex:1;">
            <div class="input-wrapper">
              <select v-model="distritoSeleccionado" id="distrito" name="distrito" :disabled="!distritos.length" >
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
