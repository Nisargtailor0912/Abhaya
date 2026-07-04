import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store for OTPs. In production, use a database.
  const otps = new Map<string, { otp: string; expiresAt: number }>();

  // Use a default ethereal account or real SMTP for testing
  // Ideally, use environment variables for this.
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Automatically create a test account if no credentials are provided
  let defaultAccount: nodemailer.TestAccount | null = null;
  if (!process.env.SMTP_USER) {
    try {
      defaultAccount = await nodemailer.createTestAccount();
      const options = transporter.options as any;
      options.host = "smtp.ethereal.email";
      options.port = 587;
      options.secure = false;
      options.auth = {
        user: defaultAccount.user,
        pass: defaultAccount.pass,
      };
      console.log("Using generated Ethereal test account for emails.");
    } catch (e) {
      console.error("Failed to create test account", e);
    }
  }

  app.post("/api/send-otp", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otps.set(email.toLowerCase(), { otp, expiresAt });

    try {
      const info = await transporter.sendMail({
        from: '"Abhaya Security App" <no-reply@abhaya.com>',
        to: email,
        subject: "Your OTP for Abhaya App",
        text: `Your OTP is: ${otp}`,
        html: `<b>Your OTP is: ${otp}</b>`,
      });

      console.log("Message sent: %s", info.messageId);
      if (defaultAccount) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
      
      res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send OTP email" });
    }
  });

  app.post("/api/verify-otp", (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const record = otps.get(email.toLowerCase());
    if (!record) {
      return res.status(400).json({ error: "No OTP requested for this email" });
    }

    if (Date.now() > record.expiresAt) {
      otps.delete(email.toLowerCase());
      return res.status(400).json({ error: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP is valid
    otps.delete(email.toLowerCase());
    res.json({ success: true, message: "OTP verified successfully" });
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
