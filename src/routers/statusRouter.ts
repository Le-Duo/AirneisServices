import { Router } from 'express';

const statusRouter = Router();

statusRouter.get('/', (req, res) => {
  // Here you could add more detailed health checks
  res.send('API is running');
});

export { statusRouter };
