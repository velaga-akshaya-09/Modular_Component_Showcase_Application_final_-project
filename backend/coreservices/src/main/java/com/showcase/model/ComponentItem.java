package com.showcase.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "components")
public class ComponentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String documentation;

    @Column(columnDefinition = "TEXT")
    private String codeSnippet;

    @Column(columnDefinition = "TEXT")
    private String usageExample;

    private String createdBy;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public String getDocumentation() {
        return documentation;
    }

    public String getCodeSnippet() {
        return codeSnippet;
    }

    public String getUsageExample() {
        return usageExample;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDocumentation(String documentation) {
        this.documentation = documentation;
    }

    public void setCodeSnippet(String codeSnippet) {
        this.codeSnippet = codeSnippet;
    }

    public void setUsageExample(String usageExample) {
        this.usageExample = usageExample;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}