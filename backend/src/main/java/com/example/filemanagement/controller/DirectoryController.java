package com.example.filemanagement.controller;

import com.example.filemanagement.model.Directory;
import com.example.filemanagement.model.File;
import com.example.filemanagement.service.DirectoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/directories")
public class DirectoryController {

    @Autowired
    private DirectoryService directoryService;

    @GetMapping("/all")
    public List<Directory> getAllDirectories() {
        return directoryService.getAllDirectories();
    }

    @GetMapping("/")
    public List<Directory> getTopLevelDirectories() {
        return directoryService.getTopLevelDirectories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Directory> getDirectoryById(@PathVariable Long id) {
        return directoryService.getDirectoryById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/children")
    public ResponseEntity<List<Directory>> getChildDirectories(@PathVariable Long id) {
        return directoryService.getDirectoryById(id)
                .map(directory -> ResponseEntity.ok(directory.getChildDirectories())) // Assumes subdirectories relationship
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/files")
    public ResponseEntity<List<File>> getFilesByDirectory(@PathVariable Long id) {
        return directoryService.getDirectoryById(id)
                .map(directory -> ResponseEntity.ok(directory.getFiles()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/")
    public Directory createDirectory(@RequestBody Directory directory) {
        return directoryService.saveDirectory(directory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Directory> updateDirectory(@PathVariable Long id, @RequestBody Directory directory) {
        return directoryService.getDirectoryById(id)
                .map(existingDirectory -> {
                    existingDirectory.setName(directory.getName());
                    existingDirectory.setPath(directory.getPath());
                    return ResponseEntity.ok(directoryService.saveDirectory(existingDirectory));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDirectory(@PathVariable Long id) {
        if (!directoryService.getDirectoryById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        directoryService.deleteDirectory(id);
        return ResponseEntity.ok().build();
    }
}
