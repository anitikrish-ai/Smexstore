import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { BannerCarousel } from '../components/home/BannerCarousel';
import { TournamentCard } from '../components/tournaments/TournamentCard';
import { RankPackageCard } from '../components/rankBoosting/RankPackageCard';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { contentApi } from '../api/content';
import { useTournaments } from '../hooks/useTournaments';
import { useRankBoosting } from '../hooks/useRankBoosting';
import { useAuth } from '../hooks/useAuth';
import { BannerItem } from '../types/content';
import { RankPackage } from '../types/rankPackage';

/**
 * Home Page (FR-001 to FR-004)
 * Global navbar, rotating announcements banner (no fades), recent tournaments with full details,
 * and available rank boosting packages.
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [isBannersLoading, setIsBannersLoading] = useState(true);

  const { tournaments, isLoading: isTournamentsLoading } = useTournaments({ limit: 4 });
  const { packages, isLoading: isPackagesLoading } = useRankBoosting();

  useEffect(() => {
    let isMounted = true;
    contentApi
      .getBanners()
      .then((res) => {
        if (isMounted) {
          setBanners(res.banners || []);
          setIsBannersLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setBanners([]);
          setIsBannersLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleBookPackage = (pkg: RankPackage) => {
    navigate(`/rank-boosting/${pkg.id}`);
  };

  return (
    <PageLayout>
      <section className="card card-accent hero" aria-labelledby="home-title">
        <h1 id="home-title">Compete, team up and trade on Smexstore</h1>
        <p className="hero-lead">
          Esports tournaments, team rosters, a game ID marketplace and rank boosting in
          one gaming community.
        </p>
        <div className="hero-actions">
          <Link to="/tournaments" className="btn btn-primary btn-lg">
            Browse tournaments
          </Link>
          <Link to="/marketplace" className="btn btn-secondary btn-lg">
            Explore the marketplace
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-outline btn-lg">
              Create an account
            </Link>
          )}
        </div>
      </section>

      {/* FR-002: Rotating Banner Area (Updates & Posters, no fades) */}
      <section
        aria-label="Announcements and posters"
        style={{ marginBottom: 'var(--space-xl)' }}
      >
        <BannerCarousel banners={banners} isLoading={isBannersLoading} />
      </section>

      {/* FR-004: Recent Tournaments */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="section-head">
          <div>
            <h2 style={{ marginBottom: 'var(--space-xs)' }}>
              Featured and Recent Tournaments
            </h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Official community tournaments, brackets, and rules.
            </p>
          </div>
          <Link to="/tournaments" className="btn btn-secondary motion-press">
            View All Tournaments
          </Link>
        </div>

        {isTournamentsLoading ? (
          <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-4-lg gap-md">
            {[1, 2, 3, 4].map((i) => (
              <LoadingSkeleton key={i} height="240px" borderRadius="var(--radius-md)" />
            ))}
          </div>
        ) : tournaments.length === 0 ? (
          <EmptyState
            title="No Tournaments Scheduled Yet"
            description="Tournaments have not been scheduled by the platform administrator yet. Check back soon."
          />
        ) : (
          <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-4-lg gap-md">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}
      </section>

      {/* FR-003: Rank-Boosting Packages Available to Book */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="section-head">
          <div>
            <h2 style={{ marginBottom: 'var(--space-xs)' }}>Rank Boosting Services</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Verified boosters and tier packages for competitive progression.
            </p>
          </div>
          <Link to="/rank-boosting" className="btn btn-secondary motion-press">
            View All Packages
          </Link>
        </div>

        {isPackagesLoading ? (
          <div className="grid grid-cols-1 grid-cols-3-lg gap-md">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} height="260px" borderRadius="var(--radius-md)" />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <EmptyState
            title="No Boosting Packages Available"
            description="Rank boosting packages will appear here once configured by providers."
          />
        ) : (
          <div className="grid grid-cols-1 grid-cols-3-lg gap-md">
            {packages.slice(0, 3).map((pkg) => (
              <RankPackageCard key={pkg.id} pkg={pkg} onBook={handleBookPackage} />
            ))}
          </div>
        )}
      </section>

      {/* Quick Navigation Cards */}
      <section className="grid grid-cols-1 grid-cols-3-lg gap-md">
        <div className="card">
          <h3>Team Rosters</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            Form a squad, fill open roster slots, or recruit players for upcoming matches.
          </p>
          <Link
            to="/teams"
            className="btn btn-outline"
            style={{ marginTop: 'var(--space-sm)' }}
          >
            Find a Team
          </Link>
        </div>

        <div className="card">
          <h3>Verified Game IDs</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            Buy and sell game IDs with screenshot proofs and community seller trust
            ratings.
          </p>
          <Link
            to="/marketplace"
            className="btn btn-outline"
            style={{ marginTop: 'var(--space-sm)' }}
          >
            Explore Market
          </Link>
        </div>

        <div className="card">
          <h3>Community Standings</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            Inspect top-rated community tournaments and hot teams on the leaderboard.
          </p>
          <Link
            to="/leaderboard"
            className="btn btn-outline"
            style={{ marginTop: 'var(--space-sm)' }}
          >
            Check Standings
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};
