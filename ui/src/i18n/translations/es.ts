export default {
  translation: {
    common: {
      test: 'probando!',
      copy: 'Copiar',
      copied: 'Copiado!',
      views: 'visitas',
    },
    layout: {
      theme: {
        switch: 'Alternar entre tema claro y oscuro',
      },
    },
    playerSearch: {
      pasteUrl: 'Pega aquí la URL del video',
      example: 'Por ej:',
      errors: {
        video_not_found: 'Lo sentimos, no pudimos encontrar el video',
        malformed_url: 'La URL no corresponde a un video de YouTube',
        shorts_url: 'Lo sentimos, los shorts solo pueden reproducirse directamente desde YouTube',
        unknown: 'Lo sentimos, algo salió mal',
      },
    },
    playerQueue: {
      next: 'Siguiente',
      playing: 'Reproduciendo',
      queue: 'En cola',
      playNow: 'Reproducir',
      remove: 'Eliminar',
      clear: 'Limpiar cola',
    },
    connection: {
      connectDevice: 'Conectar Dispositivo',
      connectDescription: 'Para conectar un nuevo dispositivo debes escanear el siguiente código QR desde el dispositivo que quieres conectar:',
    },
    settings: {
      settings: 'Configuración',
      general: 'General',
      displayName: {
        title: 'Nombre',
        description: 'Como serás presentado a los demás dispositivos',
        invalid: 'Debe tener entre 3 y 100 carácteres',
      },
      language: 'Idioma',
      languages: {
        en: 'Inglés',
        es: 'Español',
        pt: 'Portugués',
        ja: 'Japonés',
      },
      appearance: 'Apariencia',
      fontSize: 'Tamaño de fuente',
      fontSizes: {
        xs: 'xs',
        sm: 's',
        md: 'm',
        lg: 'l',
        xl: 'xl',
      },
      fontFamily: {
        title: 'Tipografía',
        description: 'Algunas fuentes pueden no funcionar correctamente dependiendo del idioma seleccionado',
      },
      glassTheme: {
        title: 'Tema Glass',
        description: 'Deshabilita el tema glass si tienes problemas para leer el texto',
      },
      colorMode: 'Modo claro/oscuro',
      colorModes: {
        light: 'Claro',
        dark: 'Oscuro',
      },
      connections: 'Conexiones',
      devices: {
        title: 'Autorización automática',
        description: 'Autorizar nuevos dispositivos automáticamente',
      },
      authorizedDevices: {
        title: 'Dispositivos Autorizados',
        empty: 'Aún no has autorizado ningún dispositivo',
        revoke: 'Eliminar',
        revokeAll: 'Eliminar todos',
      },
    },
  },
};
