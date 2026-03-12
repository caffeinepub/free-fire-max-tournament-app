import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module TournamentId {
    public type T = Nat;
    public func toText(id : T) : Text { id.toText() };
    public func compare(id1 : Nat, id2 : Nat) : Order.Order {
      Nat.compare(id1, id2);
    };
  };

  type InternalTournamentStatus = {
    #draft;
    #open;
    #locked;
    #started;
    #completed;
    #cancelled;
  };

  type InternalTournament = {
    id : TournamentId.T;
    name : Text;
    description : Text;
    rules : Text;
    region : Text;
    startTime : Time.Time;
    registrationStart : Time.Time;
    registrationEnd : Time.Time;
    maxSlots : Nat;
    teamSize : Nat;
    entryType : {
      #solo;
      #duo;
      #squad;
      #custom;
    };
    prizeDetails : Text;
    organizer : Principal;
    status : InternalTournamentStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type TeamMember = {
    ign : Text;
  };

  type TeamRegistration = {
    id : Nat;
    tournamentId : TournamentId.T;
    teamName : ?Text;
    captain : Principal;
    members : [TeamMember];
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextTournamentId = 1;
  var nextRegistrationId = 1;

  let tournaments = Map.empty<TournamentId.T, InternalTournament>();
  let teamRegistrations = Map.empty<Nat, TeamRegistration>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public type TournamentFilters = {
    name : ?Text;
    region : ?Text;
    status : ?InternalTournamentStatus;
  };

  public type PublicTournament = {
    id : TournamentId.T;
    name : Text;
    description : Text;
    rules : Text;
    region : Text;
    startTime : Time.Time;
    registrationStart : Time.Time;
    registrationEnd : Time.Time;
    maxSlots : Nat;
    teamSize : Nat;
    entryType : {
      #solo;
      #duo;
      #squad;
      #custom;
    };
    prizeDetails : Text;
    organizer : Principal;
    status : InternalTournamentStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createTournament(
    name : Text,
    description : Text,
    rules : Text,
    region : Text,
    startTime : Time.Time,
    registrationStart : Time.Time,
    registrationEnd : Time.Time,
    maxSlots : Nat,
    teamSize : Nat,
    entryType : {
      #solo;
      #duo;
      #squad;
      #custom;
    },
    prizeDetails : Text,
  ) : async TournamentId.T {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create tournaments");
    };

    let tournamentId = nextTournamentId;
    nextTournamentId += 1;

    let tournament : InternalTournament = {
      id = tournamentId;
      name;
      description;
      rules;
      region;
      startTime;
      registrationStart;
      registrationEnd;
      maxSlots;
      teamSize;
      entryType;
      prizeDetails;
      organizer = caller;
      status = #draft;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    tournaments.add(tournamentId, tournament);
    tournamentId;
  };

  public query ({ caller }) func getTournament(id : TournamentId.T) : async ?PublicTournament {
    switch (tournaments.get(id)) {
      case (null) { null };
      case (?tournament) {
        ?{
          id = tournament.id;
          name = tournament.name;
          description = tournament.description;
          rules = tournament.rules;
          region = tournament.region;
          startTime = tournament.startTime;
          registrationStart = tournament.registrationStart;
          registrationEnd = tournament.registrationEnd;
          maxSlots = tournament.maxSlots;
          teamSize = tournament.teamSize;
          entryType = tournament.entryType;
          prizeDetails = tournament.prizeDetails;
          organizer = tournament.organizer;
          status = tournament.status;
          createdAt = tournament.createdAt;
          updatedAt = tournament.updatedAt;
        };
      };
    };
  };

  public shared ({ caller }) func updateTournament(
    id : TournamentId.T,
    name : ?Text,
    description : ?Text,
    rules : ?Text,
    region : ?Text,
    startTime : ?Time.Time,
    registrationStart : ?Time.Time,
    registrationEnd : ?Time.Time,
    maxSlots : ?Nat,
    teamSize : ?Nat,
    entryType : ?{
      #solo;
      #duo;
      #squad;
      #custom;
    },
    prizeDetails : ?Text,
  ) : async () {
    switch (tournaments.get(id)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?tournament) {
        if (tournament.organizer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the organizer or an admin can update the tournament");
        };

        let updatedTournament : InternalTournament = {
          id = tournament.id;
          name = switch (name) {
            case (?name) { name };
            case (null) { tournament.name };
          };
          description = switch (description) {
            case (?description) { description };
            case (null) { tournament.description };
          };
          rules = switch (rules) {
            case (?rules) { rules };
            case (null) { tournament.rules };
          };
          region = switch (region) {
            case (?region) { region };
            case (null) { tournament.region };
          };
          startTime = switch (startTime) {
            case (?startTime) { startTime };
            case (null) { tournament.startTime };
          };
          registrationStart = switch (registrationStart) {
            case (?registrationStart) { registrationStart };
            case (null) { tournament.registrationStart };
          };
          registrationEnd = switch (registrationEnd) {
            case (?registrationEnd) { registrationEnd };
            case (null) { tournament.registrationEnd };
          };
          maxSlots = switch (maxSlots) {
            case (?maxSlots) { maxSlots };
            case (null) { tournament.maxSlots };
          };
          teamSize = switch (teamSize) {
            case (?teamSize) { teamSize };
            case (null) { tournament.teamSize };
          };
          entryType = switch (entryType) {
            case (?entryType) { entryType };
            case (null) { tournament.entryType };
          };
          prizeDetails = switch (prizeDetails) {
            case (?prizeDetails) { prizeDetails };
            case (null) { tournament.prizeDetails };
          };
          organizer = tournament.organizer;
          status = tournament.status;
          createdAt = tournament.createdAt;
          updatedAt = Time.now();
        };

        tournaments.add(id, updatedTournament);
      };
    };
  };

  public shared ({ caller }) func updateTournamentStatus(id : TournamentId.T, status : InternalTournamentStatus) : async () {
    switch (tournaments.get(id)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?tournament) {
        if (tournament.organizer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the organizer or an admin can update the tournament status");
        };

        let updatedTournament : InternalTournament = {
          id = tournament.id;
          name = tournament.name;
          description = tournament.description;
          rules = tournament.rules;
          region = tournament.region;
          startTime = tournament.startTime;
          registrationStart = tournament.registrationStart;
          registrationEnd = tournament.registrationEnd;
          maxSlots = tournament.maxSlots;
          teamSize = tournament.teamSize;
          entryType = tournament.entryType;
          prizeDetails = tournament.prizeDetails;
          organizer = tournament.organizer;
          status;
          createdAt = tournament.createdAt;
          updatedAt = Time.now();
        };

        tournaments.add(id, updatedTournament);
      };
    };
  };

  public query ({ caller }) func getAllTournaments() : async [PublicTournament] {
    tournaments.values().toArray().map<InternalTournament, PublicTournament>(
      func(tournament) {
        {
          id = tournament.id;
          name = tournament.name;
          description = tournament.description;
          rules = tournament.rules;
          region = tournament.region;
          startTime = tournament.startTime;
          registrationStart = tournament.registrationStart;
          registrationEnd = tournament.registrationEnd;
          maxSlots = tournament.maxSlots;
          teamSize = tournament.teamSize;
          entryType = tournament.entryType;
          prizeDetails = tournament.prizeDetails;
          organizer = tournament.organizer;
          status = tournament.status;
          createdAt = tournament.createdAt;
          updatedAt = tournament.updatedAt;
        };
      }
    );
  };

  public query ({ caller }) func getAllTournamentsFiltered(filters : TournamentFilters) : async [PublicTournament] {
    let filteredTournaments = tournaments.values().toArray().filter(
      func(tournament) {
        let nameMatch = switch (filters.name) {
          case (null) { true };
          case (?filterName) { tournament.name.contains(#text(filterName)) };
        };

        let regionMatch = switch (filters.region) {
          case (null) { true };
          case (?filterRegion) {
            tournament.region == filterRegion;
          };
        };

        let statusMatch = switch (filters.status) {
          case (null) { true };
          case (?filterStatus) {
            tournament.status == filterStatus;
          };
        };

        nameMatch and regionMatch and statusMatch;
      }
    );

    filteredTournaments.map<InternalTournament, PublicTournament>(
      func(tournament) {
        {
          id = tournament.id;
          name = tournament.name;
          description = tournament.description;
          rules = tournament.rules;
          region = tournament.region;
          startTime = tournament.startTime;
          registrationStart = tournament.registrationStart;
          registrationEnd = tournament.registrationEnd;
          maxSlots = tournament.maxSlots;
          teamSize = tournament.teamSize;
          entryType = tournament.entryType;
          prizeDetails = tournament.prizeDetails;
          organizer = tournament.organizer;
          status = tournament.status;
          createdAt = tournament.createdAt;
          updatedAt = tournament.updatedAt;
        };
      }
    );
  };

  public shared ({ caller }) func registerTeam(
    tournamentId : TournamentId.T,
    teamName : ?Text,
    members : [TeamMember],
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register for tournaments");
    };

    switch (tournaments.get(tournamentId)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?tournament) {
        if (tournament.status == #locked or tournament.status == #started or tournament.status == #completed or tournament.status == #cancelled) {
          Runtime.trap("Tournament is not open for registration");
        };

        if (members.size() > tournament.teamSize) {
          Runtime.trap("Team size exceeds tournament limit");
        };

        let registrationId = nextRegistrationId;
        nextRegistrationId += 1;

        let registration : TeamRegistration = {
          id = registrationId;
          tournamentId;
          teamName;
          captain = caller;
          members;
          createdAt = Time.now();
        };

        teamRegistrations.add(registrationId, registration);

        true;
      };
    };
  };

  public query ({ caller }) func getTeamRegistrations(tournamentId : TournamentId.T) : async [TeamRegistration] {
    switch (tournaments.get(tournamentId)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?tournament) {
        let isOrganizer = tournament.organizer == caller;
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        if (not isOrganizer and not isAdmin) {
          let userRegistrations = teamRegistrations.values().toArray().filter(
            func(reg) { reg.tournamentId == tournamentId and reg.captain == caller }
          );
          return userRegistrations;
        };

        teamRegistrations.values().toArray().filter(
          func(reg) { reg.tournamentId == tournamentId }
        );
      };
    };
  };

  public shared ({ caller }) func cancelTeamRegistration(registrationId : Nat) : async () {
    switch (teamRegistrations.get(registrationId)) {
      case (null) { Runtime.trap("Registration not found") };
      case (?registration) {
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        if (registration.captain != caller and not isAdmin) {
          Runtime.trap("Unauthorized: Only the team captain or an admin can cancel the registration");
        };

        teamRegistrations.remove(registrationId);
      };
    };
  };
};
