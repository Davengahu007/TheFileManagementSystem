import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileDetails from './FileDetails';

function DirectoryList() {
  const [directories, setDirectories] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState(null);
  const [childDirectories, setChildDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/directories/')
      .then(response => response.json())
      .then(data => setDirectories(data))
      .catch(error => console.error('Error fetching directories:', error));
  }, []);

  const handleNewDirectory = (directory) => {
    const parentId = currentDirectory ? currentDirectory.id : null;
    const directoryWithParent = { ...directory, parentDirectory: parentId ? { id: parentId } : null };

    fetch('http://localhost:8080/api/directories/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(directoryWithParent),
    })
      .then(response => response.json())
      .then(data => {
        if (currentDirectory) {
          setChildDirectories([...childDirectories, data]);
        } else {
          setDirectories([...directories, data]);
        }
        setShowForm(false);
      })
      .catch(error => console.error('Failed to create directory:', error));
  };

  const handleDeleteDirectory = (directoryId) => {
    fetch(`http://localhost:8080/api/directories/${directoryId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          if (currentDirectory) {
            setChildDirectories(childDirectories.filter((dir) => dir.id !== directoryId));
          } else {
            setDirectories(directories.filter((dir) => dir.id !== directoryId));
          }
          alert('Directory deleted successfully.');
        } else {
          alert('Failed to delete directory. It might not be empty.');
        }
      })
      .catch(error => console.error('Error deleting directory:', error));
  };

  const handleDirectoryClick = (directory) => {
    setCurrentDirectory(directory);

    fetch(`http://localhost:8080/api/directories/${directory.id}/children`)
      .then(response => response.json())
      .then(data => setChildDirectories(data))
      .catch(error => console.error('Error fetching child directories:', error));

    fetch(`http://localhost:8080/api/directories/${directory.id}/files`)
      .then(response => response.json())
      .then(data => setFiles(data))
      .catch(error => console.error('Error fetching files:', error));
  };

  const handleBackToParent = () => {
    if (currentDirectory?.parentDirectory) {
      handleDirectoryClick(currentDirectory.parentDirectory);
    } else {
      setCurrentDirectory(null);
      setChildDirectories([]);
      setFiles([]);
    }
  };

  const uploadFile = () => {
    if (!fileToUpload) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);

    const targetDirectoryId = currentDirectory ? currentDirectory.id : null;
    formData.append('directoryId', targetDirectoryId);

    fetch('http://localhost:8080/api/files/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to upload file');
        }
      })
      .then((data) => {
        if (currentDirectory) {
          setFiles([...files, data]);
        } else {
          alert('File uploaded successfully to the top-level directory.');
        }
      })
      .catch((error) => console.error('Error uploading file:', error));
  };

  return (
    <div className="container mx-auto mt-5 bg-cream-100 p-5 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <input
          type="file"
          onChange={(e) => setFileToUpload(e.target.files[0])}
          className="mb-4"
        />
        <button
          onClick={uploadFile}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload File
        </button>
      </div>

      <h1 className="text-2xl font-bold text-center mb-4">
        {currentDirectory ? `Current Directory: ${currentDirectory.name}` : 'Top-Level Directories'}
      </h1>

      {currentDirectory && (
        <button
          onClick={handleBackToParent}
          className="mb-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Parent
        </button>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {showForm ? 'Cancel' : 'Create New Directory'}
      </button>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.name.value;
            const path = e.target.path.value;
            handleNewDirectory({ name, path });
          }}
          className="mb-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Directory Name"
            className="input input-bordered w-full max-w-xs mb-2"
          />
          <input
            type="text"
            name="path"
            placeholder="Directory Path"
            className="input input-bordered w-full max-w-xs mb-2"
          />
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
      )}

      {!currentDirectory ? (
        <ul className="list-disc pl-5">
        {directories.map((directory) => (
          <li key={directory.id} className="flex items-center space-x-4">
            <span
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={() => handleDirectoryClick(directory)}
            >
              {directory.name}
            </span>
            <button
              onClick={() => handleDeleteDirectory(directory.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      ) : (
        <>
          <h2 className="text-xl font-semibold mt-4">Subdirectories</h2>
          <ul className="list-disc pl-5">
            {childDirectories.map((child) => (
              <li key={child.id} className="flex items-center space-x-4">
                <span
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={() => handleDirectoryClick(child)}
                >
                  {child.name}
                </span>
                <button
                  onClick={() => handleDeleteDirectory(child.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-4">Files</h2>
          <ul className="list-disc pl-5">
            {files.map((file) => (
              <li
                key={file.id}
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                onClick={() => setSelectedFile(file)}
              >
                {file.name}
              </li>
            ))}
          </ul>
          {selectedFile && (
            <FileDetails
              file={selectedFile}
              onClose={() => setSelectedFile(null)}
              onDelete={(fileId) =>
                setFiles(files.filter((file) => file.id !== fileId))
              }
              onDownload={(file) => window.open(`http://localhost:8080/api/files/download/${file.id}`, '_blank')}
            />
          )}
        </>
      )}
    </div>
  );
}

export default DirectoryList;
