<template>
  <q-layout view="hHr lpR fFf">
    <HeaderForm />
    <q-page-container>
      <div class="contenedor q-pa-md row q-col-gutter-md">
        <div class="col-12 col-md-4" style="display: flex 4; justify-content: center; align-items: center;">
          <q-card>
            <q-img :src="getImageUrl(product.imagen)" alt="Imagen del producto" style="max-height: 400px;"/>
          </q-card>
          <!-- Formulario de favorito -->
            <form @submit.prevent="guardarFavorito">
              <q-btn v-if="isLoggedIn" type="submit" class="q-mt-md" style="margin-left: 10px;"
              :color="esFavorito ? 'negative' : 'secondary'"
              :icon="esFavorito ? 'favorite' : 'favorite_border'"
              :label="esFavorito ? 'Quitar de favoritos' : 'Marcar favorito'" />
            </form>
            <q-card-section v-if="isLoggedIn" >
              <div class="text-subtitle1">Califica este producto:</div>
              <q-rating v-model="calificacion" max="5" size="2em" color="amber" icon="star"
                icon-half="star_half" icon-selected="star" />
              <div class="q-mt-sm">Tu calificación: {{ calificacion }}</div>
            </q-card-section>

        </div>
        <div class="col-12 col-md-6" style="display: flex 8; justify-content: center; align-items: center;">
          <q-card>
            <q-card-section>
              <q-card-title class="text-h5"><b>{{ product.nombre }}</b></q-card-title>
              <div class="q-mt-md">
                <p>Descripción del producto: <b>{{ product.descripcion }}</b></p>
              </div>
              <div class="q-mt-md" v-if="product.categoria">
                <p>Categoría a la que pertenece: <b>{{ product.categoria.nombre }}</b></p>
              </div>
              <div class="q-mt-md">
                <p>Marca del producto: <b>{{ product.marca }}</b></p>
              </div>
              <div class="q-mt-md">
                <p>Motivo de publicación: <b>{{ mostrarMotivo(product.motivo) }}</b></p>
              </div>
              <div class="q-mt-md">
                <p>Estado del producto: <b>{{ mostrarEstado(product.estado) }}</b></p>
              </div>
              <div class="q-mt-md" v-if="product.usuario">
                <p>Distrito donde se encuentra: <b>{{ product.usuario.distrito.nombre }} - {{ product.usuario.distrito.departamento.nombre }}</b></p>
              </div>
              <div class="q-mt-md">
                <div class="text-h5 font-weight-bold q-mt-md">Precio S/ {{ product.precio }}</div>
              </div>
              <form @submit.prevent="agregarCarrito">
                <div class="q-mt-lg">
                  <q-btn v-if="isLoggedIn && product.motivo === 'V'" type="submit" color="primary" label="Agregar al carrito" />
                </div>
              </form>
            </q-card-section>
          </q-card>
          <form @submit.prevent="guardarComentario">
              <q-input v-if="isLoggedIn" v-model="comentario" type="textarea" label="Deja un comentario" filled
                lazy-rules :rules="[val => !!val || 'El comentario no puede estar vacío']" :disable="comentarioGuardado" />

              <q-btn v-if="isLoggedIn" type="submit" class="q-mt-md" label="Guardar comentario" color="primary" icon="send" :disable="comentarioGuardado" />
          </form>

          <div v-if="comentarios.length > 0" class="q-mt-xl">
            <div class="text-h6 q-mb-md">Comentarios del producto</div>

            <q-card v-for="c in comentarios" :key="c.idComentario" class="q-mb-md">
              <q-card-section>
                <div class="text-subtitle2">
                  <b>{{ c.usuarioComprador?.nombres || 'Usuario' }}</b>
                </div>

                <q-rating
                  :model-value="c.calificacion === 'X' ? 0 : Number(c.calificacion)"
                  max="5"
                  size="1.5em"
                  color="amber"
                  icon="star"
                  readonly
                />

                <div class="q-mt-sm">{{ c.texto }}</div>

                <div class="text-caption text-grey-7 q-mt-sm">
                  Publicado en: {{ new Date(c.fechaRegistro).toLocaleString() }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div v-else class="q-mt-lg text-grey">
            No hay comentarios todavía.
          </div>


        </div>

      </div>
    </q-page-container>
  </q-layout>
</template>
<style>
.contenedor {
  display: flex;
  gap: 20px;
  padding: 50px;
}
.product-card {
  width: 300px;
}
.product-card q-card-section {
  height: 100px;
  overflow: hidden;
}
</style>

<script>
import HeaderForm from 'src/components/HeaderForm.vue'

export default {
  name: 'ProductoDetalle',
  components: {
    HeaderForm,
  },
  computed: {
    isLoggedIn() {
      console.log('Verificando si el usuario está logueado', localStorage.getItem('token'))
      return !!localStorage.getItem('token')
    },
  },
  data() {
    return {
      product: {},
      comentario: '',
      esFavorito: false,
      comentarioGuardado: false,
      calificacion: 0, // valor inicial, entre 0 y 5
      valorClasificacion: '',
      comentarios: []
    }
  },
  mounted() {
    this.loadProduct()
  },

  methods: {
    loadProduct() {
      // Lógica para cargar productos
      let endpointURL = `/api/Producto/${this.$route.params.id}`
      console.log('Cargando producto con ID: ', endpointURL)
      let token = localStorage.getItem('token')
      this.$api
        .get(endpointURL, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then((response) => {
          this.product = response.data
          this.loadFavorito()
          this.loadComentarios() 
          console.log('Producto cargado: ', this.product)
        })
        .catch((error) => {
          console.error('Error al cargar productos: ', error)
        })
    },
    getImageUrl(nombreArchivo) {
      return new URL(`/src/assets/images/producto/${nombreArchivo}`, import.meta.url).href
    },

    async loadComentarios() {
      try {
        let endpoint = `/api/Comentario/byProducto?idProducto=${this.product.idProducto}`
        let token = localStorage.getItem('token')

        const response = await this.$api.get(endpoint, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`
          }
        })

        this.comentarios = response.data
        console.log("Comentarios cargados:", this.comentarios)

      } catch (error) {
        console.error("Error al cargar comentarios:", error)
      }
    },
    mostrarMotivo(valor) {
      switch (valor) {
        case 'I': return 'Intercambio'
        case 'V': return 'Venta'
        case 'D': return 'Donación'
        default: return ''
      }
    },
    mostrarEstado(valor) {
      switch (valor) {
        case 'N': return 'Nuevo'
        case 'U': return 'Usado'
        default: return ''
      }
    },
    guardarComentario() {
      if (!this.comentario) {
        this.$q.notify({ type: 'warning', position: 'top', message: 'El comentario está vacío' })
        return
      }
      console.log('Comentario enviado:', this.comentario)
      let idUsuarioComprador = localStorage.getItem('idUsuario')
      if (this.calificacion === 0) {
        this.valorClasificacion = 'X'
      } else {
        this.valorClasificacion = String(this.calificacion)
      }

      let payload = {
        idUsuarioVendedor: this.product.usuario.idUsuario,
        idUsuarioComprador: idUsuarioComprador,
        idProducto: this.product.idProducto,
        Texto: this.comentario,
        Calificacion: this.valorClasificacion,
        Estado: "P"
      }
      let token = localStorage.getItem('token')
      this.$api
        .post('/api/Comentario', payload, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then(() => {
          console.log('Comentario guardado')
          this.loadComentarios();
          this.comentario = "";
        })
        .catch((error) => {
          console.error('Error al guardar comentario: ', error)
        })
        
      this.$q.notify({ type: 'positive', position: 'top', message: 'Comentario guardado' })
      this.comentarioGuardado = true   // deshabilita input y botón
    },
    guardarFavorito() {
      this.esFavorito = !this.esFavorito
      console.log('Favorito:', this.esFavorito, 'Producto:', this.product?.idProducto)
      let idUsuario = localStorage.getItem('idUsuario')
      let payload = {
        idProducto: this.product.idProducto,
        idUsuario: idUsuario,
      }
      let token = localStorage.getItem('token')
      if (this.esFavorito) {
          // Lógica para agregar favorito
        let endpointURL = `/api/Favorito`
        this.$api
        .post(endpointURL, payload) ,{
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
        .then(() => {
          console.log('Favorito creado')
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Producto marcado como favorito'
          })
        })
        .catch((error) => {
          console.error('Error al cargar productos: ', error)
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: 'Error al marcar al productocomo favorito'
          })
        })
        console.log('Agregando favorito para el producto:', this.product.idProducto, 'y usuario:', idUsuario)
        return
      }
      else {
        // Lógica para quitar favorito
        let endpointURL = `/api/Favorito?idProducto=${this.product.idProducto}&idUsuario=${idUsuario}`
        this.$api
        .delete(endpointURL, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then(() => {
          console.log('Favorito eliminado')
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Producto quitado de favoritos'
          })
        })
        .catch((error) => {
          console.error('Error al cargar productos: ', error)
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: 'Error al quitar al producto como favorito'
          })
        })
        console.log('Eliminando favorito para el producto:', this.product.idProducto, 'y usuario:', idUsuario)
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
    async agregarCarrito() {
      console.log('Buscando carrito en localStorage')
      let idUsuarioComprador = localStorage.getItem('idUsuario')
      let idCarrito = localStorage.getItem('idCarrito')
      let token = localStorage.getItem('token')
      let idProducto = this.product.idProducto

      // Si no existe carrito, crear uno nuevo
      if (!idCarrito) {
        console.log('Crea carrito para el usuario: ', idUsuarioComprador)
        let payload = {
          idUsuario: idUsuarioComprador,
          Estado: "A"
        }
        try {
          const response = await this.$api.post('/api/Carrito', payload, {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          })
          idCarrito = response.data.idCarrito
          localStorage.setItem('idCarrito', idCarrito)
          console.log('Carrito creado con ID:', idCarrito)
        } catch (error) {
          console.error('Error al crear carrito: ', error)
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: 'Error al crear el carrito'
          })
          return
        }
      }

      // Verificar si el producto ya existe en el carrito
      try {
        let checkUrl = `api/Carrito/exists-item?idCarrito=${idCarrito}&idProducto=${idProducto}`
        let checkResponse = await this.$api.get(checkUrl, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })

        let productoExiste = checkResponse.data === true || checkResponse.data === 'true'

        if (productoExiste) {
          this.$q.notify({
            type: 'warning',
            position: 'top',
            message: 'Este producto ya está en tu carrito'
          })
          return
        }

        // Si el producto no existe, agregarlo al carrito
        console.log('Agregando producto al carrito:', idCarrito, 'producto:', idProducto, 'precio:', this.product.precio)
        let payloadItem = {
          idCarrito: idCarrito,
          idProducto: idProducto,
          Precio: this.product.precio
        }

        await this.$api.post('/api/Carrito/item', payloadItem, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })

        console.log('Producto agregado al carrito exitosamente')
        this.$q.notify({
          type: 'positive',
          position: 'top',
          message: 'Producto agregado al carrito'
        })

      } catch (error) {
        console.error('Error al procesar el carrito: ', error)
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: 'Error al agregar producto al carrito'
        })
      }
    },

  }
}
</script>
