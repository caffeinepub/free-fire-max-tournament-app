import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export type T = bigint;
export interface TeamMember {
    ign: string;
}
export interface TournamentFilters {
    region?: string;
    status?: InternalTournamentStatus;
    name?: string;
}
export interface TeamRegistration {
    id: bigint;
    teamName?: string;
    members: Array<TeamMember>;
    createdAt: Time;
    captain: Principal;
    tournamentId: T;
}
export interface UserProfile {
    name: string;
}
export interface PublicTournament {
    id: T;
    region: string;
    startTime: Time;
    status: InternalTournamentStatus;
    organizer: Principal;
    teamSize: bigint;
    entryType: Variant_duo_custom_solo_squad;
    maxSlots: bigint;
    registrationStart: Time;
    name: string;
    createdAt: Time;
    description: string;
    updatedAt: Time;
    prizeDetails: string;
    registrationEnd: Time;
    rules: string;
}
export enum InternalTournamentStatus {
    cancelled = "cancelled",
    started = "started",
    open = "open",
    completed = "completed",
    locked = "locked",
    draft = "draft"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_duo_custom_solo_squad {
    duo = "duo",
    custom = "custom",
    solo = "solo",
    squad = "squad"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelTeamRegistration(registrationId: bigint): Promise<void>;
    createTournament(name: string, description: string, rules: string, region: string, startTime: Time, registrationStart: Time, registrationEnd: Time, maxSlots: bigint, teamSize: bigint, entryType: Variant_duo_custom_solo_squad, prizeDetails: string): Promise<T>;
    getAllTournaments(): Promise<Array<PublicTournament>>;
    getAllTournamentsFiltered(filters: TournamentFilters): Promise<Array<PublicTournament>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTeamRegistrations(tournamentId: T): Promise<Array<TeamRegistration>>;
    getTournament(id: T): Promise<PublicTournament | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerTeam(tournamentId: T, teamName: string | null, members: Array<TeamMember>): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTournament(id: T, name: string | null, description: string | null, rules: string | null, region: string | null, startTime: Time | null, registrationStart: Time | null, registrationEnd: Time | null, maxSlots: bigint | null, teamSize: bigint | null, entryType: Variant_duo_custom_solo_squad | null, prizeDetails: string | null): Promise<void>;
    updateTournamentStatus(id: T, status: InternalTournamentStatus): Promise<void>;
}
