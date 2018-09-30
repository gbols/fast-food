import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import Router from './routes/route';
import swaggerDocument from '../swagger.json';
import { errorHanlder } from './controllers/user';
import { welcomeMessage } from './controllers/admin';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', welcomeMessage);

app.use('/api/v1', Router);
app.use(errorHanlder);

app.listen(port, () => console.log(`listening on port ${port}`));

export default app;
