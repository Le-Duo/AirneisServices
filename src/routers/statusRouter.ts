import { Router } from 'express';
import { isAuth, isAdmin } from '../utils';

const statusRouter = Router();

statusRouter.get('/', (req, res) => {
  // Here you could add more detailed health checks
  res.send('API is running');
});

statusRouter.get('/admin-only-route', isAuth, isAdmin, (req, res) => {
  res.send('Admin only route')
})

export { statusRouter };
