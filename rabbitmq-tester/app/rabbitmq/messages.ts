import { MessageChannel } from 'worker_threads';

export interface OpenDoorMessage {
  type: 'open_door';
  payload: {
    office: string;
    origin: string;
  };
}

export interface DoorOpenedMessage {
  type: 'door_opened';
  payload: {
    office: string;
  };
}

export const isValidMessage = (message: any): message is AllMessages =>
  !(
    message == undefined ||
    message.type !== 'open_door' ||
    message.type !== 'open_door' ||
    message.payload == undefined ||
    message.payload.office == undefined ||
    (message.type === 'open_door' && message.payload.origin == undefined)
  );

export type AllMessages = OpenDoorMessage | DoorOpenedMessage;
