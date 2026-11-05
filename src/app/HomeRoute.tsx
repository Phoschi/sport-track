import { HomePage } from '../features/home/ui/HomePage';
import { CurrentWorkoutBanner } from '../features/workout/ui/CurrentWorkoutBanner';

/** Assembles home with the workout banner; features never import each other's UI. */
export function HomeRoute() {
  return (
    <>
      <CurrentWorkoutBanner />
      <HomePage />
    </>
  );
}
