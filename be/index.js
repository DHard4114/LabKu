const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
{/*}
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONT_END_URL,
      'https://lab-ku.vercel.app',
      'http://localhost:3000',
      'https://lab-ku.vercel.app/',
      'https://lab-4561gzjh4-daffa-hardhans-projects.vercel.app'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
*/}



// Izinkan semua origin
app.use(cors({
  origin: '*', // <= mengizinkan SEMUA domain mengakses
  credentials: false // <= set false kalau pakai '*' untuk origin
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

userRoutes = require('./src/routes/route.user');
biodataRoutes = require('./src/routes/route.biodata');

app.use('/api/users', userRoutes);
app.use('/api/biodata', biodataRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
