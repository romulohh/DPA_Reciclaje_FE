<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-avatar>
          <img src="https://iili.io/fufxSr7.png" >
        </q-avatar>

        <q-toolbar-title> Recicla perú </q-toolbar-title>

        <q-icon name="home" color="white" size="32px" class="q-mr-md cursor-pointer" @click="$router.push('/')"/>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in filteredLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const userRole = localStorage.getItem("rol")

const linksList = [
  {
    title: 'Campaña',
    caption: 'Ir a campañas',
    icon: 'campaign',
    to: '/admin/campania',
    rol: 'A'
  },
  {
    title: 'Producto',
    caption: 'Ir a Productos',
    icon: 'inventory_2',
    to: '/admin/productoform',
  },
  {
    title: 'Categorias',
    caption: 'Ir a Categorías',
    icon: 'school',
    to: '/admin/categoria',
    rol: 'A'
  },
]

// ⬇️ Computed que filtra los links permitidos
const filteredLinks = computed(() =>
  linksList.filter(link =>
    !link.rol || link.rol === userRole
  )
)

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
