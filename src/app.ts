import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import helmet from 'helmet';

import { welcomeQuery } from './graphiQL_welcome_query';
import { schema } from './schema';

dotenv.config();

const app: express.Application = express();

const helperMiddleware: express.RequestHandler[] = [
    cors({
        methods: ['POST'],
    }),
    bodyParser.json(),
    bodyParser.text({ type: 'application/graphql' }),
    (req: express.Request, res: express.Response, next: any) => {
        if (req.is('application/graphql')) {
            req.body = { query: req.body };
        }
        next();
    },
];
app.use(helmet());
app.use(compression());
app.use('/api', (req: express.Request, res: express.Response, next: any) => {
    res.status(200).json('hello from api');
    next();
});
app.use('/graphql', ...helperMiddleware, graphqlExpress({ schema }));
if (!process.env.PRODUCTION) {
    app.use(
        '/graphiql',
        graphiqlExpress({
            endpointURL: '/graphql',
            query: welcomeQuery,
        })
    );
}

export default app;
