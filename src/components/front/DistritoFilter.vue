<template>
  <div class="distrito-filter">
    <q-select label="Distrito" v-model="distritoSelected" :options="distritos" option-value="id" option-label="nombre"
      emit-value map-options @update:model-value="onChange" />
  </div>
</template>

<style></style>

<script>
export default {
  name: 'DistritoFilter',
  data() {
    return {
      distritos: [],
      distritoSelected: null,
    }
  },
  mounted() {
    this.loadDistritos()
  },
  methods: {
    onChange(value) {
      this.$emit('distritoChanged', value)
    },
    loadDistritos() {
      // Lógica para cargar distritos
      let endpointURL = '/api/Distrito'
      let token = localStorage.getItem('token')
      this.$api
        .get(endpointURL, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then((response) => {
          this.distritos = response.data
          this.distritos.unshift({ id: null, nombre: 'Todos los distritos' })
        })
        .catch((error) => {
          console.error('Error al cargar distritos: ', error)
        })
    },
  },
}
</script>
