package com.showcase.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "component_requests")
public class ComponentRequestItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String documentation;

    private String requestedBy;
    private String status = "PENDING";

    @Column(columnDefinition = "TEXT")
    private String message = "Waiting for admin review.";

    private Long componentId;
    private LocalDateTime requestedAt = LocalDateTime.now();
    private LocalDateTime reviewedAt;

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

    public String getRequestedBy() {
        return requestedBy;
    }

    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public Long getComponentId() {
        return componentId;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
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

    public void setRequestedBy(String requestedBy) {
        this.requestedBy = requestedBy;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setComponentId(Long componentId) {
        this.componentId = componentId;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
}