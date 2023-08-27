export enum PlayerStatusActionType {
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  CHANGE_TIME = 'CHANGE_TIME',
  REWIND = 'REWIND',
  FORWARD = 'FORWARD',
  CHANGE_FULLSCREEN = 'CHANGE_FULLSCREEN',
  CHANGE_RATE = 'CHANGE_RATE',
  CHANGE_VOLUME = 'CHANGE_VOLUME',
}

export type PlayerStatusAction =
  | PlayAction
  | PauseAction
  | ChangeTimeAction
  | RewindAction
  | ForwardAction
  | ChangeFullscreenAction
  | ChangeRateAction
  | ChangeVolumeAction;

export type PlayAction = {
  type: PlayerStatusActionType.PLAY;
  payload: null;
};

export type PauseAction = {
  type: PlayerStatusActionType.PAUSE;
  payload: null;
};

export type ChangeTimeAction = {
  type: PlayerStatusActionType.CHANGE_TIME;
  payload: {
    time: number;
  };
};

export type RewindAction = {
  type: PlayerStatusActionType.REWIND;
  payload: {
    seconds: number;
  };
};

export type ForwardAction = {
  type: PlayerStatusActionType.FORWARD;
  payload: {
    seconds: number;
  };
};

export type ChangeFullscreenAction = {
  type: PlayerStatusActionType.CHANGE_FULLSCREEN;
  payload: {
    value: boolean;
  };
};

export type ChangeRateAction = {
  type: PlayerStatusActionType.CHANGE_RATE;
  payload: {
    value: number;
  };
};

export type ChangeVolumeAction = {
  type: PlayerStatusActionType.CHANGE_VOLUME;
  payload: {
    value: number;
  };
};
