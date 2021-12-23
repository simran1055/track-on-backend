import './db/index'
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import ejs from 'ejs';

import authRoutes from './routes/auth';
import projectRoutes from './routes/project';

const app = express();

const PORT = 4000; //Server Port

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.set('views', './public');
app.set('view engine', 'ejs');

app.use("/api", authRoutes);
app.use("/api", projectRoutes);

app.use('//', (req, res) => {
    res.send('Welcome :)')
});

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})