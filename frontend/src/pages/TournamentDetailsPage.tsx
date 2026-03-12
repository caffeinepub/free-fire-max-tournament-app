import { useParams } from '@tanstack/react-router';
import { useGetTournament, useGetTeamRegistrations } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, Trophy, Clock, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import RegistrationForm from '../components/RegistrationForm';
import MyRegistrationPanel from '../components/MyRegistrationPanel';
import OrganizerTournamentPanel from '../components/OrganizerTournamentPanel';
import OrganizerRegistrationsTable from '../components/OrganizerRegistrationsTable';
import { useAuth } from '../hooks/useAuth';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function TournamentDetailsPage() {
  const { tournamentId } = useParams({ from: '/tournaments/$tournamentId' });
  const { data: tournament, isLoading } = useGetTournament(BigInt(tournamentId));
  const { data: registrations } = useGetTeamRegistrations(tournament ? tournament.id : undefined);
  const { isAuthenticated } = useAuth();
  const { identity } = useInternetIdentity();

  const isOrganizer = identity && tournament && tournament.organizer.toString() === identity.getPrincipal().toString();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Tournament Not Found</h2>
        <p className="text-muted-foreground">The tournament you're looking for doesn't exist.</p>
      </div>
    );
  }

  const startDate = new Date(Number(tournament.startTime) / 1000000);
  const regStartDate = new Date(Number(tournament.registrationStart) / 1000000);
  const regEndDate = new Date(Number(tournament.registrationEnd) / 1000000);

  const statusColors = {
    draft: 'bg-muted text-muted-foreground',
    open: 'bg-chart-2/20 text-chart-2',
    locked: 'bg-chart-4/20 text-chart-4',
    started: 'bg-chart-1/20 text-chart-1',
    completed: 'bg-muted text-muted-foreground',
    cancelled: 'bg-destructive/20 text-destructive',
  };

  const entryTypeLabels = {
    solo: 'Solo',
    duo: 'Duo',
    squad: 'Squad',
    custom: 'Custom',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{tournament.name}</h1>
            <p className="text-muted-foreground">{tournament.description}</p>
          </div>
          <Badge className={statusColors[tournament.status]}>{tournament.status.toUpperCase()}</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                <span>Start Date</span>
              </div>
              <div className="font-semibold">{startDate.toLocaleDateString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span>Region</span>
              </div>
              <div className="font-semibold">{tournament.region}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span>Entry Type</span>
              </div>
              <div className="font-semibold">{entryTypeLabels[tournament.entryType]}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Trophy className="w-4 h-4" />
                <span>Max Teams</span>
              </div>
              <div className="font-semibold">{tournament.maxSlots.toString()}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              {isOrganizer && <TabsTrigger value="manage">Manage</TabsTrigger>}
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Registration Period
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {regStartDate.toLocaleString()} - {regEndDate.toLocaleString()}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Size
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {tournament.teamSize.toString()} player{Number(tournament.teamSize) !== 1 ? 's' : ''} per team
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Prize Details
                    </h4>
                    <p className="text-sm text-muted-foreground">{tournament.prizeDetails || 'No prize details available'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{tournament.rules}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {isOrganizer && (
              <TabsContent value="manage">
                <OrganizerTournamentPanel tournament={tournament} />
                <div className="mt-6">
                  <OrganizerRegistrationsTable tournamentId={tournament.id} registrations={registrations || []} />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {isAuthenticated ? (
            <MyRegistrationPanel tournament={tournament} />
          ) : (
            <RegistrationForm tournament={tournament} />
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Registration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registered Teams:</span>
                  <span className="font-semibold">{registrations?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Slots:</span>
                  <span className="font-semibold">
                    {Number(tournament.maxSlots) - (registrations?.length || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
