import { WebSocketServer } from "ws";

/* Constants */
import { PORT, HOST } from "./constants.js";

function log(...params) {
  console.log(`[WEBSOCKET SERVER]: `, ...params);
}

class SocketServer {
  constructor() {
    this.ws = null;
    this.clientsSet = new Set();
  }

  startWs() {
    if (!this.ws) {
      this.ws = new WebSocketServer({
        host: HOST,
        port: PORT,
      });
    }

    return new Promise((res) => {
      this.ws.on("connection", (clientSocket) => {
        log("Connected");
        this.registerClient(clientSocket);
        clientSocket.on("close", () => {
          this.unregisterClient(clientSocket);
        });
      });

      this.ws.on("listening", () => res());
    });
  }

  sendEventToClients(eventName, msgString) {
    const msg = JSON.stringify({
      type: eventName,
      [eventName]: msgString,
    });

    this.clientsSet.forEach((client) => client.send(msg));
  }

  registerClient(clientSocket) {
    this.clientsSet.add(clientSocket);
  }

  unregisterClient(clientSocket) {
    this.clientsSet.delete(clientSocket);
  }
}

export { SocketServer };
