const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/campania',
        component: () => import("src/pages/campania/CampaniaForm.vue"),
      },
      {
        path: '/productoform',
        component: () => import('src/pages/productoform/ProductoForm.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('src/pages/auth/LoginForm.vue'),
  },
  {
    path: '/register',
    component: () => import('src/pages/auth/RegisterForm.vue'),
  },
  {
    path: '/home',
    component: () => import('src/pages/front/PrincipalForm.vue'),
  },
  {
    path: '/ProductoDetalle/:id',
    name: '/ProductoDetalle',
    component: () => import('src/pages/front/ProductoDetalle.vue'),
  },
    path: '/productoform',
    component: () => import('src/pages/productoform/ProductoForm.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
