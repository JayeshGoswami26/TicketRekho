import React, { useState } from 'react';

interface ShowtimeFormProps {
  onSave: (showtime: { time: string; movieId: number }) => void;
  movies: { id: number; title: string }[];
}

const ShowtimeForm: React.FC<ShowtimeFormProps> = ({ onSave, movies }) => {
  const [time, setTime] = useState('');
  const [movieId, setMovieId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (movieId) onSave({ time, movieId });
    setTime('');
    setMovieId(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Manage Showtime</h2>
      <input
        type="text"
        placeholder="Showtime"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <select
        onChange={(e) => setMovieId(Number(e.target.value))}
        value={movieId ?? ''}
      >
        <option value="" disabled>
          Select a Movie
        </option>
        {movies.map((movie) => (
          <option key={movie.id} value={movie.id}>
            {movie.title}
          </option>
        ))}
      </select>
      <button type="submit">Save Showtime</button>
    </form>
  );
};

export default ShowtimeForm;
