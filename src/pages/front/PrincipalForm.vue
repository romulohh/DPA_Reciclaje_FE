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

<style>
.contenedor {
  display: flex;
  gap: 20px;
  padding: 20px;
}

/* Filtros a la izquierda */
.filtros {
  flex: 3;    /* ocupa menos espacio */
}

/* Card genérica */
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.product-list {
  width: 75%;
}
/* En pantallas pequeñas, apilar filtros arriba y catálogo abajo */
@media (max-width: 768px) {
  .contenedor {
    grid-template-columns: 1fr; /* una sola columna */
  }
}
/* En pantallas pequeñas, apilar */
@media (max-width: 768px) {
  .contenedor {
    flex-direction: column;
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
