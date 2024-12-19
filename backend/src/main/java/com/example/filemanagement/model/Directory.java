package com.example.filemanagement.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "directories")
@Getter
@Setter
@NoArgsConstructor
public class Directory{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String path;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Directory parentDirectory;

    @JsonManagedReference
    @OneToMany(mappedBy = "parentDirectory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Directory> childDirectories;


    @JsonManagedReference
    @OneToMany(mappedBy = "directory", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<File> files = new ArrayList<>();
}
