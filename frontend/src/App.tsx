import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import TournamentsPage from './pages/TournamentsPage';
import TournamentDetailsPage from './pages/TournamentDetailsPage';
import CreateTournamentPage from './pages/CreateTournamentPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const tournamentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tournaments',
  component: TournamentsPage,
});

const tournamentDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tournaments/$tournamentId',
  component: TournamentDetailsPage,
});

const createTournamentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-tournament',
  component: CreateTournamentPage,
});

const myRegistrationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-registrations',
  component: MyRegistrationsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  tournamentsRoute,
  tournamentDetailsRoute,
  createTournamentRoute,
  myRegistrationsRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
