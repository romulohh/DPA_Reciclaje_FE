<template>
  <q-card class="product-card">
    <q-card-section>
      <q-img :src="getImageUrl(product.imagen)" alt="Imagen del producto" style="width: 100%; height: 200px; object-fit: contain; background-color: #f5f5f5;"/>
      <q-icon v-if="isLoggedIn && esFavorito" name="favorite" color="red" size="25px" class="absolute-top-right q-ma-sm" />

    </q-card-section>
    <q-card-section>
      <q-card-title style="font-size: 18px;"><b>{{ product.nombre }}</b></q-card-title>
      <div class="text-h7">Precio S/ {{ product.precio }}</div>
      <div class="text-h8">{{ product.usuario.distrito.nombre }} - {{ product.usuario.distrito.departamento.nombre }}</div>
      <!-- <form @submit.prevent="agregarCarrito">
        <div class="text-center">
          <q-btn v-if="isLoggedIn && product.motivo === 'V'" type="submit" color="primary" label="Agregar al carrito" />
        </div>
      </form> -->
    </q-card-section>
  </q-card>
</template>

<style>
.product-card {
  width: 300px;
}
.product-card q-card-section {
  height: 100px;
  overflow: hidden;
}
</style>

<script>
export default {
  name: 'ProductItem',
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token')
    },
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      esFavorito: false
    }
  },
  mounted() {
    this.loadFavorito()
  },
  methods: {
    getImageUrl(nombreArchivo) {
      return new URL(`/src/assets/images/producto/${nombreArchivo}`, import.meta.url).href
    },
    mostrarMotivo(valor) {
      switch (valor) {
        case 'I': return 'Intercambio'
        case 'V': return 'Venta'
        case 'D': return 'Donación'
        default: return ''
      }
    },
    loadFavorito() {
      // Lógica para leer favorito
      let idUsuario = localStorage.getItem('idUsuario')
      if (!idUsuario) {
        this.esFavorito = false
        return
      }
      else {
        this.esFavorito = false
        let endpointURL = `/api/Favorito/filter?idProducto=${this.product.idProducto}&idUsuario=${idUsuario}`
        let token = localStorage.getItem('token')
        this.$api
          .get(endpointURL, {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          })
          .then((response) => {
            console.log('Favorito cargado: ', response.data)
            if (response.data.length > 0) {
              this.esFavorito = true
              console.log('Tiene favorito: ', this.product.idProducto)
            }
            else {
              this.esFavorito = false
              console.log('No tiene favorito: ', this.product.idProducto)
            }
          })
          .catch((error) => {
            console.error('Error al cargar favorito: ', error)
          })
      }
    },
    agregarCarrito() {
      console.log('Buscardo carrito en localStorage')
      let idUsuarioComprador = localStorage.getItem('idUsuario')
      let idCarrito = localStorage.getItem('idCarrito')
      let token = localStorage.getItem('token')
      if (idCarrito === 'null') {
        console.log('Crea carrito para el usuario: ', idUsuarioComprador)
        let payload = {
          idUsuario: idUsuarioComprador,
          Estado: "A"
        }
        this.$api
          .post('/api/Carrito', payload, {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          })
          .then(() => {
            console.log('Carrito creado')
          })
          .catch((error) => {
            console.error('Error al crear carrito: ', error)
          })
      this.$q.notify({ type: 'positive', position: 'top', message: 'Carrito guardado' })
    }
    },
  }
}
</script>
