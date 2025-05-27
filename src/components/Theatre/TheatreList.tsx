import React from 'react';

interface Theatre {
  id: number;
  name: string;
  location: string;
}

interface TheatreListProps {
  theatres: Theatre[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const TheatreList: React.FC<TheatreListProps> = ({
  theatres,
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      <h2>Manage Theatres</h2>
      <ul>
        {theatres.map((theatre) => (
          <li key={theatre.id}>
            {theatre.name} - {theatre.location}
            <button onClick={() => onEdit(theatre.id)}>Edit</button>
            <button onClick={() => onDelete(theatre.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TheatreList;
