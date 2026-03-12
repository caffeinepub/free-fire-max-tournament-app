import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import RequireAuth from '../components/RequireAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateTournament } from '../hooks/useQueries';
import { Trophy } from 'lucide-react';
import type { Variant_duo_custom_solo_squad } from '../backend';

export default function CreateTournamentPage() {
  const navigate = useNavigate();
  const createTournament = useCreateTournament();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rules: '',
    region: '',
    startTime: '',
    registrationStart: '',
    registrationEnd: '',
    maxSlots: '16',
    teamSize: '4',
    entryType: 'squad' as Variant_duo_custom_solo_squad,
    prizeDetails: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startTime = BigInt(new Date(formData.startTime).getTime() * 1000000);
    const registrationStart = BigInt(new Date(formData.registrationStart).getTime() * 1000000);
    const registrationEnd = BigInt(new Date(formData.registrationEnd).getTime() * 1000000);

    const tournamentId = await createTournament.mutateAsync({
      name: formData.name,
      description: formData.description,
      rules: formData.rules,
      region: formData.region,
      startTime,
      registrationStart,
      registrationEnd,
      maxSlots: BigInt(formData.maxSlots),
      teamSize: BigInt(formData.teamSize),
      entryType: formData.entryType,
      prizeDetails: formData.prizeDetails,
    });

    navigate({ to: `/tournaments/${tournamentId}` });
  };

  return (
    <RequireAuth message="You need to be logged in to create a tournament.">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-primary" />
            Create Tournament
          </h1>
          <p className="text-muted-foreground">Set up a new Free Fire Max tournament</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tournament Details</CardTitle>
            <CardDescription>Fill in the information for your tournament</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Tournament Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Summer Championship 2026"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of your tournament"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">Rules *</Label>
                <Textarea
                  id="rules"
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  placeholder="Tournament rules and regulations"
                  rows={5}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="e.g., Asia, Europe, NA"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryType">Entry Type *</Label>
                  <Select
                    value={formData.entryType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, entryType: value as Variant_duo_custom_solo_squad })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo</SelectItem>
                      <SelectItem value="duo">Duo</SelectItem>
                      <SelectItem value="squad">Squad</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxSlots">Max Teams *</Label>
                  <Input
                    id="maxSlots"
                    type="number"
                    min="2"
                    value={formData.maxSlots}
                    onChange={(e) => setFormData({ ...formData, maxSlots: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size *</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    min="1"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Tournament Start Date & Time *</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationStart">Registration Start *</Label>
                  <Input
                    id="registrationStart"
                    type="datetime-local"
                    value={formData.registrationStart}
                    onChange={(e) => setFormData({ ...formData, registrationStart: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationEnd">Registration End *</Label>
                  <Input
                    id="registrationEnd"
                    type="datetime-local"
                    value={formData.registrationEnd}
                    onChange={(e) => setFormData({ ...formData, registrationEnd: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prizeDetails">Prize Details</Label>
                <Textarea
                  id="prizeDetails"
                  value={formData.prizeDetails}
                  onChange={(e) => setFormData({ ...formData, prizeDetails: e.target.value })}
                  placeholder="Prize pool and distribution details"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={createTournament.isPending}>
                {createTournament.isPending ? 'Creating Tournament...' : 'Create Tournament'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
}
