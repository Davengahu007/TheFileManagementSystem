package com.example.filemanagement.service;

import com.example.filemanagement.model.File;
import com.example.filemanagement.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    public List<File> getAllFiles() {
        return fileRepository.findAll();
    }

    public Optional<File> getFileById(Long id) {
        return fileRepository.findById(id);
    }

    public File saveFile(File file) {
        return fileRepository.save(file);
    }

    public void deleteFile(Long id) {
        fileRepository.deleteById(id);
    }
}
