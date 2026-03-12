import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetTeamRegistrations, useCancelTeamRegistration } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { UserCheck, UserX } from 'lucide-react';
import type { PublicTournament } from '../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MyRegistrationPanelProps {
  tournament: PublicTournament;
}

export default function MyRegistrationPanel({ tournament }: MyRegistrationPanelProps) {
  const { identity } = useInternetIdentity();
  const { data: registrations } = useGetTeamRegistrations(tournament.id);
  const cancelRegistration = useCancelTeamRegistration();

  const myRegistration = registrations?.find(
    (reg) => identity && reg.captain.toString() === identity.getPrincipal().toString()
  );

  const canCancel = tournament.status === 'open';

  if (!myRegistration) {
    return null;
  }

  const handleCancel = async () => {
    await cancelRegistration.mutateAsync(myRegistration.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-chart-2" />
          Your Registration
        </CardTitle>
        <CardDescription>You are registered for this tournament</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {myRegistration.teamName && (
          <div>
            <div className="text-sm font-medium mb-1">Team Name</div>
            <div className="text-sm text-muted-foreground">{myRegistration.teamName}</div>
          </div>
        )}

        <div>
          <div className="text-sm font-medium mb-2">Team Members</div>
          <div className="space-y-1">
            {myRegistration.members.map((member, index) => (
              <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {index + 1}
                </Badge>
                {member.ign}
              </div>
            ))}
          </div>
        </div>

        {canCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2" disabled={cancelRegistration.isPending}>
                <UserX className="w-4 h-4" />
                Cancel Registration
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Registration?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel your registration? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Registration</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel}>Cancel Registration</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
}
