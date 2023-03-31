import { type CorsOptions, opineCors } from 'cors';
import { json, opine } from 'opine';
import { elmedenoMiddleware } from '~/middleware/elmedeno.ts';
import { errorHandler } from '~/middleware/error_handler.ts';
import rateLimit from '~/middleware/rate_limiter.ts';
import apiRouter from '~/router/api.ts';
import log from '~/util/logger.ts';
import config from '~/config.ts';

const { cors } = config;

const app = opine();

const corsOptions: CorsOptions = {
  origin: cors.origin,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(json());
app.use(elmedenoMiddleware);
app.use(opineCors(corsOptions));
app.use(rateLimit);

app.get('/', (_req, res) => {
  res.send('Welcome to CPT');
});

app.use(
  '/api',
  apiRouter([]),
);

app.use(errorHandler);

app.listen({ port: 3000 }, () => {
  log.info(`Server is started...`);
});
