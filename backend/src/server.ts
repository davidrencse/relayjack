import http from "http";
import { WebSocketServer } from "ws";
import { createApp } from "./app";
import { createInitialData } from "./seed";
import { setBroadcaster, setDiagnosticsProvider } from "./services";
import { store } from "./storage";
import { WsServerEvent } from "./types";

const port = Number(process.env.PORT || 4000);
store.setInitialDataFactory(createInitialData);

const app = createApp();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

setDiagnosticsProvider(() => ({ wsClients: wss.clients.size }));
setBroadcaster((event: WsServerEvent) => {
  const message = JSON.stringify(event);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
});

wss.on("connection", (socket) => {
  const event: WsServerEvent = { channel: "sync.notice", payload: { message: "connected" }, timestamp: new Date().toISOString() };
  socket.send(JSON.stringify(event));
});

server.listen(port, () => {
  console.log(`RelayJack backend listening on port ${port}`);
});
