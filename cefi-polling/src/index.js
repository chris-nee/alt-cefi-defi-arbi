/* Helpers */
import { SocketServer } from "./socketServer.js";
import { startListeners } from "./marketListeners";

async function main() {
  try {
    const listeners = await startListeners();

    const socketServer = new SocketServer();
    await socketServer.startWs();

    const msgRelay = (listenerName) => (msg) => {
      socketServer.sendEventToClients("message", `[${listenerName}]: ${msg}`);
    };

    listeners.forEach(([listenerName, listener]) =>
      listener.registerEventListeners("message", msgRelay(listenerName))
    );
  } catch (e) {
    console.error("Error main", e);
  }
}

main();
