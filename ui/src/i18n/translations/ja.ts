export default {
  translation: {
    common: {
      test: 'テスト中！',
      copy: 'コピー',
      copied: 'コピーしました！',
      save: '保存',
      views: '閲覧数',
      on: 'オン',
      off: 'オフ',
      accept: '受け入れる',
      cancel: 'キャンセル',
      live: 'ライブ',
      example: '例：',
      goHome: 'ホーム',
    },
    time: {
      days_ago: '{{days}}日前',
      months_ago: '{{days}}ヶ月前',
      years_ago: '{{days}}年前',
    },
    layout: {
      theme: {
        switch: 'ダークモードとライトモードの切り替え',
      },
    },
    playerSearch: {
      pasteUrl: 'ここにビデオのURLを貼り付けてください',
      example: '例：',
      playNow: '今すぐ再生',
      playNext: 'キューに次に追加',
      playLast: 'キューに追加',
      added: 'キューにアイテムが追加されました！',
      errors: {
        video_not_found: '申し訳ありません、リクエストされたビデオが見つかりませんでした',
        malformed_url: '提供されたURLはYouTubeビデオに対応していません',
        shorts_url: '申し訳ありませんが、ショート動画はYouTube外では視聴できません',
        unknown: '申し訳ありません、何かが間違っているようです',
      },
    },
    playerQueue: {
      next: '次へ',
      playing: '現在再生中',
      queue: 'キュー',
      playNow: '今すぐ再生',
      remove: '削除',
      clear: 'クリア',
      moveNext: 'キューの次に移動',
      moveLast: 'キューの最後に移動',
      loop: 'ループ',
      clearQueue: { title: 'キューをクリア', description: 'キューからすべてのビデオを削除しますか？' },
    },
    player: {
      exitFullscreen: 'フルスクリーンを終了',
      fullscreen: 'フルスクリーン',
      playbackRate: '再生速度',
      volume: '音量',
      playingInDesktop: 'デスクトップで再生中',
    },
    connection: {
      connectDevice: 'デバイスに接続',
      connectDescription: '新しいデバイスに接続するには、接続したいデバイスから次のQRコードをスキャンする必要があります：',
      copyLink: 'リンクをコピー',
      copyCode: 'コードをコピー',
      regenCode: 'コードを再生成',
      settingsLink: '設定と接続されたデバイス',
      userRequest: '<0>{{nickname}}</0> がプレイヤーセッションに参加を要求しています',
      accept: '受け入れる',
      reject: '拒否する',
      automaticAuth: '新しいデバイスを自動的に承認',
      regenConfirmation: {
        title: '認証コードを再生成しますか？',
        description: '現在のデバイスは接続されたままですが、共有したアクセスコードは無効になります。',
      },
    },
    connectionView: {
      deviceName: 'あなたのデバイス名は次のとおりです：',
      devices: {
        title: 'デスクトップに接続',
        description: '接続するには、デスクトップデバイスの「デバイスに接続」セクションに表示されるQRコードをスキャンしてください',
        scanQR: 'QRコードをスキャン',
        alternative: '代替として、<0>認証コード</0>を入力できます',
      },
      notifications: {
        AUTH_REVOKED: 'プレイヤーセッションから切断されました',
        SESSION_ENDED: 'プレイヤーセッションが終了しました',
      },
    },
    settings: {
      settings: '設定',
      general: '一般',
      displayName: {
        title: '表示名',
        description: '他のデバイスに表示される方法',
        invalid: '3文字から100文字の間で指定してください',
      },
      language: '言語',
      feedbackTooltip: 'フィードバックを送信する/エラーを報告する',
      session: {
        title: 'セッションの終了',
        description: 'デバイスの切断',
        button: '切断',
      },
      hostSession: {
        title: 'セッション',
        description: 'セッションを終了し、すべてのデバイスを切断します',
        button: '終了',
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
        description: '選択した言語に応じて、一部のフォントが正しく機能しない場合があります',
      },
      glassTheme: {
        title: 'ガラステーマ',
        description: 'テキストの読みにくさを感じる場合は、ガラスモードを無効にします',
      },
      colorMode: 'カラーモード',
      colorModes: {
        light: 'ライト',
        dark: 'ダーク',
      },
      connections: '接続',
      devices: {
        title: '自動承認',
        description: '新しいデバイスを自動的に承認します',
      },
      authorizedDevices: {
        title: '承認済みデバイス',
        empty: 'まだデバイスを承認していません',
        revoke: '取り消す',
        revokeAll: 'すべて取り消す',
      },
    },
    deviceSelection: {
      title: 'モバイルデバイスを使用してPCでYouTubeビデオ再生を管理します。',
      description:
        'PCの画面の前にいる必要はなく、Wi-Fiネットワークに接続している必要もありません。一時停止、再生、音量調整、ビデオの変更などの操作を行うことができます 😎。',
      selectPrompt: 'このデバイスの使用方法を選択してください：',
      receptor: {
        title: 'レシーバー',
        description: 'このデバイスをレシーバーとして使用したい場合、他のデバイスからコンテンツを送信してここで再生できるようにします。',
        confirmation: {
          title: 'レシーバーモードで続行しますか？',
          description:
            'レシーバーモードはモバイルデバイスに最適化されていません。レシーバーモードで続行できますが、<0>ユーザーエクスペリエンスが最適でない可能性があることを認識してください</0>。',
        },
      },
      emitter: {
        title: 'エミッター',
        description:
          'このデバイスからデバイス、たとえば携帯電話や別のコンピューターからコンテンツをストリームする場合は、エミッターモードを選択します。再生を簡単に制御し、PCで何を視聴するかを選択できます。',
        confirmation: {
          title: 'エミッターモードで続行しますか？',
          description:
            'エミッターモードは主に<0>モバイルデバイス</0>向けに設計されています。エミッターモードで続行できますが、<0>ユーザーエクスペリエンスが最適でない可能性があることを認識してください</0>。',
        },
      },
    },
    receptorWelcome: {
      begin: '始めましょう！',
      description1: '新しいデバイスを簡単に接続するには、接続したいデバイスから<0>QRコードをスキャン</0>できます。',
      description2: 'また、このデバイスからキューにビデオを追加し、後でデバイスを接続することもできます。お手伝いできることを願っています 😊！',
      backConfirm: {
        title: '最初に戻ることを確認しますか？',
        description: '関連付けられたデバイスが失われ、再接続する必要があります。',
      },
    },
    notifications: {
      addToQueue: '<0>{{nickname}}</0> がキューにビデオを追加しました',
      joined: '<0>{{nickname}}</0> が参加しました',
      desktop_offline: '<0>{{nickname}}</0> がオフラインになりました',
      desktop_offline_recovered: '<0>{{nickname}}</0> が再びオンラインになりました！',
      offline: 'オフラインです',
      offline_recovered: 'オンラインに戻りました！',
      awaiting_reconnection: '再接続を待っています',
      disconnect_device: 'このデバイスを切断する',
    },
    contact: {
      title: 'お問い合わせ',
      description: 'どんな種類のフィードバックやエラーや矛盾を報告することができます。',
      email: {
        label: 'メールアドレス',
        placeholder: 'メールアドレス',
      },
      message: {
        label: 'メッセージ / エラーレポート',
        placeholder: 'こちらにメッセージを残してください。改善点や遭遇した問題などを教えていただけます。',
      },
      send: '送信',
      errors: {
        empty_message: 'メッセージを入力してください',
        invalid_email: '有効なメールアドレスを入力してください',
        message_too_long: 'メッセージが長すぎます',
        not_sent: '申し訳ありません、メッセージを送信できませんでした 😢。後で再試行してみてください。',
      },
      messageSent: 'メッセージが送信されました',
      feedbackThanks: 'フィードバックありがとうございます！',
      close: '閉じる',
    },
    tabChecker: {
      error: '別のタブからページが開かれたようです。<0></0>他のタブを停止して、このタブから再生を続行しますか？',
      button: 'このタブから続行',
    },
    roomSwitch: {
      description: '別のセッションに接続しようとしているようです。現在のセッションを終了し、新しいセッションに接続をリクエストしますか？',
      accept: 'セッションを終了',
      skip: '同じセッションを続行',
    },
    qrScanner: {
      title: 'QRコードをスキャン',
      errors: {
        camera_missing: 'QRコードをスキャンするカメラが見つかりません',
        default: 'カメラを起動できませんでした',
        invalid_url: 'スキャンしたコードは有効なURLに対応していません',
      },
    },
    maintenance: {
      title: '申し訳ありません、サーバーが正しく動作していないようです...',
      description: '数分後にもう一度お試しください',
    },
    errorView: {
      title: 'おっと！これを見てはいけません...',
      description: 'この問題が続く場合、このサイトのナビゲーションデータを削除してみてください。',
      refresh: 'ページをリロード',
      erase: 'ナビゲーションデータを削除',
      notify: '問題を通報',
    },
  },
};
