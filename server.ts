import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock payment state
  const mockPayments = new Map<string, boolean>();

  // API routes
  app.post("/api/validate-account", (req, res) => {
    const { gameId, userId, zoneId } = req.body;
    
    if (!userId || userId.length < 5) {
      return res.status(400).json({ valid: false, message: "User ID tidak valid (minimal 5 karakter)." });
    }
    
    if (gameId === 'mlbb') {
      if (!zoneId || zoneId.length < 4) {
         return res.status(400).json({ valid: false, message: "Zone ID tidak valid (minimal 4 karakter)." });
      }
    }
    
    // Simulate invalid ID
    if (userId === "12345" || userId.includes("salah")) {
      return res.status(400).json({ valid: false, message: "Akun tidak ditemukan. Silakan periksa kembali User ID." });
    }

    return res.json({ valid: true, nickname: "Player_" + userId.substring(0, 4) });
  });

  app.get("/api/payment-status/:orderId", (req, res) => {
    const status = mockPayments.get(req.params.orderId) || false;
    res.json({ paid: status });
  });

  app.post("/api/pay/:orderId", (req, res) => {
    mockPayments.set(req.params.orderId, true);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
