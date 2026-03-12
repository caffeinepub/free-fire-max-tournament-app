import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegisterTeam } from '../hooks/useQueries';
import { useAuth } from '../hooks/useAuth';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LogIn, UserPlus } from 'lucide-react';
import type { PublicTournament, TeamMember } from '../backend';

interface RegistrationFormProps {
  tournament: PublicTournament;
}

export default function RegistrationForm({ tournament }: RegistrationFormProps) {
  const { isAuthenticated } = useAuth();
  const { login } = useInternetIdentity();
  const registerTeam = useRegisterTeam();
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState<string[]>(Array(Number(tournament.teamSize)).fill(''));

  const canRegister = tournament.status === 'open';
  const now = Date.now() * 1000000;
  const isRegistrationOpen = now >= Number(tournament.registrationStart) && now <= Number(tournament.registrationEnd);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    const teamMembers: TeamMember[] = members
      .filter((ign) => ign.trim())
      .map((ign) => ({ ign: ign.trim() }));

    if (teamMembers.length === 0) {
      return;
    }

    await registerTeam.mutateAsync({
      tournamentId: tournament.id,
      teamName: teamName.trim() || null,
      members: teamMembers,
    });

    setTeamName('');
    setMembers(Array(Number(tournament.teamSize)).fill(''));
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Register for Tournament</CardTitle>
          <CardDescription>Login to register for this tournament</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={login} className="w-full gap-2">
            <LogIn className="w-4 h-4" />
            Login to Register
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!canRegister || !isRegistrationOpen) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registration Closed</CardTitle>
          <CardDescription>
            {!canRegister
              ? 'This tournament is not accepting registrations.'
              : 'Registration period has not started or has ended.'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Your Team</CardTitle>
        <CardDescription>Fill in your team details to register</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name (Optional)</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
            />
          </div>

          <div className="space-y-3">
            <Label>Team Members (IGN)</Label>
            {members.map((member, index) => (
              <Input
                key={index}
                value={member}
                onChange={(e) => {
                  const newMembers = [...members];
                  newMembers[index] = e.target.value;
                  setMembers(newMembers);
                }}
                placeholder={`Player ${index + 1} IGN`}
                required={index === 0}
              />
            ))}
          </div>

          <Button type="submit" className="w-full gap-2" disabled={registerTeam.isPending}>
            {registerTeam.isPending ? (
              'Registering...'
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Register Team
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
