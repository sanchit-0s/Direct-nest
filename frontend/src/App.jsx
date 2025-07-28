import HomePage from "./routes/homePage/homePage";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import Layout from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/ProfileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import ContactPage from "./pages/contactPage/ContactPage";
import { AuthProvider } from "./context/AuthContext";
import PaymentPage from "./routes/paymentPage/PaymentPage";
import AboutPage from "./routes/about/AboutPage";
import AgentPage from "./routes/agent/AgentPage"


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children:[
        {
          path:"/",
          element:<HomePage/>
        },
        {
           path: "contact",
           element: <ContactPage />,
        },
        {
          path:"/list",
          element:<ListPage/>
        },
        {
          path:"/agent",
          element:<AgentPage/>
        },
        {
          path:"/about",
          element:<AboutPage/>
        },
        {
          path:"/post/:id",
          element:<SinglePage/>
        },
        {
          path:"/profile",
          element:<ProfilePage/>
        },
        {
          path:"/login",
          element:<Login/>
        },
        {
          path:"/register",
          element:<Register/>
        },
        {
          path:"/add",
          element:<NewPostPage/>
        },
         {
          path:"/profile/update",
          element:<ProfileUpdatePage/>
        },
        {
            path:"/payment/:id",
            element:<PaymentPage/>
        }
      ]
      
    }
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;