export enum PlayerStatusActionType {
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  CHANGE_TIME = 'CHANGE_TIME',
  REWIND = 'REWIND',
  FORWARD = 'FORWARD',
}

export type PlayerStatusAction = PlayAction | PauseAction | ChangeTimeAction | RewindAction;

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
