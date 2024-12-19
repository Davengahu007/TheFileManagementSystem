package com.example.filemanagement.repository;

import com.example.filemanagement.model.Directory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DirectoryRepository extends JpaRepository<Directory, Long> {

    List<Directory> findByParentDirectoryIsNull();

    List<Directory> findByParentDirectoryId(Long parentId);
}
