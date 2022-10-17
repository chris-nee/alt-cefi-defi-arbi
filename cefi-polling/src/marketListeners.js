/* Helpers */
import { CefiSocketListener } from "./listeners/index.js";

const WSBaseEndPointBinance = "wss://stream.binance.com:9443";
const BinanceStreams = "/stream";
const BinanceUnSubscribeMsgFormatter = (streamName) =>
  JSON.stringify({
    method: "UNSUBSCRIBE",
    params: [streamName],
    id: Date.now(),
  });
const BinanceSubscribeMsgFormatter = (streamName) =>
  JSON.stringify({
    method: "SUBSCRIBE",
    params: [streamName],
    id: Date.now(),
  });

const WSBaseEndPointFtx = "wss://ftx.com/ws/";
const FtxSubscribeMsgFormatter = (channelName) =>
  JSON.stringify({
    op: "subscribe",
    channel: "orderbook",
    market: `${channelName}`,
  });

const FtxUnSubscribeMsgFormatter = (channelName) =>
  JSON.stringify({
    op: "unsubscribe",
    channel: "orderbook",
    market: `${channelName}`,
  });

async function startListeners() {
  try {
    /* Start WS */
    const binanceListener = new CefiSocketListener(
      WSBaseEndPointBinance + BinanceStreams,
      "BINANCE"
    );
    const ftxListener = new CefiSocketListener(WSBaseEndPointFtx, "FTX");

    /* Start Listening */
    await Promise.all([binanceListener.startWS(), ftxListener.startWS()]);

    /* Register subscriber functions */
    binanceListener.registerSubscribeMsgFormatter(BinanceSubscribeMsgFormatter);
    binanceListener.registerUnSubscribeMsgFormatter(
      BinanceUnSubscribeMsgFormatter
    );
    ftxListener.registerUnSubscribeMsgFormatter(FtxUnSubscribeMsgFormatter);
    ftxListener.registerSubscribeMsgFormatter(FtxSubscribeMsgFormatter);

    binanceListener.subscribe("bnbusdt@bookTicker");
    ftxListener.subscribe("BTC-PERP");

    return [
      ["BINANCE", binanceListener],
      ["FTX", ftxListener],
    ];
  } catch (e) {
    throw "Error starting listen";
  }
}

export { startListeners };
