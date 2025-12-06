<template>
  <q-layout view="hHr lpR fFf">
    <HeaderForm />

    <q-page-container>
      <div class="campania-portada">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <q-spinner color="primary" size="3em" />
          <p class="text-h6 q-mt-md">Cargando campañas...</p>
        </div>

        <!-- Sin Campañas -->
        <div v-else-if="!campanias || campanias.length === 0" class="no-campanias">
          <q-icon name="campaign" size="100px" color="grey-5" />
          <p class="text-h5 q-mt-md">No hay campañas disponibles</p>
        </div>

        <!-- Carrusel de Campañas -->
        <div v-else class="carousel-container">
          <q-carousel v-model="slide" transition-prev="slide-right" transition-next="slide-left"
            swipeable animated control-color="white" navigation infinite autoplay arrows
            height="600px" class="campania-carousel" >
            <q-carousel-slide
              v-for="(campania, index) in campanias"
              :key="campania.idCampania"
              :name="index"
              class="carousel-slide" >
              <div class="campania-slide-content">
                <!-- Título encima de la imagen -->
                <div class="campania-titulo-overlay">
                  <h1 class="titulo-principal">{{ campania.título }}</h1>
                </div>

                <!-- Imagen de la campaña -->
                <div class="campania-imagen-container">
                  <img
                    :src="getImageUrl(campania.imagen)"
                    :alt="campania.titulo"
                    class="campania-imagen"
                    @error="handleImageError"
                  />
                  <div class="imagen-overlay"></div>
                </div>

                <!-- Información debajo de la imagen -->
                <div class="campania-info">
                  <div class="info-card">
                    <p class="descripcion">{{ campania.descripcion }}</p>
                    <div class="fechas-container">
                      <div class="fecha-item">
                        <q-icon name="event" size="24px" color="primary" />
                        <div class="fecha-text">
                          <span class="fecha-label">Inicio:</span>
                          <span class="fecha-valor">{{ formatFecha(campania.fechaInicio) }}</span>
                        </div>
                      </div>
                      <div class="fecha-item">
                        <q-icon name="event" size="24px" color="negative" />
                        <div class="fecha-text">
                          <span class="fecha-label">Fin:</span>
                          <span class="fecha-valor">{{ formatFecha(campania.fechaFin) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-carousel-slide>
          </q-carousel>

          <!-- Indicadores personalizados -->
          <div class="custom-indicators">
            <div
              v-for="(campania, index) in campanias"
              :key="index"
              class="indicator-dot"
              :class="{ active: slide === index }"
              @click="slide = index"
            ></div>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import HeaderForm from 'src/components/HeaderForm.vue'

export default {
  name: 'CampaniaFront',
  components: {
    HeaderForm,
  },
  data() {
    return {
      campanias: [],
      loading: false,
      slide: 0,
    }
  },
  mounted() {
    this.loadCampanias()
  },
  methods: {
    loadCampanias() {
      this.loading = true
      const endpointURL = 'api/Campania/vigentes'

      this.$api
        .get(endpointURL)
        .then((response) => {
          this.campanias = Array.isArray(response.data) ? response.data : []
          console.log('Campañas cargadas:', this.campanias)
        })
        .catch((error) => {
          console.error('Error al cargar campañas:', error)
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: 'Error al cargar las campañas',
          })
          this.campanias = []
        })
        .finally(() => {
          this.loading = false
        })
    },
    getImageUrl(nombreArchivo) {
      if (!nombreArchivo) {
        return '/assets/images/campania/recicla.jpeg'
      }
      try {
        return new URL(`/src/assets/images/campania/${nombreArchivo}`, import.meta.url).href
      } catch  {
        return '/assets/images/campania/recicla.jpeg'
      }
    },
    handleImageError(event) {
      event.target.src = '/assets/images/campania/recicla.jpeg'
    },
    formatFecha(fecha) {
      if (!fecha) return 'No especificada'
      const date = new Date(fecha)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('es-ES', options)
    },
  },
}
</script>

<style scoped>
.campania-portada {
  display: flex;
  gap: 20px;
  padding: 20px;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 40px;
}

/* Sin Campañas */
.no-campanias {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 40px;
  /* color: #64748b; */
}

/* Carrusel Container */
.carousel-container {
  position: relative;
  width: 100%;
}

.campania-carousel {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* Slide Content */
.carousel-slide {
  padding: 0;
}

.campania-slide-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: rgba(222, 214, 214, 0.485);
}

/* Título Overlay - Encima de la imagen */
.campania-titulo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 40px 60px;
  /* background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 70%, transparent 100%); */
  display: flex;
  align-items: center;
  justify-content: center;
}

.titulo-principal {
  font-size: 4rem;
  font-weight: 900;
  color: white;
  text-align: center;
  text-shadow:
    0 2px 10px rgba(0, 0, 0, 0.8),
    0 0 30px rgba(99, 102, 241, 0.5);
  letter-spacing: 2px;
  line-height: 1.2;
  margin: 0;
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Imagen Container */
.campania-imagen-container {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: #000; */
  height: 400px; /* Asegurar altura mínima */
}

.campania-imagen {
  width: 80%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  transition: transform 0.5s ease;
  image-rendering: -webkit-optimize-contrast; /* Mejorar renderizado */
  image-rendering: crisp-edges;
  max-width: 100%;
  max-height: 100%;
}

.carousel-slide:hover .campania-imagen {
  transform: scale(1.05);
}

.imagen-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 40%); */
  pointer-events: none;
}

/* Información debajo de la imagen */
.campania-info {
  position: relative;
  z-index: 10;
  padding: 20px 60px;
  background: white; /* Fondo sólido */
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 30px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-out;
}

/* Eliminar el gradiente del overlay inferior */
.imagen-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: none; /* Eliminar gradiente */
  pointer-events: none;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.descripcion {
  font-size: 1.25rem;
  line-height: 1.8;
  color: #334155;
  margin: 0 0 24px 0;
  text-align: center;
  font-weight: 500;
}

/* Fechas Container */
.fechas-container {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
}

.fecha-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fecha-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fecha-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.fecha-valor {
  font-size: 1.125rem;
  color: #1e293b;
  font-weight: 700;
}

/* Indicadores personalizados */
.custom-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 20;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  /* background: rgba(255, 255, 255, 0.5); */
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.indicator-dot:hover {
  /* background: rgba(255, 255, 255, 0.8); */
  transform: scale(1.2);
}

.indicator-dot.active {
  background: white;
  width: 40px;
  border-radius: 6px;
}

/* Responsive */
@media (max-width: 768px) {
  .campania-carousel {
    height: 700px !important;
  }

  .campania-imagen-container {
    height: 400px;
  }

  .campania-titulo-overlay {
    padding: 30px 20px;
  }

  .titulo-principal {
    font-size: 2.5rem;
  }

  .campania-info {
    padding: 15px 20px;
  }

  .campania-titulo-overlay {
    padding: 30px 20px;
  }

  .titulo-principal {
    font-size: 2.5rem;
  }

  .info-card {
    padding: 20px;
  }

  .descripcion {
    font-size: 1rem;
  }

  .fechas-container {
    gap: 30px;
  }

  .fecha-valor {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .campania-carousel {
    height: 600px !important;
  }

  .campania-imagen-container {
    height: 300px;
  }

  .campania-info {
    padding: 10px 15px;
  }

  .titulo-principal {
    font-size: 1.75rem;
  }

  .descripcion {
    font-size: 0.875rem;
  }

  .fechas-container {
    flex-direction: column;
    gap: 16px;
  }
}

/* Transiciones suaves para el carrusel */
:deep(.q-carousel__slide) {
  background: transparent;
}

:deep(.q-carousel__control) {
  opacity: 0.8;
}

:deep(.q-carousel__control:hover) {
  opacity: 1;
}

:deep(.q-carousel__navigation-icon) {
  font-size: 32px;
}

:deep(.q-carousel__arrow) {
  /* background: rgba(0, 0, 0, 0.5); */
  backdrop-filter: blur(10px);
}

/* :deep(.q-carousel__arrow:hover) {
  background: rgba(0, 0, 0, 0.7);
} */
</style>
