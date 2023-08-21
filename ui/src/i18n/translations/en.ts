export default {
  translation: {
    common: {
      test: 'testing!',
      copy: 'Copy',
      copied: 'Copied!',
      save: 'Save',
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
        shorts_url: 'Sorry, unfortunately shorts cannot be watched outside YouTube',
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
    },
    connection: {
      connectDevice: 'Connect Device',
      connectDescription: 'To connect a new device, you must scan the following QR code from the device you wish to connect:',
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
  },
};
