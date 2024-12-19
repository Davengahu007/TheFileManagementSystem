import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileDetails from './FileDetails';

function FileList() {
  const { directoryId } = useParams();
  const [files, setFiles] = useState([]);
  const [childDirectories, setChildDirectories] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      const fileUrl = `http://localhost:8080/api/directories/${directoryId}/files`;
      try {
        const response = await fetch(fileUrl);
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    const fetchChildDirectories = async () => {
      const dirUrl = `http://localhost:8080/api/directories/${directoryId}/children`;
      try {
        const response = await fetch(dirUrl);
        const data = await response.json();
        setChildDirectories(data);
      } catch (error) {
        console.error('Error fetching child directories:', error);
      }
    };

    fetchFiles();
    fetchChildDirectories();
  }, [directoryId]);

  const handleFileChange = (event) => {
    setFileToUpload(event.target.files[0]);
  };

  const uploadFile = () => {
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('directoryId', directoryId);

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
        setFiles([...files, data]);
      })
      .catch((error) => console.error('Error uploading file:', error));
  };

  const onDownload = (file) => {
    const downloadUrl = `http://localhost:8080/api/files/download/${file.id}`;
    window.open(downloadUrl, '_blank');
  };

  const handleDeleteFile = (fileId) => {
    fetch(`http://localhost:8080/api/files/${fileId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setFiles(files.filter((file) => file.id !== fileId));
          setSelectedFile(null);
        }
      })
      .catch((error) => console.error('Error deleting file:', error));
  };

  const handleDirectoryClick = (childDirectoryId) => {
    navigate(`/directory/${childDirectoryId}`);
  };

  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-xl font-semibold">Files and Subdirectories</h2>

      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={uploadFile}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload File
      </button>

      <h3 className="text-lg font-bold mt-5">Child Directories</h3>
      <ul className="list-disc pl-5">
        {childDirectories.map((childDir) => (
          <li
            key={childDir.id}
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={() => handleDirectoryClick(childDir.id)}
          >
            {childDir.name}
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-bold mt-5">Files</h3>
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
          onDelete={handleDeleteFile}
          onDownload={onDownload}
        />
      )}
    </div>
  );
}

export default FileList;
