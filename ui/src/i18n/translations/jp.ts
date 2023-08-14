export default {
  translation: {
    common: {
      test: 'テスト中！',
      copy: 'コピー',
      copied: 'コピーしました！',
      save: '保存',
    },
    time: {
      days_ago: '{{days}} 日前',
      months_ago: '{{days}} か月前',
      years_ago: '{{days}} 年前',
    },
    layout: {
      theme: {
        switch: '明るいテーマと暗いテーマの切り替え',
      },
    },
    playerSearch: {
      pasteUrl: 'ビデオのURLをここに貼り付け',
      example: '例：',
      errors: {
        video_not_found: '申し訳ありませんが、リクエストされたビデオが見つかりませんでした',
        malformed_url: '提供されたURLはYouTubeのビデオに対応していません',
        shorts_url: '申し訳ありませんが、ショート動画はYouTube以外で視聴できません',
        unknown: '申し訳ありません、何か問題が発生しました',
      },
    },
    playerQueue: {
      next: '次へ',
      playing: '再生中',
      queue: 'キュー',
      playNow: '今すぐ再生',
      remove: '削除',
      clear: 'クリア',
    },
    connection: {
      connectDevice: 'デバイスを接続',
      connectDescription: '新しいデバイスを接続するには、接続したいデバイスから次のQRコードをスキャンする必要があります。',
    },
    settings: {
      settings: '設定',
      general: '一般',
      displayName: { title: '表示名', description: '他のデバイスに表示される方法' },
      language: '言語',
      languages: {
        en: '英語',
        es: 'スペイン語',
        pt: 'ポルトガル語',
        jp: '日本語',
      },
      appearance: '外観',
      fontSize: 'フォントサイズ',
      fontSizes: {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      },
      fontFamily: {
        title: 'フォントファミリー',
        description: '選択した言語によっては、一部のフォントが正しく動作しないことがあります',
      },
      glassTheme: {
        title: 'ガラステーマ',
        description: 'テキストを読みにくくする場合はガラスモードを無効にします',
      },
      colorMode: 'カラーモード',
      colorModes: {
        light: '明るい',
        dark: '暗い',
      },
      connections: '接続',
      devices: {
        title: '接続済みデバイス',
        description: '新しいデバイスを自動的に認証しないでください',
      },
    },
  },
};
