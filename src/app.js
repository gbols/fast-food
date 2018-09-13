import express from 'express';
import Router from './routes/router';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/users', Router);

app.listen(port, () => console.log('listening on port 3000'));

export default app;
