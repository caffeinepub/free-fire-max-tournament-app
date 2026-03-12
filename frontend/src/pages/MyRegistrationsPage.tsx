import RequireAuth from '../components/RequireAuth';
import { useGetAllTournaments, useGetTeamRegistrations } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Calendar, MapPin, Users, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyRegistrationsPage() {
  const { identity } = useInternetIdentity();
  const { data: tournaments, isLoading: tournamentsLoading } = useGetAllTournaments();

  const myTournaments = tournaments?.filter((tournament) => {
    return true;
  });

  if (tournamentsLoading) {
    return (
      <RequireAuth>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-32 w-full mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Registrations</h1>
          <p className="text-muted-foreground">View and manage your tournament registrations</p>
        </div>

        {myTournaments && myTournaments.length > 0 ? (
          <div className="space-y-4">
            {myTournaments.map((tournament) => (
              <TournamentRegistrationCard key={tournament.id.toString()} tournament={tournament} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Registrations Yet</h3>
              <p className="text-muted-foreground mb-6">You haven't registered for any tournaments</p>
              <Link to="/tournaments">
                <Button>Browse Tournaments</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </RequireAuth>
  );
}

function TournamentRegistrationCard({ tournament }: { tournament: any }) {
  const { identity } = useInternetIdentity();
  const { data: registrations } = useGetTeamRegistrations(tournament.id);

  const myRegistration = registrations?.find(
    (reg) => identity && reg.captain.toString() === identity.getPrincipal().toString()
  );

  if (!myRegistration) return null;

  const startDate = new Date(Number(tournament.startTime) / 1000000);

  const statusColors = {
    draft: 'bg-muted text-muted-foreground',
    open: 'bg-chart-2/20 text-chart-2',
    locked: 'bg-chart-4/20 text-chart-4',
    started: 'bg-chart-1/20 text-chart-1',
    completed: 'bg-muted text-muted-foreground',
    cancelled: 'bg-destructive/20 text-destructive',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <CardTitle className="mb-2">{tournament.name}</CardTitle>
            <CardDescription>{tournament.description}</CardDescription>
          </div>
          <Badge className={statusColors[tournament.status]}>{tournament.status.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{startDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{tournament.region}</span>
          </div>
        </div>

        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium mb-2">Your Team</div>
          {myRegistration.teamName && (
            <div className="text-sm text-muted-foreground mb-2">Team: {myRegistration.teamName}</div>
          )}
          <div className="flex flex-wrap gap-1">
            {myRegistration.members.map((member: any, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {member.ign}
              </Badge>
            ))}
          </div>
        </div>

        <Link to="/tournaments/$tournamentId" params={{ tournamentId: tournament.id.toString() }}>
          <Button variant="outline" className="w-full">
            View Tournament Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
