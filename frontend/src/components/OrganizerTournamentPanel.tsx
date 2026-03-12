import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateTournamentStatus } from '../hooks/useQueries';
import { Settings } from 'lucide-react';
import type { PublicTournament, InternalTournamentStatus } from '../backend';

interface OrganizerTournamentPanelProps {
  tournament: PublicTournament;
}

export default function OrganizerTournamentPanel({ tournament }: OrganizerTournamentPanelProps) {
  const updateStatus = useUpdateTournamentStatus();

  const handleStatusChange = async (newStatus: string) => {
    await updateStatus.mutateAsync({
      id: tournament.id,
      status: newStatus as InternalTournamentStatus,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Tournament Management
        </CardTitle>
        <CardDescription>Manage your tournament settings and status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tournament Status</label>
          <Select value={tournament.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
              <SelectItem value="started">Started</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Change the tournament status to control registration and visibility
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
