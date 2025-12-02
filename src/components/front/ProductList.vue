<template>
  <div class="product-list">
    <div class="product-grid">
      <div class="product-item" v-for="item in filteredProducts" :key="item.idProducto" @click="verDetalle(item.idProducto)">
        <ProductItem :product="item" />
      </div>
    </div>
  </div>
</template>

<style>
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
</style>

<script>
import ProductItem from 'src/components/front/ProductItem.vue'

export default {
  name: 'ProductList',
  components: {
    ProductItem,
  },
  props: {
    categoriaFiltrada: {
      type: Object,
      default: null,
    },
    distritoFiltrado: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      products: [],
    }
  },

  mounted() {
    this.loadProducts()
  },
  computed: {
    filteredProducts() {
      if (this.categoriaFiltrada) {
        console.log('Filtering products by category: ', this.categoriaFiltrada)
        return this.products.filter(
          (product) => product.categoria.idCategoria === this.categoriaFiltrada.idCategoria && product.disponible === 'D'
        )
      }
      if (this.distritoFiltrado) {
        console.log('Filtering products by distrito: ', this.distritoFiltrado)
        return this.products.filter(
          (product) => product.usuario.distrito.idDistrito === this.distritoFiltrado.idDistrito && product.disponible === 'D'
        )
      }
      console.log('Productos filtrados: ', this.products)
      return this.products.filter((product) => product.disponible === 'D')
    },
  },
  methods: {
    loadProducts() {
      // Lógica para cargar productos
      let endpointURL = '/api/Producto'
      let token = localStorage.getItem('token')
      this.$api
        .get(endpointURL, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then((response) => {
          this.products = response.data
          console.log('Producto cargado: ', this.products)
        })
        .catch((error) => {
          console.error('Error al cargar productos: ', error)
        })
    },
    verDetalle(idProducto) {
      this.$router.push({ name: '/ProductoDetalle', params: { id: idProducto } })
    },
  },
}
</script>
