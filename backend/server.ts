import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000, host: "0.0.0.0" });

wss.on("connection", (ws) => {
  console.log("🟢 Novo cliente conectado!");

  ws.on("message", (message) => {
    console.log(`📩 Mensagem recebida: ${message}`);

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => console.log("🔴 Cliente desconectado"));
});

console.log("🚀 Servidor WebSocket rodando na porta 3000...");
