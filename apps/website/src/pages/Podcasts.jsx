import { useState, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [audioElement, setAudioElement] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load static data
  useEffect(() => {
    fetch('/data/podcasts.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setPodcasts(data);
        setSelectedPodcast(data[0]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  const togglePlayback = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        if (!Array.isArray(jsonData) || !jsonData[0]?.audioUrl) {
          throw new Error('Invalid podcast format');
        }
        setPodcasts(jsonData);
        setSelectedPodcast(jsonData[0]);
      } catch (error) {
        alert("Error loading custom data: " + error.message);
      }
    };

    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Upload button */}
      <div className="mb-8 text-center">
        <label className="bg-gray-100 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
          Upload Custom Podcast Data
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <p className="text-sm text-gray-500 mt-2">
          Default data | Upload your own JSON
        </p>
      </div>

      {/* Player Section */}
      {selectedPodcast && (
        <div className="max-w-3xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">{selectedPodcast.title}</h2>
          <p className="text-gray-600 mb-4">{selectedPodcast.description}</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayback}
              className="p-3 bg-primary rounded-full text-white hover:bg-secondary transition"
              disabled={!audioElement}
            >
              {isPlaying ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6" />}
            </button>
            
            <audio
              ref={(el) => setAudioElement(el)}
              src={selectedPodcast.audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="flex-1"
            />
            
            <span className="text-gray-500">{selectedPodcast.duration}</span>
          </div>
        </div>
      )}

      {/* Podcast List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {podcasts.map(podcast => (
          <div
            key={podcast.id}
            onClick={() => setSelectedPodcast(podcast)}
            className={`p-4 rounded-lg cursor-pointer transition ${
              selectedPodcast?.id === podcast.id
                ? "bg-blue-50 ring-2 ring-blue-500"
                : "bg-white hover:shadow-md"
            }`}
          >
            <h3 className="font-semibold">{podcast.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{podcast.description}</p>
            <span className="text-xs text-gray-500 mt-2 block">
              {podcast.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Podcasts;