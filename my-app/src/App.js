import { useState } from "react";
import { Music2 } from "lucide-react";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playlistId, setPlaylistId] = useState("");

  const fetchData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_LAMBDA_URL}?playlistId=${playlistId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-500 p-10 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8 flex items-center justify-center space-x-3">
          <Music2 className="w-8 h-8 text-purple-600" />
          <span>Spotify Playlist Explorer</span>
        </h1>
        <form onSubmit={fetchData} className="mb-8 flex flex-col gap-4">
          <label
            htmlFor="playlistId"
            className="text-lg font-medium text-gray-700"
          >
            Enter Playlist ID
          </label>
          <input
            type="text"
            id="playlistId"
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
            placeholder="e.g., 5XYMWtF56rBIs2Kgwd00PX"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-400 transition-all shadow-sm"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg font-bold text-lg hover:scale-105 transform transition-all disabled:opacity-50 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Get Playlist Tracks"}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-6 text-red-700 font-semibold text-center">
            ⚠ {error}
          </div>
        )}

        {data && data.tracks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
              🎶 Track List ({data.tracks.length} songs)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.tracks.map((track, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-5 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200 border border-gray-200"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full">
                    <Music2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {track}
                    </p>
                    <p className="text-sm text-gray-500">Track {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
