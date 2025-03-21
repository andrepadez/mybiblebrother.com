export const onSocketMessage = async (ws: any, message: string) => {
  const socket = ws as WebSocket;
  console.log('WEBSOCKET: message', message);
  const payload = {
    type: 'agent-message',
    message: {
      content: loremipsum,
      role: 'agent',
    },
  };
  // for (let i = 0; i < 10; i++) {
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   socket.send(JSON.stringify(payload))
  // }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  socket.send(JSON.stringify({ ...payload, finished: true }))
}


const loremipsum = `
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
`

