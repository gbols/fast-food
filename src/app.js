import express from 'express';
import Router from './routes/route';
import { errorHanlder } from './controllers/user';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', Router);
app.use(errorHanlder);

app.listen(port, () => console.log(`listening on port ${port}`));

export default app;
