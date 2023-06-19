import metadata from './plugins/metadata/metadata'
import metadataDynamic from './plugins/metadata/metadataDynamic'
import metadataStatic from './plugins/metadata/metadataStatic'

export default {
  target: 'server',
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
  },
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.API_BASE_URL,
    },
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.API_BASE_URL,
    },
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: metadata.tags.title,
    titleTemplate: metadata.tags.titleTemplate,
    htmlAttrs: {
      lang: metadata.settings.locale,
    },
    meta: [...metadataStatic(), ...metadataDynamic()],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/brand/favicon.ico' },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: true,
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300&display=swap',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/main.css', '@/assets/css/general.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios.js',
    '@/plugins/filters/user.js',
    '@/plugins/filters/product.js',
    '@/plugins/repository.js',
    '@/plugins/imagesRepository.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: ['~/components', '~/components/commons', '~/components/special'],
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://nuxt-socket-io.netlify.app
    'nuxt-socket-io',
    //https://auth.nuxtjs.org
    '@nuxtjs/auth',
    // https://www.npmjs.com/package/@nuxtjs/svg
    '@nuxtjs/svg',
    // https://cloudinary.nuxtjs.org
    '@nuxtjs/cloudinary',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'http://localhost:3001/api',
    headers: {
      common: {
        Accept: 'application/json, text/plain, */*',
      },
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    icon: {
      source: './static/brand/isotype.png',
    },
    meta: {
      name: metadata.tags.title,
      theme_color: metadata.settings.color,
      lang: 'es',
    },
    manifest: {
      lang: 'es',
      name: metadata.tags.title,
      description: metadata.tags.description,
      short_name: 'El Kiosko Llanero',
      display: 'standalone',
      start_url: '/login',
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: 'https://fonts.googleapis.com/.*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
        },
      ],
    },
  },

  io: {
    // we could have multiple sockets that we identify with names
    // one of these sockets may have set "default" to true
    sockets: [
      {
        default: true, // make this the default socket
        name: 'main', // give it a name that we can later use to choose this socket in the .vue file
        url: 'http://localhost:3002', // URL wherever your socket IO server runs
      },
    ],
  },

  auth: {
    strategies: {
      local: {
        token: 'Bearer',
        endpoints: {
          login: {
            url: '/auth/signin',
            method: 'post',
            propertyName: 'data.token',
          },
          logout: {
            url: '/auth/signout',
            method: 'post',
          },
          user: {
            url: '/auth/user',
            method: 'get',
            propertyName: 'data.user',
          },
        },
      },
    },
    redirect: {
      home: '/redirect',
      login: '/login',
      logout: '/login',
    },
    fullPathRedirect: true,
  },

  cloudinary: {
    cloudName: process.env.CLOUD_NAME_CLOUDINARY,
    apiKey: process.env.API_KEY_CLOUDINARY,
    apiSecret: process.env.API_SECRET_CLOUDINARY,
    secure: process.env.NODe_ENV !== 'development',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      })
    },
    loaders: {
      vue: {
        transformAssetUrls: {
          audio: 'src',
        },
      },
    },
  },
}
