export default {
  translation: {
    common: {
      test: 'testing!',
      copy: 'Copy',
      copied: 'Copied!',
      save: 'Save',
      views: 'views',
      on: 'on',
      off: 'off',
      accept: 'Accept',
      cancel: 'Cancel',
      live: 'Live',
      example: 'e.g.',
      goHome: 'Home',
    },
    time: {
      days_ago: '{{days}} days ago',
      months_ago: '{{days}} months ago',
      years_ago: '{{days}} years ago',
    },
    layout: {
      theme: {
        switch: 'Switch between dark and light theme',
      },
    },
    playerSearch: {
      pasteUrl: 'Paste here the URL of the video',
      example: 'e.g.',
      playNow: 'Play now',
      playNext: 'Add as next in queue',
      playLast: 'Add to queue',
      errors: {
        video_not_found: "Sorry, we couldn't find the request video",
        malformed_url: 'The provided URL does not correspond to a YouTube Video',
        shorts_url: 'Sorry, unfortunately shorts cannot be watched outside of YouTube',
        unknown: 'Sorry, something went wrong',
      },
    },
    playerQueue: {
      next: 'Next',
      playing: 'Now playing',
      queue: 'Queue',
      playNow: 'Play now',
      remove: 'Remove',
      clear: 'Clear',
      moveNext: 'Move to next in queue',
      moveLast: 'Move to last in queue',
      loop: 'Loop',
      clearQueue: { title: 'Clear Queue', description: 'Are you sure you want to remove all videos from the queue?' },
    },
    player: {
      exitFullscreen: 'Exit Fullscreen',
      fullscreen: 'Fullscreen',
      playbackRate: 'Playback Rate',
      volume: 'Volume',
      playingInDesktop: 'Playing in Desktop',
    },
    connection: {
      connectDevice: 'Connect Device',
      connectDescription: 'To connect a new device, you must scan the following QR code from the device you wish to connect:',
      copyLink: 'Copy Link',
      copyCode: 'Copy Code',
      regenCode: 'Regen code',
      settingsLink: 'Configuration and connected devices',
      userRequest: '<0>{{nickname}}</0> is requesting to join the player session',
      accept: 'Accept',
      reject: 'Reject',
      automaticAuth: 'Automatically authorize new devices',
      regenConfirmation: {
        title: 'Regenerate authorization code?',
        description: 'Current devices will remain connected, but any access codes you have shared will no longer be valid.',
      },
    },
    connectionView: {
      deviceName: 'Your device name is:',
      devices: {
        title: 'Connect to desktop',
        description: 'In order to connect, scan the QR code shown in the <0>Connect Device</0> section of the desktop device',
        scanQR: 'Scan QR',
        alternative: 'Alternatively you can enter the <0>authorization code</0>',
      },
      notifications: {
        AUTH_REVOKED: 'You have been kicked out from the player session',
        SESSION_ENDED: 'The player session has ended',
      },
    },
    settings: {
      settings: 'Settings',
      general: 'General',
      displayName: {
        title: 'Display Name',
        description: "How you'll be presented to other devices",
        invalid: 'Must be between 3 and 100 characters long',
      },
      language: 'Language',
      feedbackTooltip: 'Send feedback/Report errors',
      session: {
        title: 'End Session',
        description: 'Disconnect device',
        button: 'Disconnect',
      },
      hostSession: {
        title: 'Session',
        description: 'Close session and disconnect all devices',
        button: 'End',
      },
      appearance: 'Appearance',
      fontSize: 'Font Size',
      fontSizes: {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      },
      fontFamily: {
        title: 'Font Family',
        description: 'Some fonts may not work as expected depending on the selected language',
      },
      glassTheme: {
        title: 'Glass Theme',
        description: 'Disable glass mode if you find it difficult to read text',
      },
      colorMode: 'Color Mode',
      colorModes: {
        light: 'Light',
        dark: 'Dark',
      },
      connections: 'Connections',
      devices: {
        title: 'Automatic Authorization',
        description: 'Automatically authorize new devices',
      },
      authorizedDevices: {
        title: 'Authorized Devices',
        empty: "You haven't authorized any devices yet",
        revoke: 'Revoke',
        revokeAll: 'Revoke all',
      },
    },
    deviceSelection: {
      title: 'Manage YouTube video playback on your PC through your mobile device.',
      description:
        "You don't need to be in front of your PC screen or on the same Wi-Fi network to perform actions like <0>pause, play, adjust volume, or change videos 😎</0>.",
      selectPrompt: 'Select how you want to use this device:',
      receptor: {
        title: 'Receiver',
        description: 'Choose this mode if you want this device to act as a receiver, allowing other devices to send content for playback here.',
        confirmation: {
          title: 'Do you want to continue in Receiver mode?',
          description:
            'Receiver mode is not optimized for mobile devices. You can still continue in Receiver mode, but you should be aware that <0>the user experience may not be optimal</0>.',
        },
      },
      emitter: {
        title: 'Emitter',
        description:
          'Choose this mode if you want to stream content from your device, such as your mobile phone or another computer, to a receiver. You can easily control playback and choose what to watch on your PC.',
        confirmation: {
          title: 'Do you want to continue in Emitter mode?',
          description:
            'Emitter mode is primarily designed for <0>mobile devices</0>. You can still continue in Emitter mode, but you should be aware that <0>the user experience may not be optimal</0>.',
        },
      },
    },
    receptorWelcome: {
      begin: "Let's get started!",
      description1: 'To easily connect a new device, you can <0>scan the QR code</0> from the device you want to connect.',
      description2: 'You can also start adding videos to the queue from this device and connect devices later. I hope to be of help 😊!',
      backConfirm: {
        title: 'Are you sure you want to go back to the beginning?',
        description: 'Linked devices will be lost, and you will have to reconnect them.',
      },
    },
    notifications: {
      addToQueue: '<0>{{nickname}}</0> has added a video to the queue',
      joined: '<0>{{nickname}}</0> has joined',
      desktop_offline: '<0>{{nickname}}</0> went offline',
      desktop_offline_recovered: '<0>{{nickname}}</0> is back online!',
      offline: 'You are offline',
      offline_recovered: 'Back online!',
      awaiting_reconnection: 'Awaiting reconnection',
      disconnect_device: 'Disconnect this device',
    },
    tabChecker: {
      error: 'It appears the page was opened from another tab.<0></0>Do you want to stop the other tab and continue playing from this one?',
      button: 'Continue from this tab',
    },
    contact: {
      title: 'Contact',
      description: 'You can send us any type of feedback or report any errors or inconsistencies you have encountered.',
      email: {
        label: 'Email',
        placeholder: 'Email',
      },
      message: {
        label: 'Message / Error Report',
        placeholder: "Leave your message here. You can let us know things to improve or any issues you've encountered.",
      },
      send: 'Send',
      errors: {
        empty_message: 'Please enter a message',
        invalid_email: 'Please enter a valid email',
        message_too_long: 'The message is too long',
        not_sent: "We're sorry, the message couldn't be sent 😢. You can try again later.",
      },
      messageSent: 'The message has been sent',
      feedbackThanks: 'Thanks for the feedback!',
      close: 'Close',
    },
    roomSwitch: {
      description:
        'It appears you are trying to connect to another session, do you want to finish the current session and request connecting to the new one?',
      accept: 'Finish Session',
      skip: 'Continue with same session',
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
      title: 'We`re sorry, it seems our servers are not working correctly...',
      description: 'You can try again in a couple of minutes',
    },
    errorView: {
      title: 'Oops! You should`t be seeing this...',
      description: 'If you keep encoutering this problem you can try deleting navigation data for this site.',
      refresh: 'Reload page',
      erase: 'Delete navigation data',
      notify: 'Report issue',

    },
  },
};
