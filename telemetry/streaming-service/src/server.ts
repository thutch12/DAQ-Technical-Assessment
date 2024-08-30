import net from "net";
import { json } from "stream/consumers";
import { WebSocket, WebSocketServer } from "ws";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });
const MAX_TEMP_SAFE = 80;
const MIN_TEMP_SAFE = 20;
const TEMP_TIME_WINDOW = 5000;
const TEMP_EXCEEDANCE_LIMIT = 3;

let badTemps : number[] = [];

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  socket.on("data", (msg) => {
    console.log(`Received: ${msg.toString()}`);

    try {
      const jsonData: VehicleData = JSON.parse(msg.toString());

      // check if temp is in safe range
      if (jsonData.battery_temperature > MAX_TEMP_SAFE || jsonData.battery_temperature < MIN_TEMP_SAFE) {
        badTemps.push(jsonData.timestamp);
      }

      // filter out temps older than 5 seconds and throw error if limit exceeded
      badTemps = badTemps.filter(
        (timestamp) => jsonData.timestamp - timestamp <= TEMP_TIME_WINDOW
      );

      if (badTemps.length > TEMP_EXCEEDANCE_LIMIT) {
        console.error(`Error: Temp breaking thresholds at ${Date.now()}`);
      }

      // Send JSON over WS to frontend clients
      websocketServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(msg.toString());
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("JSON parse failed", error.message);
      }
      else {
        console.error("Unknown error", error);
      }
    }
  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error: ", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`Websocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend websocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});
