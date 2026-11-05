import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { NotFoundPage } from './NotFoundPage';
import { HomePage } from '../features/home/ui/HomePage';
import { WorkoutPage } from '../features/workout/ui/WorkoutPage';
import { ProgramsPage } from '../features/program/ui/ProgramsPage';
import { BodyPage } from '../features/body/ui/BodyPage';
import { ProgressPage } from '../features/progress/ui/ProgressPage';
import { ExportPage } from '../features/export/ui/ExportPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/workout', element: <WorkoutPage /> },
      { path: '/programs', element: <ProgramsPage /> },
      { path: '/body', element: <BodyPage /> },
      { path: '/progress', element: <ProgressPage /> },
      { path: '/export', element: <ExportPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
