import { useGetAllTournaments } from '../hooks/useQueries';
import TournamentCard from '../components/TournamentCard';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Trophy, Calendar, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { data: tournaments, isLoading } = useGetAllTournaments();

  const upcomingTournaments = tournaments
    ?.filter((t) => t.status === 'open' || t.status === 'draft')
    .sort((a, b) => Number(a.startTime - b.startTime))
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <img
          src="/assets/generated/ffm-hero-banner.dim_1600x600.png"
          alt="FFM Tournament Hero"
          className="w-full h-[400px] object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-chart-1 to-chart-4 bg-clip-text text-transparent">
              Free Fire Max Tournaments
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the ultimate battle royale competition. Compete with the best, prove your skills, and claim victory.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/tournaments">
                <Button size="lg" className="gap-2">
                  <Trophy className="w-5 h-5" />
                  Browse Tournaments
                </Button>
              </Link>
              <Link to="/create-tournament">
                <Button size="lg" variant="outline" className="gap-2">
                  <Calendar className="w-5 h-5" />
                  Create Tournament
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{tournaments?.length || 0}</div>
              <div className="text-muted-foreground">Total Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-chart-1 mb-2">
                {tournaments?.filter((t) => t.status === 'open').length || 0}
              </div>
              <div className="text-muted-foreground">Open for Registration</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-chart-4 mb-2">
                {tournaments?.filter((t) => t.status === 'started').length || 0}
              </div>
              <div className="text-muted-foreground">Live Tournaments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Tournaments</h2>
              <p className="text-muted-foreground">Register now and secure your spot</p>
            </div>
            <Link to="/tournaments">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : upcomingTournaments && upcomingTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTournaments.map((tournament) => (
                <TournamentCard key={tournament.id.toString()} tournament={tournament} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Upcoming Tournaments</h3>
              <p className="text-muted-foreground mb-6">Be the first to create a tournament!</p>
              <Link to="/create-tournament">
                <Button>Create Tournament</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
