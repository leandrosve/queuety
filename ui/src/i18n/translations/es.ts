export default {
  translation: {
    common: {
      test: 'probando!',
      copy: 'Copiar',
      copied: 'Copiado!',
      save: 'Guardar',
      views: 'visitas',
      on: 'activado',
      off: 'desactivado',
      accept: 'Aceptar',
      cancel: 'Cancelar',
      live: 'Vivo',
      goHome: 'Volver al inicio',
      example: 'Ej:',
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
      loop: 'Bucle',
      clearQueue: { title: 'Limpiar cola de reproducción', description: 'Estas seguro que deseas eliminar todos los elementos de la cola?' },
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
      regenConfirmation: {
        title: '¿Regenerar codigo de autorización?',
        description: 'Los dispositivos actuales seguiran conectados, pero los códigos de acceso que hayas compartido ya no serán válidos.',
      },
    },
    connectionView: {
      deviceName: 'Tu nombre de dispositivo es:',
      devices: {
        title: 'Conectarse al escritorio',
        description: 'Puedes escanear el código QR mostrado en la sección <0>Conectar Dispositivo</0> en el escritorio',
        scanQR: 'Escanear QR',
        alternative: 'Alternativamente puedes ingresar el <0>código de autorización</0>',
      },
      notifications: {
        AUTH_REVOKED: 'Has sido expulsado de la sesión de reproducción',
        SESSION_ENDED: 'La sesión de reproducción ha finalizado',
      },
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
      feedbackTooltip: 'Enviar feedback/Reportar errores',
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
    },
    deviceSelection: {
      title: 'Gestiona de la reproducción de videos de YouTube en tu PC a través de tu dispositivo móvil.',
      description:
        'No necesitas estar frente a la pantalla de tu PC ni en la misma red Wi-Fi para realizar acciones como <0>pausar, reproducir, ajustar el volumen o cambiar de video 😎</0>.',
      selectPrompt: 'Selecciona como quieres utilizar este dispositivo:',
      receptor: {
        title: 'Receptor',
        description:
          'Elige este modo si deseas que este dispositivo actúe como receptor, permitiendo que otros dispositivos envíen contenido para su reproducción aquí.',
        confirmation: {
          title: '¿Deseas continuar en modo Receptor?',
          description:
            'El modo receptor no esta optimizado para dispositivos móviles. De todas maneras puedes continuar en modo receptor, pero debes saber que <0>la experiencia de usuario puede no ser óptima</0>.',
        },
      },
      emitter: {
        title: 'Emisor',
        description:
          ' Elige este modo si deseas transmitir contenido desde tu dispositivo, como tu teléfono móvil u otra computadora, hacia un receptor. Podrás controlar la reproducción y elegir qué ver en tu PC con facilidad.',
        confirmation: {
          title: '¿Deseas continuar en modo Emisor?',
          description:
            'El modo emisor esta diseñado principalmente para <0>dispositivos móviles</0>. De todas maneras puedes continuar en modo emisor, pero debes saber que <0>la experiencia de usuario puede no ser óptima</0>.',
        },
      },
    },
    receptorWelcome: {
      begin: 'Comencemos!',
      description1: 'Para conectar un nuevo dispositivo facilmente puedes <0>escanear el código QR</0> desde el dispositivo que quieres conectar.',
      description2:
        'También puedes comenzar a agregar videos a la cola desde este dispositivo y conectar dispositivos mas tarde. ¡Espero ser de utilidad 😊!',
      backConfirm: {
        title: '¿Estas seguro/a que deseas volver al inicio?',
        description: 'Los dispositivos vinculados se perderan y tendrás que volver a conectarlos.',
      },
    },
    notifications: {
      addToQueue: '{{nickname}} agregó un video a la cola',
      joined: '<0>{{nickname}}</0> se ha unido',
      desktop_offline: '<0>{{nickname}}</0> se ha desconectado',
      desktop_offline_recovered: '<0>{{nickname}}</0> se ha vuelto a conectar!',
      offline: 'Estas desconectado',
      offline_recovered: 'Te has vuelto a conectar!',
      awaiting_reconnection: 'Esperando reconexión',
      disconnect_device: 'Desvincular dispositivo',
    },
    contact: {
      title: 'Contacto',
      description: 'Puedes enviarnos cualquier tipo de feedback, o reportar errores o inconsistencias con las que te hayas encontrado.',
      email: {
        label: 'Email',
        placeholder: 'Email',
      },
      message: {
        label: 'Mensaje / Informe de errores',
        placeholder: 'Deja aqui tu mensaje, puedes indicarnos cosas a mejorar, o cualquier inconveniente con el que te hayas encontrado.',
      },
      send: 'Enviar',
      errors: {
        empty_message: 'Por favor introduzca un mensaje',
        invalid_email: 'Por favor introduzca un email válido',
        message_too_long: 'El mensaje es demasiado largo',
        not_sent: 'Lo sentimos, no se ha podido enviar el mensaje 😢. Puedes intentarlo mas tarde.',
      },
      messageSent: 'Se ha enviado el mensaje',
      feedbackThanks: '¡Gracias por el feedback!',
      close: 'Cerrar',
    },
    tabChecker: {
      error: 'Parece que el sitio se ha abierto desde otra pestaña.<0></0>Deseas continuar reproduciendo en esta pestaña y detener la otra?',
      button: 'Continuar en esta pestaña',
    },
    roomSwitch: {
      description: 'Parece que estas tratando de conectarte a otra sesión. ¿Deseas finalizar la sesión actual y requerir conectarte a esta otra?',
      accept: 'Finalizar sesión actual',
      skip: 'Continuar en la misma sesión',
    },
    qrScanner: {
      title: 'Escanear QR',
      errors: {
        camera_missing: 'No se ha podido encontrar una cámara para escanear el QR',
        default: 'No se ha podido iniciar la cámara',
        invalid_url: 'El código escaneado no corresponde a una URL válida',
      },
    },
    maintenance: {
      title: 'Lo sentimos, parece que nuestros servidores no estan funcionando correctamente...',
      description: 'Puedes volver a intentarlo en unos minutos',
    },
    errorView: {
      title: '¡Ups! No deberías estar viendo esto...',
      description: 'Si te sigues encontrando con este problema, puedes intentar borrar los datos de navegación para este sitio.',
      refresh: 'Recargar Página',
      erase: 'Borrar datos de navegación',
      notify: 'Notificar problema',
    },
  },
};
