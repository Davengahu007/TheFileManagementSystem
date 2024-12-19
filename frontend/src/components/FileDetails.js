import React, { useState } from 'react';

function FileDetails({ file, onClose, onDelete, onDownload, onRename }) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.name);

  const handleRename = () => {
    fetch(`http://localhost:8080/api/files/${file.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    })
      .then((response) => {
        if (response.ok) {
          onRename(file.id, newName); 
          setIsRenaming(false); 
        } else {
          alert('Failed to rename the file. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error renaming file:', error);
        alert('An error occurred while renaming the file.');
      });
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">{isRenaming ? 'Rename File' : 'File Details'}</h2>

        {isRenaming ? (
          <>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
              placeholder="Enter new file name"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleRename}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsRenaming(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-2"><strong>Name:</strong> {file.name}</p>
            <p className="mb-4"><strong>Path:</strong> {file.path}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsRenaming(true)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                Rename
              </button>
              <button
                onClick={() => onDelete(file.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => onDownload(file)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Download
              </button>
              <button
                onClick={onClose}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FileDetails;
