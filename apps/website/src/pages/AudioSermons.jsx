import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import HeroSection from "../components/common/HeroSection";
import { getAudioSermons } from "../services/api/resources";
import config from "../config";

const getSermonId = (sermon) => sermon.id || sermon._id;

const getAudioUrl = (sermon) => {
  const path = sermon.file?.path || sermon.audioUrl;
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${config.API_URL || "http://localhost:3000"}/${path
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")}`;
};

const getDownloadUrl = (sermon) => {
  const id = getSermonId(sermon);
  return id
    ? `${config.API_URL || "http://localhost:3000"}/api/resources/${id}/download`
    : getAudioUrl(sermon);
};

const getSermonDate = (sermon) => sermon.sermonDate || sermon.createdAt;
const getSermonSeries = (sermon) => sermon.series || sermon.tags?.[0];

const AudioPlayer = ({ sermon, isPlaying, onPlayPause }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Get audio URL from resource
  const audioUrl = getAudioUrl(sermon);

  // Recreate the audio element whenever a different sermon is selected.
  useEffect(() => {
    audioRef.current?.pause();
    audioRef.current = audioUrl ? new Audio(audioUrl) : null;
    setCurrentTime(0);
    setDuration(0);

    return () => audioRef.current?.pause();
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      onPlayPause(null);
    };

    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onPlayPause, audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {sermon.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {sermon.author?.name || "Unknown Speaker"} •{" "}
            {new Date(getSermonDate(sermon)).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() =>
            onPlayPause(isPlaying ? null : getSermonId(sermon))
          }
          aria-label={isPlaying ? `Pause ${sermon.title}` : `Play ${sermon.title}`}
          className="flex items-center justify-center w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
        >
          {isPlaying ? (
            <PauseIcon className="h-6 w-6" />
          ) : (
            <PlayIcon className="h-6 w-6 ml-1" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{duration ? formatTime(duration) : sermon.duration || "0:00"}</span>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {sermon.description}
      </p>

      {getSermonSeries(sermon) && (
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span className="font-medium">Series:</span>
          <span className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {getSermonSeries(sermon)}
          </span>
        </div>
      )}

      {/* Download Link */}
      <a
        href={getDownloadUrl(sermon)}
        download={sermon.file?.originalName || sermon.title}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
      >
        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
        Download MP3
      </a>
    </div>
  );
};

const SermonCard = ({ sermon, onPlay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {sermon.title}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
            <SpeakerWaveIcon className="h-4 w-4 mr-2" />
            <span>{sermon.author?.name || "Unknown Speaker"}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>{new Date(getSermonDate(sermon)).toLocaleDateString()}</span>
          </div>
          {sermon.file?.size && (
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>{(sermon.file.size / (1024 * 1024)).toFixed(1)} MB</span>
            </div>
          )}
        </div>
        <button
          onClick={() => onPlay(sermon)}
          aria-label={`Play ${sermon.title}`}
          className="flex items-center justify-center w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
        >
          <PlayIcon className="h-5 w-5 ml-0.5" />
        </button>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {sermon.description}
      </p>

      <div className="flex items-center justify-between">
        {getSermonSeries(sermon) && (
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
            {getSermonSeries(sermon)}
          </span>
        )}
        <a
          href={getDownloadUrl(sermon)}
          download={sermon.file?.originalName || sermon.title}
          className="text-primary-600 hover:text-primary-700 transition-colors text-sm"
        >
          Download
        </a>
      </div>
    </motion.div>
  );
};

const AudioSermons = () => {
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("all");
  const [audioSermons, setAudioSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const viewedSermonsRef = useRef(new Set());

  // Fetch audio sermons from API
  useEffect(() => {
    const fetchAudioSermons = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAudioSermons();

        if (response?.data && Array.isArray(response.data)) {
          setAudioSermons(response.data);
        } else {
          setAudioSermons([]);
        }
      } catch (err) {
        console.error("Error fetching audio sermons:", err);
        setError("Failed to load audio sermons");
        setAudioSermons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioSermons();
  }, []);

  // Get unique series for filter
  const series = useMemo(() => {
    const allSeries = audioSermons
      .map(getSermonSeries)
      .filter(Boolean);
    return [...new Set(allSeries)];
  }, [audioSermons]);

  // Filter sermons
  const filteredSermons = useMemo(() => {
    return audioSermons.filter((sermon) => {
      const matchesSearch =
        (sermon.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sermon.author?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (sermon.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const sermonSeries = getSermonSeries(sermon);
      const matchesSeries =
        selectedSeries === "all" || sermonSeries === selectedSeries;
      return matchesSearch && matchesSeries;
    });
  }, [audioSermons, searchTerm, selectedSeries]);

  const handlePlayPause = (sermonId) => {
    if (sermonId == null) {
      setCurrentlyPlaying(null);
      setSelectedSermon(null);
      return;
    }

    if (currentlyPlaying === sermonId) {
      setCurrentlyPlaying(null);
      setSelectedSermon(null);
    } else {
      setCurrentlyPlaying(sermonId);
      const sermon = audioSermons.find(
        (s) => s.id === sermonId || s._id === sermonId,
      );
      setSelectedSermon(sermon);
    }
  };

  const handlePlayFromCard = (sermon) => {
    setSelectedSermon(sermon);
    const sermonId = getSermonId(sermon);
    setCurrentlyPlaying(sermonId);

    if (sermonId && !viewedSermonsRef.current.has(sermonId)) {
      viewedSermonsRef.current.add(sermonId);
      fetch(
        `${config.API_URL || "http://localhost:3000"}/api/resources/${sermonId}/view`,
        { method: "POST" },
      )
        .then((response) => {
          if (!response.ok) throw new Error(`View API error: ${response.status}`);
          return response.json();
        })
        .then(({ views }) => {
          setAudioSermons((current) =>
            current.map((item) =>
              getSermonId(item) === sermonId ? { ...item, views } : item,
            ),
          );
        })
        .catch((viewError) => {
          viewedSermonsRef.current.delete(sermonId);
          console.error("Failed to record sermon view:", viewError);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Audio Sermons - Victory Bible Church</title>
        <meta
          name="description"
          content="Listen to and download MP3 recordings of sermons from Victory Bible Church. Access our weekly audio messages for spiritual growth."
        />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        title="Audio Sermons"
        subtitle="Weekly Messages"
        description="Listen to our weekly sermon recordings. Perfect for your commute, exercise, or quiet time."
        primaryAccentText="Audio"
        scrollText="LISTEN TO SERMONS"
        backgroundImage="/assets/hero-bg.jpg"
      />

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      >
        {/* Error Message */}
        {error && (
          <div className="mb-8 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
            <p>{error}. Please try again shortly.</p>
          </div>
        )}

        {/* Currently Playing Section */}
        {selectedSermon && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Now Playing
            </h2>
            <AudioPlayer
              sermon={selectedSermon}
              isPlaying={
                currentlyPlaying === (selectedSermon.id || selectedSermon._id)
              }
              onPlayPause={handlePlayPause}
            />
          </motion.div>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Weekly Sermon Recordings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Access MP3 recordings of our Sunday sermons. Download them to your
            device or listen online. These are the same audio files shared in
            our church WhatsApp groups.
          </p>
        </div>

        {/* Search and Filter Section */}
        {!loading && audioSermons.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Series</option>
                {series.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Sermons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSermons.map((sermon) => (
                <SermonCard
                  key={sermon.id || sermon._id}
                  sermon={sermon}
                  onPlay={handlePlayFromCard}
                />
              ))}
            </div>

            {filteredSermons.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {audioSermons.length === 0
                    ? "Audio sermons are coming soon. Please check back after our next service."
                    : "No sermons match your current search or series filter."}
                </p>
              </div>
            )}
          </>
        )}

        {!loading && audioSermons.length > 0 && (
          <aside className="mt-12 flex flex-col items-center gap-3 border-t border-gray-200 pt-8 text-center dark:border-gray-700 sm:flex-row sm:justify-center sm:text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <SpeakerWaveIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Listen wherever the week takes you
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recordings are added after Sunday services. Listen online or
                download a message for later.
              </p>
            </div>
          </aside>
        )}
      </motion.div>
    </div>
  );
};

export default AudioSermons;
