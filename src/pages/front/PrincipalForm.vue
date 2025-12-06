<template>
  <q-layout view="hHr lpR fFf">
    <HeaderForm />
    <q-page-container>
      <div class="contenedor">
        <!-- Filtros a la izquierda -->
        <div class="filtros">
          <div class="card">
            <div class="text-h6">Filtros</div>
            <CategoriaFilter @categoryChanged="updateProductCategory" />
            <DistritoFilter @distritoChanged="updateProductDistrito" />
          </div>
        </div>

        <!-- Catálogo a la derecha -->
        <ProductList :categoria-filtrada="categorySelected" :distrito-filtrado="distritoSelected" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.contenedor {
  display: flex;
  gap: 20px;
  padding: 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden; /* Prevenir desbordamiento */
}

/* Filtros a la izquierda - ancho fijo */
.filtros {
  flex: 0 0 250px !important;
  min-width: 250px !important;
  max-width: 250px !important;
  width: 250px !important;
  overflow: hidden; /* Prevenir que el contenido se desborde */
}

/* Card genérica */
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  box-sizing: border-box;
}

/* Controlar el ancho de los componentes internos */
.filtros :deep(.q-select),
.filtros :deep(.category-filter),
.filtros :deep(.distrito-filter) {
  max-width: 100%;
  width: 100%;
}

/* En pantallas pequeñas, apilar filtros arriba y catálogo abajo */
@media (max-width: 768px) {
  .contenedor {
    flex-direction: column;
  }

  .filtros {
    flex: 0 0 auto !important;
    min-width: 100% !important;
    max-width: 100% !important;
    width: 100% !important;
  }
}

</style>

<script>
import CategoriaFilter from 'src/components/front/CategoriaFilter.vue'
import DistritoFilter from 'src/components/front/DistritoFilter.vue'
import ProductList from 'src/components/front/ProductList.vue'
import HeaderForm from 'src/components/HeaderForm.vue'

export default {
  name: 'PrincipalForm',
  components: {
    CategoriaFilter,
    DistritoFilter,
    ProductList,
    HeaderForm,
  },
  data() {
    return {
      categorySelected: null,
      distritoSelected: null,
    }
  },
  methods: {
    updateProductCategory(category) {
      console.log('Categoría seleccionada:', category)
      // Aquí puedes agregar la lógica para filtrar los productos según la categoría seleccionada
      this.categorySelected = category
    },
    updateProductDistrito(distrito) {
      console.log('Distrito seleccionado:', distrito)
      this.distritoSelected = distrito
    },
  },
}
</script>
