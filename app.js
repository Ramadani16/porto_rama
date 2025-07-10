const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/projects', (req, res) => {
  res.render('projects'); 
});


app.get('/contact', (req, res) => {
  res.render('contact');
});

// POST kirim email
app.post('/kirim-pesan', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'novalnawarudin1234@gmail.com',
        pass: 'gyrb cbxq gjjb vpmp' // App Password Gmail
      }
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'novalnawarudin1234@gmail.com',
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

    res.status(200).send('Pesan berhasil dikirim!');
  } catch (error) {
    console.error('Gagal mengirim email:', error);
    res.status(500).send('Terjadi kesalahan saat mengirim pesan.');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
