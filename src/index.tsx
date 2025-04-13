import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter, Link, Outlet } from 'react-router-dom';
import { Register } from './page/register/Register';
import { Login } from './page/login/Login';
import { UpdatePassword } from './page/update_password/UpdatePassword';
import { ErrorPage } from './page/error/ErrorPage';
import { Index } from './page/index';
import { UpdateInfo } from './page/index/info';



const routes = [
  {
    path: "/",
    element: <Index/>, // // 对应 Vue 的 component: Index
    errorElement: <ErrorPage/>,
    children: [
      {
        path: 'update_info',
        element: <UpdateInfo />
      }
    ]
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "update_password",
    element: <UpdatePassword />,
  },
];

// 创建一个基于浏览器 History API 的路由实例（类似 Vue 的 createRouter）
const router = createBrowserRouter(routes);

// 建一个 React 根节点，用于挂载应用（类似 Vue 的 createApp）。
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// 将路由提供器 RouterProvider 渲染到根节点（类似 Vue 的 app.use(router).mount('#app')）
root.render(<RouterProvider router={router}/>);


