import React, { useState } from 'react';

function NewDirectoryForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [path, setPath] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ name, path });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Directory Name"
        className="input input-bordered w-full max-w-xs"
      />
      <input
        type="text"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="Directory Path"
        className="input input-bordered w-full max-w-xs"
      />
      <button type="submit" className="btn btn-primary">Create</button>
    </form>
  );
}

export default NewDirectoryForm;
