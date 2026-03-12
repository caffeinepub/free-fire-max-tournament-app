import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PublicTournament, TournamentFilters, UserProfile, TeamMember, TeamRegistration, InternalTournamentStatus, Variant_duo_custom_solo_squad } from '../backend';
import { toast } from 'sonner';

export function useGetAllTournaments() {
  const { actor, isFetching } = useActor();

  return useQuery<PublicTournament[]>({
    queryKey: ['tournaments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTournaments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFilteredTournaments(filters: TournamentFilters) {
  const { actor, isFetching } = useActor();

  return useQuery<PublicTournament[]>({
    queryKey: ['tournaments', 'filtered', filters],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTournamentsFiltered(filters);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTournament(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<PublicTournament | null>({
    queryKey: ['tournament', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getTournament(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useCreateTournament() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      rules: string;
      region: string;
      startTime: bigint;
      registrationStart: bigint;
      registrationEnd: bigint;
      maxSlots: bigint;
      teamSize: bigint;
      entryType: Variant_duo_custom_solo_squad;
      prizeDetails: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTournament(
        data.name,
        data.description,
        data.rules,
        data.region,
        data.startTime,
        data.registrationStart,
        data.registrationEnd,
        data.maxSlots,
        data.teamSize,
        data.entryType,
        data.prizeDetails
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Tournament created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create tournament');
    },
  });
}

export function useUpdateTournament() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name?: string;
      description?: string;
      rules?: string;
      region?: string;
      startTime?: bigint;
      registrationStart?: bigint;
      registrationEnd?: bigint;
      maxSlots?: bigint;
      teamSize?: bigint;
      entryType?: Variant_duo_custom_solo_squad;
      prizeDetails?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTournament(
        data.id,
        data.name || null,
        data.description || null,
        data.rules || null,
        data.region || null,
        data.startTime || null,
        data.registrationStart || null,
        data.registrationEnd || null,
        data.maxSlots || null,
        data.teamSize || null,
        data.entryType || null,
        data.prizeDetails || null
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournament', variables.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Tournament updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update tournament');
    },
  });
}

export function useUpdateTournamentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; status: InternalTournamentStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTournamentStatus(data.id, data.status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournament', variables.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Tournament status updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update tournament status');
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save profile');
    },
  });
}

export function useRegisterTeam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      tournamentId: bigint;
      teamName: string | null;
      members: TeamMember[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerTeam(data.tournamentId, data.teamName, data.members);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['registrations', variables.tournamentId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
      toast.success('Registration successful!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to register');
    },
  });
}

export function useGetTeamRegistrations(tournamentId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<TeamRegistration[]>({
    queryKey: ['registrations', tournamentId?.toString()],
    queryFn: async () => {
      if (!actor || !tournamentId) return [];
      return actor.getTeamRegistrations(tournamentId);
    },
    enabled: !!actor && !isFetching && tournamentId !== undefined,
  });
}

export function useCancelTeamRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.cancelTeamRegistration(registrationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
      toast.success('Registration cancelled');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel registration');
    },
  });
}
