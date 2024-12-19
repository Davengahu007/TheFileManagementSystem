package com.example.filemanagement.controller;

import com.example.filemanagement.model.File;
import com.example.filemanagement.model.Directory;
import com.example.filemanagement.service.FileService;
import com.example.filemanagement.service.DirectoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private DirectoryService directoryService;

    @GetMapping("/")
    public List<File> getAllFiles() {
        return fileService.getAllFiles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<File> getFileById(@PathVariable Long id) {
        return fileService.getFileById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/")
    public ResponseEntity<?> createFile(@RequestBody File file) {
        if (file.getDirectory() != null && file.getDirectory().getId() != null) {
            Directory directory = directoryService.getDirectoryById(file.getDirectory().getId()).orElse(null);
            if (directory != null) {
                file.setDirectory(directory);
                File savedFile = fileService.saveFile(file);
                return ResponseEntity.ok(savedFile);
            } else {
                return ResponseEntity.badRequest().body("Directory not found with ID: " + file.getDirectory().getId());
            }
        }
        return ResponseEntity.badRequest().body("Directory information is required");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFile(@PathVariable Long id, @RequestBody File file) {
        return fileService.getFileById(id)
                .map(existingFile -> {
                    existingFile.setName(file.getName());
                    existingFile.setPath(file.getPath());
                    if (file.getDirectory() != null && file.getDirectory().getId() != null) {
                        Directory directory = directoryService.getDirectoryById(file.getDirectory().getId())
                                .orElse(null);
                        if (directory != null) {
                            existingFile.setDirectory(directory);
                        } else {
                            return ResponseEntity.badRequest().body("Directory not found with ID: " + file.getDirectory().getId());
                        }
                    }
                    File updatedFile = fileService.saveFile(existingFile);
                    return ResponseEntity.ok(updatedFile);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("directoryId") Long directoryId) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload.");
        }
        try {
            Directory directory = directoryService.getDirectoryById(directoryId)
                    .orElseThrow(() -> new Exception("Directory not found with ID: " + directoryId));

            Path targetLocation = Paths.get(directory.getPath() + "/" + file.getOriginalFilename());
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            File newFile = new File();
            newFile.setName(file.getOriginalFilename());
            newFile.setPath(targetLocation.toString());
            newFile.setDirectory(directory);
            fileService.saveFile(newFile);

            return ResponseEntity.ok(newFile);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not upload the file: " + ex.getMessage());
        }
    }

    @GetMapping("/files/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        try {
            File file = fileService.getFileById(id).orElseThrow(() -> new RuntimeException("File not found"));
            String correctedPath = file.getPath().replace("\\", "/");
            Path filePath = Paths.get(correctedPath);
            Resource resource = new UrlResource(filePath.toUri());

            if(resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        if (!fileService.getFileById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        fileService.deleteFile(id);
        return ResponseEntity.ok().build();
    }
}
