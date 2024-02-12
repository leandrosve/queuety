import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import MaintenanceView from '../components/app/shared/maintenance/MaintenanceView';
import AppContent from '../AppContent';
import { ErrorView } from '../components/app/shared/maintenance/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/app',
    element: <AppContent />,
    errorElement: <ErrorView />,
  },
  {
    path: '/maintenance',
    element: <MaintenanceView />,
    errorElement: <ErrorView />,
  },
  {
    path: '*',
    element: <Navigate to='/app' replace/>,
  },
]);

const MainRouter = () => <RouterProvider router={router} />;

export default MainRouter;
