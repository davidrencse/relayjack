import { API_BASE_URL } from './client';
import type { WsServerEvent } from '../types';

export function openEventSocket(onEvent: (event: WsServerEvent) => void, onState: (state: 'connecting' | 'open' | 'closed') => void): () => void {
  const url = API_BASE_URL.replace(/^http/, 'ws') + '/ws';
  let closedByClient = false;
  let socket: WebSocket | null = null;
  const connect = () => {
    onState('connecting');
    try {
      socket = new WebSocket(url);
      socket.onopen = () => onState('open');
      socket.onclose = () => {
        onState('closed');
        if (!closedByClient) window.setTimeout(connect, 4000);
      };
      socket.onerror = () => onState('closed');
      socket.onmessage = (message) => {
        try {
          onEvent(JSON.parse(message.data) as WsServerEvent);
        } catch {
          onState('closed');
        }
      };
    } catch {
      onState('closed');
    }
  };
  connect();
  return () => {
    closedByClient = true;
    socket?.close();
  };
}
