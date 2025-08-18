import { Injectable } from '@nestjs/common';
import { IVideoProvider } from '../interfaces/video-provider.interface';

@Injectable()
export class DailyAdapterProvider implements IVideoProvider {
  async createRoom(appointmentId: string) {
    // TODO: implement with DAILY_API_KEY from env
    const roomId = `daily-${appointmentId}`;
    const url = `https://daily.mock/${roomId}`;
    return { roomId, url };
  }

  async createToken(
    roomId: string,
    userId: string,
    role: 'patient' | 'doctor',
  ) {
    return `daily-token-${roomId}-${userId}-${role}`;
  }

  async endRoom(_roomId: string) {
    // TODO: call Daily API to end room
  }
}
