<template>
<q-header reveal elevated class="bg-primary text-white">
  <q-toolbar>
    <q-toolbar-title>
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
      </q-avatar>
      Recicla Perú
    </q-toolbar-title>
    <div class="q-pa-md">
      <div class="q-gutter-md">
          <!-- Ícono de carrito visible solo si está activo -->
          <q-icon v-if="isLoggedIn && tieneCarritoActivo" name="shopping_cart" color="secondary" size="32px" class="q-mr-md cursor-pointer" @click="$router.push('/carrito')"/>

        <q-btn color="secondary" label="Home" @click="$router.push('/home')" />
        <q-btn color="secondary" label="Campañas" @click="$router.push('/campaniafront')" />
        <q-btn v-if="isLoggedIn" color="secondary" label="Dashboard" @click="$router.push('/admin')" />
        <q-btn v-if="!isLoggedIn" color="secondary" label="Iniciar sesión" @click="$router.push('/login')" />
        <q-btn v-else color="negative" label="Cerrar sesión" @click="logout" />
      </div>
    </div>
  </q-toolbar>
</q-header>
</template>
<script>
export default {
  name: 'HeaderForm',
  data() {
    return {
      tieneCarritoActivo: false
    }
  },
  mounted() {
    let idCarrito = localStorage.getItem('idCarrito')
    if (idCarrito) {
      this.tieneCarritoActivo = true
    }
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token')
    },
    // tieneCarritoActivo() {
    //   return !!localStorage.getItem('idCarrito')
    // },
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('idCarrito')
      window.location.reload()
    },
  },
}
</script>
