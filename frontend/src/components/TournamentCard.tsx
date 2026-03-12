import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Trophy } from 'lucide-react';
import type { PublicTournament } from '../backend';

interface TournamentCardProps {
  tournament: PublicTournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const startDate = new Date(Number(tournament.startTime) / 1000000);
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
    <Link to="/tournaments/$tournamentId" params={{ tournamentId: tournament.id.toString() }}>
      <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge className={statusColors[tournament.status]}>{tournament.status.toUpperCase()}</Badge>
            <Badge variant="outline">{entryTypeLabels[tournament.entryType]}</Badge>
          </div>
          <CardTitle className="group-hover:text-primary transition-colors">{tournament.name}</CardTitle>
          <CardDescription className="line-clamp-2">{tournament.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{startDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{tournament.region}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Max {tournament.maxSlots.toString()} teams</span>
          </div>
          {tournament.prizeDetails && (
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <Trophy className="w-4 h-4" />
              <span className="line-clamp-1">{tournament.prizeDetails}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
