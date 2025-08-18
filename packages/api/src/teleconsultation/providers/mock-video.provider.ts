import { Injectable } from '@nestjs/common';
import { IVideoProvider } from '../interfaces/video-provider.interface';

@Injectable()
export class MockVideoProvider implements IVideoProvider {
  async createRoom(appointmentId: string) {
    const roomId = `mock-room-${appointmentId}`;
    const url = `https://mock.video/${roomId}`;
    return { roomId, url };
  }

  async createToken(
    roomId: string,
    userId: string,
    role: 'patient' | 'doctor',
  ) {
    return `mock-token-${roomId}-${userId}-${role}`;
  }

  async endRoom(_roomId: string) {
    // noop
  }
}
