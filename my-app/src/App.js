import { useState } from "react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-xl font-semibold mb-4">Spotify Playlist Tracks</h1>

        <form onSubmit={fetchData} className="mb-4">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="playlistId"
              className="text-sm font-medium text-gray-700"
            >
              Spotify Playlist ID
            </label>
            <input
              type="text"
              id="playlistId"
              value={playlistId}
              onChange={(e) => setPlaylistId(e.target.value)}
              placeholder="Enter Spotify playlist ID"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Tracks"}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-500 mb-4 p-3 bg-red-100 rounded">
            Error: {error}
          </div>
        )}

        {data && (
          <div>
            <h2 className="text-lg font-medium mb-2">Tracks:</h2>
            <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
              {data.tracks.map((track, index) => (
                <div key={index} className="mb-1">
                  {index + 1}. {track}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
