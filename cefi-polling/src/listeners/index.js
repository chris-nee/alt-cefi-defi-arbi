import ws from "ws";

const ERRORS = {
  SOCKET_CREATION: "Error creating socket",
};

class CefiSocketListener {
  constructor(wsEndpoint, name) {
    this.log("Created WS");
    this.ws = new ws(wsEndpoint);
    this.ready = false;
    this.shouldLog = true;
    this.name = name || "Dummy";
    this.subscribeMsgFormatter = (v) => `${v}`;
    this.unSubscribeMsgFormatter = (v) => `${v}`;
  }

  registerSubscribeMsgFormatter(fn) {
    this.subscribeMsgFormatter = fn;
  }

  registerUnSubscribeMsgFormatter(fn) {
    this.unSubscribeMsgFormatter = fn;
  }

  log(...params) {
    if (this.shouldLog) {
      console.log(`[${this.name} WS]: `, ...params);
    }
  }

  setLog(bool) {
    this.shouldLog = Boolean(bool);
  }

  async startWS() {
    this.log("Starting WS");
    return new Promise((res, rej) => {
      if (this.ws === null) {
        rej(ERRORS.SOCKET_CREATION);
      }
      this.ws.on("open", () => {
        this.log("Started WS");
        res();
      });
    });
  }

  send(msg) {
    if (!this.ws) {
      throw ERRORS.SOCKET_CREATION;
    }
    this.log("Sending msg - ", msg);
    this.ws.send(msg);
  }

  subscribe(streamName) {
    const msg = this.subscribeMsgFormatter(streamName);
    this.log("Subscribed to stream name - ", streamName);
    this.send(msg);
  }

  unsubscribe(streamName) {
    const msg = this.unSubscribeMsgFormatter(streamName);
    this.log("Unsubscribed to stream name - ", streamName);
    this.send(msg);
  }

  registerEventListeners(eventType, callback) {
    if (!this.ws) {
      throw ERRORS.SOCKET_CREATION;
    }
    this.log("Register to event - ", eventType);
    this.ws.on(eventType, callback);
  }
}

export { CefiSocketListener };
