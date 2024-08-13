import { createBrowserRouter } from 'react-router-dom';
import Home from '../component/Home';
import Page from '../component/Page';

const router = createBrowserRouter([
  {
    path: '/juejin/:category_id',
    element: <Home/>
  },
  {
    path: '/juejin/:category_id/:childCategory_id',
    element: <Home/>
  },
  {
    path: '',
    element: <Home/>
  },
  {
    path: '/article/:article_id',
    element: <Page />
  }
]);

export default router;
