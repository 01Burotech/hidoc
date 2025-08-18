export interface IVideoProvider {
  createRoom(appointmentId: string): Promise<{ roomId: string; url: string }>;
  createToken(
    roomId: string,
    userId: string,
    role: 'patient' | 'doctor',
  ): Promise<string>;
  endRoom(roomId: string): Promise<void>;
}
