import React from 'react';

interface Movie {
  id: number;
  title: string;
  genre: string;
}

interface MovieListProps {
  movies: Movie[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const MovieList: React.FC<MovieListProps> = ({ movies, onEdit, onDelete }) => {
  return (
    <div>
      <h2>Manage Movies</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            {movie.title} - {movie.genre}
            <button onClick={() => onEdit(movie.id)}>Edit</button>
            <button onClick={() => onDelete(movie.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieList;
