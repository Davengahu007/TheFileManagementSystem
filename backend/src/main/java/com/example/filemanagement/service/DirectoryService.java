package com.example.filemanagement.service;

import com.example.filemanagement.model.Directory;
import com.example.filemanagement.model.File;
import com.example.filemanagement.repository.DirectoryRepository;
import com.example.filemanagement.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DirectoryService {

    @Autowired
    private DirectoryRepository directoryRepository;

    @Autowired
    private FileRepository fileRepository;

    public List<Directory> getAllDirectories() {
        return directoryRepository.findAll();
    }

    public Optional<Directory> getDirectoryById(Long id) {
        return directoryRepository.findById(id);
    }

    public List<Directory> getTopLevelDirectories() {
        return directoryRepository.findByParentDirectoryIsNull();
    }

    public List<Directory> getChildDirectories(Long parentId) {
        return directoryRepository.findByParentDirectoryId(parentId);
    }

    public Directory saveDirectory(Directory directory) {
        return directoryRepository.save(directory);
    }

    public void deleteDirectory(Long id) {
        directoryRepository.deleteById(id);
    }

    public void deleteAllSubdirectoriesAndFiles(Long directoryId) {
        Optional<Directory> directory = getDirectoryById(directoryId);
        directory.ifPresent(dir -> {
            dir.getChildDirectories().forEach(subDir -> deleteAllSubdirectoriesAndFiles(subDir.getId()));
            dir.getFiles().forEach(file -> deleteFile(file.getId()));
            deleteDirectory(dir.getId());
        });
    }

    private void deleteFile(Long fileId) {
        fileRepository.deleteById(fileId);
    }
}
