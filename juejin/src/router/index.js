import { createBrowserRouter } from 'react-router-dom';
import Home from '../component/Home';
import Page from '../component/Page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/article/:article_id',
    element: <Page />
  }
]);

export default router;
