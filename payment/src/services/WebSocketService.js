class WebSocketService {
  constructor() {
    this.socket = null;
    this.callbacks = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(token) {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.socket = new WebSocket(`${wsProtocol}//${window.location.host}`);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.socket.send(JSON.stringify({
        type: 'admin-auth',
        token
      }));
    };

    this.socket.onmessage = (event) => {
      try {
        const { event: eventType, data } = JSON.parse(event.data);
        if (this.callbacks[eventType]) {
          this.callbacks[eventType](data);
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    };

    this.socket.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect(token);
        }, this.reconnectDelay);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  on(event, callback) {
    this.callbacks[event] = callback;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default new WebSocketService();
