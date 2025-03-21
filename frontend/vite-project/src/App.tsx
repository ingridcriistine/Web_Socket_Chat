import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const WS_URL = "ws://10.68.20.18:3000/";

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  const { sendMessage, lastMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("✅ Conectado ao WebSocket");
      setConnected(true);
    },
    onClose: () => {
      console.log("❌ Desconectado do WebSocket");
      setConnected(false);
    },
    shouldReconnect: () => true, // Tenta reconectar automaticamente se desconectar
  });

  useEffect(() => {
    if (lastMessage?.data) {
      setMessages((prev) => [...prev, lastMessage.data]);
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    if (!username.trim()) {
      alert("Digite seu nome antes de enviar mensagens!");
      return;
    }
    if (message.trim()) {
      sendMessage(`${username}: ${message}`);
      setMessage(""); // Limpar o campo após enviar
    }
  };

  return (
    <div style={styles.container}>
      <h2>Chat WebSocket</h2>

      {!connected ? (
        <p style={{ color: "red" }}>Conectando ao servidor...</p>
      ) : (
        <p style={{ color: "green" }}>Conectado!</p>
      )}

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Digite seu nome..."
        style={styles.input}
      />

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite uma mensagem..."
        disabled={!connected}
        style={styles.input}
      />
      <button
        onClick={handleSendMessage}
        disabled={!connected}
        style={connected ? styles.button : styles.buttonDisabled}
      >
        Enviar
      </button>
    </div>
  );
}

// Estilos inline
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: "20px",
  },
  chatBox: {
    border: "1px solid #ccc",
    padding: "10px",
    height: "200px",
    overflowY: "auto" as const,
    marginBottom: "10px",
    background: "#fff",
    width: "300px",
  },
  input: {
    width: "280px",
    padding: "8px",
    margin: "5px 0",
    fontSize: "14px",
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  buttonDisabled: {
    padding: "8px 12px",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    cursor: "not-allowed",
    fontSize: "14px",
  },
};
