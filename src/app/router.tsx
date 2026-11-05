import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { NotFoundPage } from './NotFoundPage';
import { WorkoutPage } from '../features/workout/ui/WorkoutPage';
import { WorkoutStartPage } from '../features/workout/ui/WorkoutStartPage';
import { HomeRoute } from './HomeRoute';
import { ProgramsPage } from '../features/program/ui/ProgramsPage';
import { ProgramPage } from '../features/program/ui/ProgramPage';
import { ExerciseCatalogPage } from '../features/program/ui/ExerciseCatalogPage';
import { BodyPage } from '../features/body/ui/BodyPage';
import { StatsPage } from './StatsPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomeRoute /> },
      { path: '/workout/start/:programId/:sessionId', element: <WorkoutStartPage /> },
      { path: '/workout/:workoutId', element: <WorkoutPage /> },
      { path: '/programs', element: <ProgramsPage /> },
      { path: '/programs/exercises', element: <ExerciseCatalogPage /> },
      { path: '/programs/:programId', element: <ProgramPage /> },
      { path: '/body', element: <BodyPage /> },
      { path: '/stats', element: <StatsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
