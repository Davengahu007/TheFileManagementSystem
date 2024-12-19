import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DirectoryList from './components/DirectoryList';
import FileList from './components/FileList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DirectoryList />} />
        <Route path="/directory/:directoryId" element={<FileList />} />
      </Routes>
    </Router>
  );
}

export default App;
