const routes = [
  // {
  //   path: '/',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/IndexPage.vue') },
  //     {
  //       path: '/campania',
  //       component: () => import("src/pages/campania/CampaniaForm.vue"),
  //     },
  //     {
  //       path: '/productoform',
  //       component: () => import('src/pages/productoform/ProductoForm.vue'),
  //     },
  //   ],
  // },
  {
    path: '/',
    component: () => import('src/pages/front/PrincipalForm.vue'),
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
    path: '/carrito',
    component: () => import('src/components/front/CarritoDetalle.vue'),
  },
  {
    path: '/campaniafront',
    component: () => import('src/components/front/CampaniaFront.vue'),
  },
  {
    path: '/ProductoDetalle/:id',
    name: '/ProductoDetalle',
    component: () => import('src/pages/front/ProductoDetalle.vue'),
  },
  // Rutas protegidas (requieren autenticación y usan MainLayout)
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/campania'
      },
      {
        path: 'campania',
        component: () => import('src/pages/campania/CampaniaForm.vue'),
      },
      {
        path: 'productoform',
        component: () => import('src/pages/productoform/ProductoForm.vue'),
      },
      {
        path: '/admin/categoria',
        component: () => import('src/pages/categoria/CategoriaForm.vue'),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
