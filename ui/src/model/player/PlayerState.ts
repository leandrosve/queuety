// According to Youtube embeds API
enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
  AWAITING_PLAYING = 6, // Only for mobile to indicate that it's awaiting desktop's response
  AWAITING_PAUSED = 7,
}

export default PlayerState;
