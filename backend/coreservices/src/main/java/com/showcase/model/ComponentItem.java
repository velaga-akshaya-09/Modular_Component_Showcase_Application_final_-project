package com.showcase.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "components")
public class ComponentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Component name is required")
    private String name;
    
    @NotBlank(message = "Category is required")
    private String category;
    private String tags;
    private String version = "1.0.0";
    private String status = "Published";
    private String previewImage;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String documentation;

    @Column(columnDefinition = "TEXT")
    private String codeSnippet;

    @Column(columnDefinition = "TEXT")
    private String usageExample;

    @Column(columnDefinition = "TEXT")
    private String propsTable;

    @Column(columnDefinition = "TEXT")
    private String installationGuide;

    @Column(columnDefinition = "TEXT")
    private String accessibilityNotes;

    @Column(columnDefinition = "TEXT")
    private String bestPractices;

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

    public String getTags() {
        return tags;
    }

    public String getVersion() {
        return version;
    }

    public String getStatus() {
        return status;
    }

    public String getPreviewImage() {
        return previewImage;
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

    public String getPropsTable() {
        return propsTable;
    }

    public String getInstallationGuide() {
        return installationGuide;
    }

    public String getAccessibilityNotes() {
        return accessibilityNotes;
    }

    public String getBestPractices() {
        return bestPractices;
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

    public void setTags(String tags) {
        this.tags = tags;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setPreviewImage(String previewImage) {
        this.previewImage = previewImage;
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

    public void setPropsTable(String propsTable) {
        this.propsTable = propsTable;
    }

    public void setInstallationGuide(String installationGuide) {
        this.installationGuide = installationGuide;
    }

    public void setAccessibilityNotes(String accessibilityNotes) {
        this.accessibilityNotes = accessibilityNotes;
    }

    public void setBestPractices(String bestPractices) {
        this.bestPractices = bestPractices;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}