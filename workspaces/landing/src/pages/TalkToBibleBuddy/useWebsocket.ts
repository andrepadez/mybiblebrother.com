import { useState, useEffect, useRef } from 'react';
const { VITE_API_URL } = import.meta.env;

export const useWebsocket = () => {
  const [online, setOnline] = useState<boolean>(false);
  const socketRef = useRef<WebSocket>(null);

  useEffect(() => {
    connectSocket();
  }, [])



  const onSocketOpen = () => {
    setOnline(true);
  };

  const onSocketClose = () => {
    // console.log('Disconnected from server', key);
    setOnline(false);
    // Attempt to reconnect after a delay
    setTimeout(() => connectSocket(), 1000);
  };

  const onSocketError = () => {
    setOnline(false);
    setTimeout(() => connectSocket(), 200);
  };

  const connectSocket = () => {
    const serverUrl = `${VITE_API_URL}/ws`;

    if (!serverUrl) return;

    const socket = new WebSocket(`${serverUrl}`);
    socketRef.current = socket;

    socket.addEventListener('open', onSocketOpen);
    socket.addEventListener('close', onSocketClose);
    socket.addEventListener('error', onSocketError);
  };

  const socketSend = (payload: any) => {
    if (!socketRef.current) return;
    socketRef.current.send(JSON.stringify(payload));
  };

  const onmessage = (callback: (message: MessageEvent) => void) => {
    if (!socketRef.current) return;
    socketRef.current.onmessage = callback;
  };

  return { online, socketSend, onmessage };

}