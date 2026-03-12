import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import type { TeamRegistration } from '../backend';

interface OrganizerRegistrationsTableProps {
  tournamentId: bigint;
  registrations: TeamRegistration[];
}

export default function OrganizerRegistrationsTable({
  tournamentId,
  registrations,
}: OrganizerRegistrationsTableProps) {
  if (registrations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Registered Teams
          </CardTitle>
          <CardDescription>No teams have registered yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Registered Teams ({registrations.length})
        </CardTitle>
        <CardDescription>View all registered teams for this tournament</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Registered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id.toString()}>
                <TableCell className="font-medium">
                  {registration.teamName || `Team ${registration.id.toString()}`}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {registration.members.map((member, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {member.ign}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(Number(registration.createdAt) / 1000000).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
