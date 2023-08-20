import { BadRequestException } from '@nestjs/common';

enum RoomType {
  // NAME -> PREFIX
  AUTH = 'auth',
  PLAYER = 'player',
  USER = 'user',
  INVALID = 'invalid',
}

export const getRoomType = (room: string): RoomType => {
  if (!room) return RoomType.INVALID;
  return Object.values(RoomType).find((type) => room.startsWith(type + '-')) ?? RoomType.INVALID;
};

export const checkRoomType = (room: string, type: RoomType): boolean => {
  const valid = getRoomType(room) === type;
  if (!valid) {
    throw `Provided room (${room}) is not a valid ${type} room`;
  }
  return valid;
};

export default RoomType;
