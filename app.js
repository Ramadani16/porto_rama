// app.js
import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes halaman statis
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public/about.html')));
app.get('/projects', (req, res) => res.sendFile(path.join(__dirname, 'public/projects.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public/contact.html')));

// POST kirim email (untuk lokal/testing)
app.post('/api/kirim-pesan', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // simpan di .env
        pass: process.env.GMAIL_PASS  // simpan App Password di .env
      }
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.GMAIL_USER,
      subject: `Pesan dari ${name} - ${subject}`,
      text: message,
      html: `
        <div style="font-family:sans-serif;">
          <h2>Pesan Baru dari Website</h2>
          <p><strong>Nama:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Project:</strong> ${subject}</p>
          <p><strong>Pesan:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `
    });

    res.status(200).json({ message: 'Pesan berhasil dikirim!' });
  } catch (error) {
    console.error('Gagal mengirim email:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengirim pesan.' });
  }
});

// Jalankan server hanya untuk testing lokal
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

export default app; // untuk Vercel, import di serverless function jika perlu
