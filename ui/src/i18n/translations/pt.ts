export default {
  translation: {
    common: {
      test: 'testando!',
      copy: 'Copiar',
      copied: 'Copiado!',
      save: 'Salvar',
      views: 'visualizações',
      on: 'ligado',
      off: 'desligado',
      accept: 'Aceitar',
      cancel: 'Cancelar',
      live: 'Ao vivo',
      example: 'por exemplo',
      goHome: 'Início',
    },
    layout: {
      theme: {
        switch: 'Alternar entre o tema escuro e claro',
      },
    },
    playerSearch: {
      pasteUrl: 'Cole aqui a URL do vídeo',
      example: 'por exemplo',
      playNow: 'Reproduzir agora',
      playNext: 'Adicionar como próximo na fila',
      playLast: 'Adicionar à fila',
      added: 'Item adicionado à fila!',
      errors: {
        video_not_found: 'Desculpe, não foi possível encontrar o vídeo solicitado',
        malformed_url: 'A URL fornecida não corresponde a um vídeo do YouTube',
        shorts_url: 'Desculpe, infelizmente, shorts não podem ser assistidos fora do YouTube',
        unknown: 'Desculpe, algo deu errado',
      },
    },
    playerQueue: {
      next: 'Próximo',
      playing: 'Tocando agora',
      queue: 'Fila',
      playNow: 'Reproduzir agora',
      remove: 'Remover',
      clear: 'Limpar',
      moveNext: 'Mover para o próximo na fila',
      moveLast: 'Mover para o último na fila',
      loop: 'Repetir',
      clearQueue: { title: 'Limpar fila', description: 'Tem certeza de que deseja remover todos os vídeos da fila?' },
    },
    player: {
      exitFullscreen: 'Sair da tela cheia',
      fullscreen: 'Tela cheia',
      playbackRate: 'Taxa de reprodução',
      volume: 'Volume',
      playingInDesktop: 'Tocando no Desktop',
    },
    connection: {
      connectDevice: 'Conectar dispositivo',
      connectDescription: 'Para conectar um novo dispositivo, você deve escanear o seguinte código QR do dispositivo que deseja conectar:',
      copyLink: 'Copiar link',
      copyCode: 'Copiar código',
      regenCode: 'Regenerar código',
      settingsLink: 'Configuração e dispositivos conectados',
      userRequest: '<0>{{nickname}}</0> está solicitando ingresso na sessão do reprodutor',
      accept: 'Aceitar',
      reject: 'Rejeitar',
      automaticAuth: 'Autorizar automaticamente novos dispositivos',
      regenConfirmation: {
        title: 'Regenerar código de autorização?',
        description: 'Os dispositivos atuais permanecerão conectados, mas os códigos de acesso que você compartilhou não serão mais válidos.',
      },
    },
    connectionView: {
      deviceName: 'O nome do seu dispositivo é:',
      devices: {
        title: 'Conectar ao desktop',
        description: 'Para conectar, escaneie o código QR exibido na seção <0>Conectar dispositivo</0> do dispositivo desktop',
        scanQR: 'Escanear QR',
        alternative: 'Alternativamente, você pode inserir o <0>código de autorização</0>',
      },
      notifications: {
        AUTH_REVOKED: 'Você foi expulso da sessão do reprodutor',
        SESSION_ENDED: 'A sessão do reprodutor terminou',
      },
    },
    settings: {
      settings: 'Configurações',
      general: 'Geral',
      displayName: {
        title: 'Nome de exibição',
        description: 'Como você será apresentado para outros dispositivos',
        invalid: 'Deve ter entre 3 e 100 caracteres',
      },
      language: 'Idioma',
      feedbackTooltip: 'Enviar feedback/Relatar erros',
      session: {
        title: 'Encerrar sessão',
        description: 'Desconectar dispositivo',
        button: 'Desconectar',
      },
      hostSession: {
        title: 'Sessão',
        description: 'Encerrar sessão e desconectar todos os dispositivos',
        button: 'Encerrar',
      },
      appearance: 'Aparência',
      fontSize: 'Tamanho da fonte',
      fontSizes: {
        xs: 'muito pequena',
        sm: 'pequena',
        md: 'média',
        lg: 'grande',
        xl: 'muito grande',
      },
      fontFamily: {
        title: 'Família da fonte',
        description: 'Algumas fontes podem não funcionar como esperado, dependendo do idioma selecionado',
      },
      glassTheme: {
        title: 'Tema de vidro',
        description: 'Desativar o modo de vidro se a leitura do texto estiver difícil',
      },
      colorMode: 'Modo de cor',
      colorModes: {
        light: 'Claro',
        dark: 'Escuro',
      },
      connections: 'Conexões',
      devices: {
        title: 'Autorização automática',
        description: 'Autorizar automaticamente novos dispositivos',
      },
      authorizedDevices: {
        title: 'Dispositivos autorizados',
        empty: 'Você ainda não autorizou nenhum dispositivo',
        revoke: 'Revogar',
        revokeAll: 'Revogar todos',
      },
    },
    deviceSelection: {
      title: 'Gerencie a reprodução de vídeos do YouTube em seu PC através do seu dispositivo móvel.',
      description:
        'Você não precisa estar na frente da tela do seu PC ou na mesma rede Wi-Fi para executar ações como <0>pausar, tocar, ajustar o volume ou trocar de vídeo 😎</0>.',
      selectPrompt: 'Selecione como deseja usar este dispositivo:',
      receptor: {
        title: 'Receptor',
        description:
          'Escolha este modo se deseja que este dispositivo atue como receptor, permitindo que outros dispositivos enviem conteúdo para reprodução aqui.',
        confirmation: {
          title: 'Deseja continuar no modo Receptor?',
          description:
            'O modo receptor não é otimizado para dispositivos móveis. Você ainda pode continuar no modo Receptor, mas deve estar ciente de que <0>a experiência do usuário pode não ser ideal</0>.',
        },
      },
      emitter: {
        title: 'Emissor',
        description:
          'Escolha este modo se deseja transmitir conteúdo do seu dispositivo, como seu celular ou outro computador, para um receptor. Você pode controlar facilmente a reprodução e escolher o que assistir no seu PC.',
        confirmation: {
          title: 'Deseja continuar no modo Emissor?',
          description:
            'O modo Emissor é projetado principalmente para <0>dispositivos móveis</0>. Você ainda pode continuar no modo Emissor, mas deve estar ciente de que <0>a experiência do usuário pode não ser ideal</0>.',
        },
      },
    },
    receptorWelcome: {
      begin: 'Vamos começar!',
      description1: 'Para conectar facilmente um novo dispositivo, você pode <0>escanear o código QR</0> do dispositivo que deseja conectar.',
      description2:
        'Você também pode começar a adicionar vídeos à fila deste dispositivo e conectar dispositivos posteriormente. Espero poder ajudar 😊!',
      backConfirm: {
        title: 'Tem certeza de que deseja voltar ao início?',
        description: 'Os dispositivos vinculados serão perdidos, e você terá que reconectá-los.',
      },
    },
    notifications: {
      addToQueue: '<0>{{nickname}}</0> adicionou um vídeo à fila',
      joined: '<0>{{nickname}}</0> entrou',
      desktop_offline: '<0>{{nickname}}</0> ficou offline',
      desktop_offline_recovered: '<0>{{nickname}}</0> está de volta online!',
      offline: 'Você está offline',
      offline_recovered: 'De volta online!',
      awaiting_reconnection: 'Aguardando reconexão',
      disconnect_device: 'Desconectar este dispositivo',
    },
    tabChecker: {
      error: 'Parece que a página foi aberta em outra guia.<0></0>Deseja parar a outra guia e continuar a reprodução nesta?',
      button: 'Continuar nesta guia',
    },
    contact: {
      title: 'Contato',
      description: 'Você pode nos enviar qualquer tipo de feedback ou relatar erros ou inconsistências que encontrou.',
      email: {
        label: 'E-mail',
        placeholder: 'E-mail',
      },
      message: {
        label: 'Mensagem / Relatório de erros',
        placeholder: 'Deixe sua mensagem aqui. Você pode nos informar coisas a melhorar ou quaisquer problemas que encontrou.',
      },
      send: 'Enviar',
      errors: {
        empty_message: 'Por favor, insira uma mensagem',
        invalid_email: 'Por favor, insira um e-mail válido',
        message_too_long: 'A mensagem é muito longa',
        not_sent: 'Desculpe, a mensagem não pôde ser enviada 😢. Você pode tentar novamente mais tarde.',
      },
      messageSent: 'A mensagem foi enviada',
      feedbackThanks: 'Obrigado pelo feedback!',
      close: 'Fechar',
    },
    roomSwitch: {
      description: 'Parece que você está tentando se conectar a outra sessão. Deseja encerrar a sessão atual e solicitar conexão com a nova?',
      accept: 'Encerrar sessão',
      skip: 'Continuar na mesma sessão',
    },
    qrScanner: {
      title: 'Escanear QR',
      errors: {
        camera_missing: 'Não foi encontrada câmera para escanear o código QR',
        default: 'Não foi possível iniciar a câmera',
        invalid_url: 'O código escaneado não corresponde a uma URL válida',
      },
    },
    maintenance: {
      title: 'Desculpe, parece que nossos servidores não estão funcionando corretamente...',
      description: 'Você pode tentar novamente em alguns minutos',
    },
    errorView: {
      title: 'Ops! Você não deveria estar vendo isso...',
      description: 'Se você continuar encontrando este problema, pode tentar excluir os dados de navegação deste site.',
      refresh: 'Recarregar página',
      erase: 'Excluir dados de navegação',
      notify: 'Relatar problema',
    },
    startup: {
      initializing: "Iniciando o servidor",
      wait: "Isso pode levar aproximadamente 1 minuto.",
      info: "Este aplicativo está hospedado em um servidor gratuito em <0></0> que entra em repouso quando não está em uso, causando um atraso considerável ao reiniciar. Obrigado pela sua paciência."
    },
    mobileAuthPendingView: {
      received: "recebeu sua solicitação",
      denied: "negou sua solicitação",
      ignored: "não respondeu à sua solicitação",
      sending: "Enviando solicitação",
      nonReceived: "Parece que ninguém recebeu sua solicitação...",
      verifyConnection: "Verifique se ambos os dispositivos têm acesso à internet e se o código utilizado está atualizado.",
      waitingConfirmation: "Aguardando confirmação",
      resend: "Reenviar Solicitação"
    }
  },
};