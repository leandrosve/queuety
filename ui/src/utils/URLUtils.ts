export default class URLUtils {
  public static getVideoAndPlaylistId(url: string) {
    // Need to support different URL for videos and playlist
    // E.g. 1 (video only) https://www.youtube.com/watch?v=XXYlFuWEuKI
    // E.g. 2 (video and playlist) https://www.youtube.com/watch?v=XXYlFuWEuKI&list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj
    // E.g. 3 (playlist only) https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj
    let regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*?(?:\&list=([^#\&\?]*))?.*/;
    let match = url.match(regExp);
    let videoId = match?.[1];
    let playlistId = match?.[2];
    let error = '';
    if (!match || match[1].length !== 11) {
      let playlistRegExp = /^.*(?:\?|\&)list=([^#\&\?]*).*/;
      let playlistMatch = url.match(playlistRegExp);
      playlistId = playlistMatch?.[1];
      if (!playlistId) {
        if (url.includes('/shorts/')) {
          error = 'shorts_url';
          return { videoId: null, playlistId: null, error };
        }
        error = 'malformed_url';
        return { videoId: null, playlistId: null, error };
      }
    }

    if (playlistId) {
      if (playlistId.length < 25) {
        error = 'mix_url';
        return { videoId: null, playlistId: null, error };
      }
    }
    return {
      videoId,
      playlistId,
      error,
    };
  }
}
