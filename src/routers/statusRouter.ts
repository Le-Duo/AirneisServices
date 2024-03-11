import { Router } from 'express';
import { isAuth, isAdmin } from '../utils';

const statusRouter = Router();

statusRouter.get('/', (req, res) => {
  res.send('API is running');
});

statusRouter.get('/admin-only-route', isAuth, isAdmin, (req, res) => {
  res.send('Admin only route')
})

export { statusRouter };
