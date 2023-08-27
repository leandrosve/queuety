export default {
  translation: {
    common: {
      test: 'probando!',
      copy: 'Copiar',
      copied: 'Copiado!',
      views: 'visitas',
      on: 'activado',
      off: 'desactivado',
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
      moveNext: 'Reproducir a continuación',
      moveLast: 'Mover al final de la cola',
    },
    player: {
      exitFullscreen: 'Salir de pantalla completa',
      fullscreen: 'Pantalla completa',
      playbackRate: 'Velocidad de reproducción',
      volume: 'Volumen',
      playingInDesktop: 'Reproduciendo en escritorio',
    },
    connection: {
      connectDevice: 'Conectar Dispositivo',
      connectDescription: 'Para conectar un nuevo dispositivo debes escanear el siguiente código QR desde el dispositivo que quieres conectar:',
      copyLink: 'Copiar Link',
      copyCode: 'Copiar Código',
      regenCode: 'Regenerar Código',
      settingsLink: 'Ver configuración y dispositivos conectados',
      userRequest: '<0>{{nickname}}</0> está solicitando unirse a la sesión de reproducción',
      accept: 'Aceptar',
      reject: 'Rechazar',
      automaticAuth: 'Autorizar nuevos dispositivos automaticamente',
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
      session: {
        title: 'Finalizar Sesión',
        description: 'Desconectar Dispositivo',
        button: 'Desconectar',
      },
      hostSession: {
        title: 'Finalizar Sesión',
        description: 'Terminar sesión y desconectar todos los dispositivos',
        button: 'Terminar',
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
      notifications: {
        addToQueue: '{{nickname}} agregó un video a la cola',
        desktop_offline: 'Escritorio desconectado',
        desktop_online: 'Escritorio se ha vuelto a conectar!',
      },
    },
  },
};
