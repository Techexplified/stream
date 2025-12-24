import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Search,
  Tv,
  Film,
  Swords,
  User,
  Menu,
  Loader2,
  AlertTriangle,
  Play,
  Plus,
  ChevronRight,
  ChevronLeft,
  Lock, // ⬅️ added
} from "lucide-react";
import { motion } from "framer-motion";

// =========================================
// CONFIG
// =========================================

const PRIMARY_BG = "bg-[#0A0D15]";
const ACCENT = "#23b5b5";
const ACCENT_DARK = "#167676";

const HERO_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const NAV_ITEMS = [
  { icon: Home, label: "Home" },
  { icon: Search, label: "Search" },
  { icon: Tv, label: "TV Shows" },
  { icon: Film, label: "Movies" },
  { icon: Swords, label: "Sports" },
  { icon: User, label: "Account" },
];

// =========================================
// HOOK: FETCH TVMAZE DATA
// =========================================

const useTvMazeContent = () => {
  const [data, setData] = useState({
    heroItem: null,
    groupedContent: [],
    allShows: [],
    heroSeasons: [],
    continueWatching: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("https://api.tvmaze.com/shows?page=1");
        if (!res.ok) throw new Error("Failed to fetch shows from TVMaze");
        const shows = await res.json();

        if (!Array.isArray(shows) || shows.length === 0) {
          throw new Error("No shows returned from TVMaze");
        }

        let heroShow = null;
        try {
          const avengersRes = await fetch(
            "https://api.tvmaze.com/search/shows?q=avengers"
          );
          if (avengersRes.ok) {
            const avengersData = await avengersRes.json();
            if (Array.isArray(avengersData) && avengersData.length > 0) {
              const best = avengersData.find((x) =>
                x.show?.name?.toLowerCase().includes("avengers")
              );
              heroShow = (best && best.show) || avengersData[0].show;
            }
          }
        } catch (e) {
          console.warn("Avengers search failed, falling back to default hero", e);
        }

        if (!heroShow) {
          heroShow =
            shows.find((s) => s.image?.original || s.image?.medium) || shows[0];
        }

        const rating = heroShow.rating?.average ?? 7.5;

        const heroItem = {
          id: heroShow.id,
          title: heroShow.name || "Featured Title",
          rating,
          releaseYear: heroShow.premiered?.slice(0, 4) || "2025",
          language: heroShow.language || "English",
          runtime: heroShow.runtime || 60,
          type: "TV Show",
          imageUrl:
            heroShow.image?.original ||
            heroShow.image?.medium ||
            "https://placehold.co/1920x1080/0A132C/1F2937?text=HD+FEATURED+BACKDROP",
          tags: heroShow.genres?.length
            ? heroShow.genres
            : ["Action", "Superhero"],
          overview:
            heroShow.summary?.replace(/<[^>]*>/g, "") ||
            "An epic Avengers-style adventure presented with real TV data and HD images from TVMaze.",
        };

        const allCards = shows.slice(0, 60).map((show) => ({
          id: show.id,
          title: show.name,
          rating: show.rating?.average ?? null,
          runtime: show.runtime,
          genres: show.genres,
          imageUrl:
            show.image?.original ||
            show.image?.medium ||
            "https://placehold.co/300x450/333333/AAAAAA?text=POSTER",
          author:
            show.network?.name || show.webChannel?.name || "Unknown Network",
        }));

        const popular = allCards.slice(0, 12);
        const topRatedCards = [...allCards]
          .filter((s) => s.rating !== null)
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 12);
        const trending = allCards.slice(20, 32);

        const groupedContent = [
          {
            title: "Popular on Stream",
            cardStyle: "aspect-[2/3] w-52 sm:w-64",
            content: popular,
          },
          {
            title: "Top Rated Shows",
            cardStyle: "aspect-[2/3] w-52 sm:w-64",
            content: topRatedCards,
          },
          {
            title: "Trending Now",
            cardStyle: "aspect-video w-64 sm:w-72",
            content: trending,
          },
        ];

        const continueWatching = allCards.slice(32, 40).map((s, idx) => ({
          ...s,
          minutesLeft: [56, 80, 130, 36, 64, 52, 45, 39][idx] ?? 45,
        }));

        const seasonsRes = await fetch(
          `https://api.tvmaze.com/shows/${heroShow.id}/seasons`
        );
        let seasons = [];
        if (seasonsRes.ok) {
          const raw = await seasonsRes.json();
          seasons = raw.map((s) => ({
            id: s.id,
            number: s.number,
            name: s.name || `Season ${s.number}`,
            episodeOrder: s.episodeOrder,
            premiereDate: s.premiereDate,
            endDate: s.endDate,
            imageUrl: s.image?.original || s.image?.medium || null,
          }));
        }

        setData({
          heroItem,
          groupedContent,
          allShows: allCards,
          heroSeasons: seasons,
          continueWatching,
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  return { data, loading, error };
};

// =========================================
// UI COMPONENTS
// =========================================

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => (
  <>
    {isMobileOpen && (
      <div
        className="fixed inset-0 z-40 bg-black/60 md:hidden"
        onClick={() => setIsMobileOpen(false)}
      />
    )}

    <nav
      className={`fixed top-0 left-0 z-50 flex h-full flex-col items-center border-r border-gray-800 shadow-2xl ${PRIMARY_BG} transition-all duration-300
      ${
        isMobileOpen
          ? "w-24 p-3 md:w-20"
          : "w-0 p-0 md:w-20 md:p-3"
      }`}
    >
      <div className="my-6 hidden text-2xl font-black tracking-[0.25em] text-[#23b5b5] md:block">
        S
      </div>

      <button
        onClick={() => setIsMobileOpen(false)}
        className="self-end text-white md:hidden"
        aria-label="Close Menu"
      >
        <Menu size={22} />
      </button>

      <div className="mt-4 flex flex-col space-y-7">
        {NAV_ITEMS.map((item, index) => (
          <motion.div
            key={item.label}
            className={`cursor-pointer rounded-lg p-2 ${
              index === 0
                ? "bg-[#167676]/40 text-[#23b5b5]"
                : "text-gray-400"
            } hover:bg-slate-800 hover:text-white`}
            whileHover={{ scale: 1.15, x: 4 }}
            whileTap={{ scale: 0.95 }}
            title={item.label}
          >
            <item.icon size={22} />
          </motion.div>
        ))}
      </div>
    </nav>
  </>
);

const HeroBanner = ({ heroItem }) => (
  <section className="relative mb-6 h-[72vh] w-full overflow-hidden pt-16 md:h-[92vh]">
    <img
      src={heroItem.imageUrl}
      alt={heroItem.title}
      className="absolute inset-0 h-full w-full object-cover"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src =
          "https://placehold.co/1920x1080/111827/000000?text=Backdrop";
      }}
    />

    <video
      className="absolute inset-0 h-full w-full object-cover opacity-90"
      src={HERO_VIDEO_URL}
      autoPlay
      muted
      loop
      playsInline
      poster={heroItem.imageUrl}
    />

    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/10" />
    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 via-black/30 to-transparent" />

    <div className="relative flex h-full items-center">
      <div className="max-w-xl space-y-4 pl-0 pr-4 text-white md:pl-20 md:pr-0">
        <motion.div
          className="text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: ACCENT }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          SERIES
        </motion.div>

        <motion.h1
          className="text-4xl font-extrabold leading-tight drop-shadow-2xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          {heroItem.title}
        </motion.h1>

        <motion.div
          className="flex flex-wrap items-center gap-3 text-sm text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-sm font-semibold" style={{ color: ACCENT }}>
            97% Match
          </span>
          <span>{heroItem.releaseYear}</span>
          <span className="rounded-sm border border-gray-400 px-1.5 py-0.5 text-[11px]">
            PG-13
          </span>
          <span>{heroItem.language}</span>
          <span>{heroItem.runtime} min</span>
        </motion.div>

        <motion.p
          className="max-w-xl text-sm text-gray-200 md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {heroItem.overview}
        </motion.p>

        <motion.div
          className="mt-2 flex items-center space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            className="flex items-center space-x-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white md:text-base"
            style={{
              backgroundColor: ACCENT,
              boxShadow: "0 0 35px rgba(35,181,181,0.6)",
            }}
          >
            <Play size={18} fill="white" className="text-white" />
            <span>Watch Now</span>
          </button>
          <button className="flex items-center space-x-2 rounded-md bg-gray-700/80 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-600/90 md:text-base">
            <Plus size={18} />
            <span>My List</span>
          </button>
        </motion.div>
      </div>
    </div>
  </section>
);

const ScrollRow = ({ children }) => {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
      left: dir * 350,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 md:flex"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={rowRef}
        className="hide-scrollbar flex overflow-x-auto space-x-4 pb-3 pl-4 pr-4"
      >
        {children}
      </div>

      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 md:flex"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

const ContinueWatchingRow = ({ items }) => {
  if (!items?.length) return null;

  return (
    <section className="mb-8 px-0 md:px-0">
      <motion.h2
        className="mb-3 pl-4 text-xl font-bold text-white md:text-2xl"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        Continue Watching
      </motion.h2>

      <ScrollRow>
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="relative aspect-video w-56 flex-shrink-0 overflow-hidden rounded-xl bg-[#111827] sm:w-64 md:w-72"
            whileHover={{ scale: 1.03 }}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/320x180/333333/AAAAAA?text=POSTER";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <p className="line-clamp-1 text-xs font-semibold text-white sm:text-sm">
                {item.title}
              </p>
              <span className="rounded-md bg-black/70 px-2 py-1 text-[10px] text-white sm:text-xs">
                {item.minutesLeft} min
              </span>
            </div>
          </motion.div>
        ))}
      </ScrollRow>
    </section>
  );
};

const ContentCard = ({ title, imageUrl, cardStyle }) => (
  <motion.div
    className={`flex-shrink-0 cursor-pointer overflow-hidden rounded-xl transition-all duration-300 ${cardStyle}`}
    whileHover={{
      scale: 1.18,
      zIndex: 10,
      boxShadow: "0 0 35px rgba(0,0,0,0.7)",
      transition: { duration: 0.25 },
    }}
  >
    <img
      src={imageUrl}
      alt={title}
      className="h-full w-full object-cover"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src =
          "https://placehold.co/300x450/333333/AAAAAA?text=POSTER";
      }}
    />
  </motion.div>
);

const ContentRow = ({ title, content, cardStyle }) => {
  if (!content?.length) return null;

  return (
    <section className="mb-8 px-0 md:px-0">
      <motion.h2
        className="mb-3 flex items-center pl-4 text-xl font-bold text-white md:text-2xl"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>

      <ScrollRow>
        {content.map((item) => (
          <ContentCard
            key={item.id}
            title={item.title}
            imageUrl={item.imageUrl}
            cardStyle={cardStyle}
          />
        ))}
      </ScrollRow>
    </section>
  );
};

const SeasonsSection = ({ seasons }) => {
  if (!seasons?.length) return null;

  return (
    <section className="mt-2 mb-10 px-0 md:px-0">
      <motion.h2
        className="mb-4 pl-4 text-xl font-bold tracking-wide text-white md:text-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        Seasons
      </motion.h2>

      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-4">
        {seasons.map((season, idx) => (
          <motion.div
            key={season.id}
            className="relative overflow-hidden rounded-xl border border-gray-800 bg-[#111827] shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.04 }}
          >
            {season.imageUrl && (
              <img
                src={season.imageUrl}
                alt={season.name}
                className="h-32 w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/400x200/111827/AAAAAA?text=Season+Image";
                }}
              />
            )}
            <div className="p-2">
              <p className="line-clamp-1 text-sm font-semibold text-white">
                {season.name}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Season {season.number}{" "}
                {season.episodeOrder
                  ? `• ${season.episodeOrder} episodes`
                  : ""}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// =========================================
// MAIN APP WITH LOCK LAYER
// =========================================

const Stream = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // ⬅️ lock state
  const { data, loading, error } = useTvMazeContent();

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${PRIMARY_BG} text-white`}
      >
        <Loader2 className="mr-3 animate-spin" size={32} />
        <p className="text-xl">Loading Experience...</p>
      </div>
    );
  }

  if (error || !data.heroItem) {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center ${PRIMARY_BG} p-8 text-center text-red-400`}
      >
        <AlertTriangle size={48} className="mb-4" />
        <h1 className="mb-4 text-2xl font-bold">
          Error Loading Content
        </h1>
        <p className="max-w-lg text-lg text-gray-400">
          {error || "Could not load data from TVMaze."}
        </p>
      </div>
    );
  }

  return (
    // ⬇️ any click on the app (when unlocked) will lock it
    <div
      className={`relative min-h-screen ${PRIMARY_BG} font-sans`}
      onClick={!isLocked ? () => setIsLocked(true) : undefined}
    >
      {/* Hide scrollbars on custom rows */}
      <style>
        {`
          .hide-scrollbar {
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {/* Mobile Menu Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMobileOpen(true);
        }}
        className="fixed left-4 top-4 z-50 rounded-lg bg-black/70 p-2 text-white md:hidden"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main */}
      <main className="pb-16 md:ml-20">
        <HeroBanner heroItem={data.heroItem} />

        <ContinueWatchingRow items={data.continueWatching} />

        <SeasonsSection seasons={data.heroSeasons} />

        {data.groupedContent.map((section, i) => (
          <ContentRow
            key={i}
            title={section.title}
            content={section.content}
            cardStyle={section.cardStyle}
          />
        ))}
      </main>

      <footer className="py-8 text-center text-sm text-gray-600 md:ml-20">
        <p>
          Demo streaming UI. Data & posters from TVMaze API. Video is
          demo only.
        </p>
      </footer>

      {/* =========================
          LOCK OVERLAY (FULL SCREEN)
         ========================= */}
      {isLocked && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-[90%] max-w-sm rounded-2xl border border-white/10 bg-[#050711]/90 p-6 text-center shadow-[0_0_40px_rgba(0,0,0,0.9)]"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#23b5b5]/40 bg-[#071018] shadow-[0_0_25px_rgba(35,181,181,0.55)]">
              <Lock className="h-7 w-7" style={{ color: ACCENT }} />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Stream Locked
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              This session has been locked. Tap below to unlock and
              continue browsing.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLocked(false);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-black"
              style={{
                backgroundColor: ACCENT,
                boxShadow: "0 0 26px rgba(35,181,181,0.7)",
              }}
            >
              <Lock className="h-4 w-4" />
              <span>Unlock Stream</span>
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Stream;
