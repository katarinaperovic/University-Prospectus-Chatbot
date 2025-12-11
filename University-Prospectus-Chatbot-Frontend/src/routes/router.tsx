import { AppLayout } from "@/layout";
import { ChatPage } from "@/pages/home";
import { PageNotFound } from "@/pages/not-found";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const getRouter = () => 
    createBrowserRouter([
        {
            path: '/',
            element: <AppLayout />,
            children: [
                {
                    index: true,
                    element: <ChatPage />
                },
            ]
        },
        {
            path: '*',
            element: <PageNotFound />
        }
    ])


export const Router = () => {
    const router = getRouter()
    return <RouterProvider router={router} />
}