// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr:false,
  modules: [
    'vuetify-nuxt-module',
  ],

  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme:'light',
        themes: {
          dark: {
            dark: true, // Add the 'dark' property
            colors: {
              background: '#FFFFFF',
              surface: '#FFFFFF',
              primary: '#6200EE',
              'primary-darken-1': '#3700B3',
              secondary: '#03DAC6',
              'secondary-darken-1': '#018786',
              error: '#B00020',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FB8C00',
            },
          },
          light: {
            dark: false, // Add the 'dark' property
            colors: {
              background: '#FFFFFF',
              surface: '#FFFFFF',
              primary: '#03A9F4',
              'primary-darken-1': '#3700B3',
              secondary: '#03DAC6',
              'secondary-darken-1': '#018786',
              error: '#B00020',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FB8C00',
            },
          },
        },
      },
    },
  },
})

