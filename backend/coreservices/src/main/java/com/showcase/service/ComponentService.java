package com.showcase.service;

import com.showcase.exception.ResourceNotFoundException;
import com.showcase.model.ComponentItem;
import com.showcase.model.ComponentRequestItem;
import com.showcase.repository.ComponentRepository;
import com.showcase.repository.ComponentRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class ComponentService {

    private final ComponentRepository repository;
    private final ComponentRequestRepository requestRepository;

    public ComponentService(ComponentRepository repository, ComponentRequestRepository requestRepository) {
        this.repository = repository;
        this.requestRepository = requestRepository;
    }

    public ComponentItem addComponent(ComponentItem component) {
        return repository.save(component);
    }

    public List<ComponentItem> getAllComponents() {
        return repository.findAll();
    }

    public ComponentRequestItem requestComponent(ComponentRequestItem request) {
        request.setStatus("PENDING");
        request.setMessage("Waiting for admin review.");
        if (request.getCategory() == null || request.getCategory().isBlank()) {
            request.setCategory("General");
        }
        if (request.getDescription() == null || request.getDescription().isBlank()) {
            request.setDescription(request.getName() + " reusable UI component.");
        }
        return requestRepository.save(request);
    }

    public List<ComponentRequestItem> getComponentRequests(String requestedBy) {
        if (requestedBy != null && !requestedBy.isBlank()) {
            return requestRepository.findByRequestedByOrderByRequestedAtDesc(requestedBy);
        }

        return requestRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(
                        ComponentRequestItem::getRequestedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    public ComponentRequestItem acceptComponentRequest(Long id) {
        ComponentRequestItem request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Component request not found with id: " + id));

        ComponentItem component = new ComponentItem();
        component.setName(request.getName());
        component.setCategory(request.getCategory() == null || request.getCategory().isBlank() ? "General" : request.getCategory());
        component.setDescription(request.getDescription());
        component.setDocumentation(request.getDocumentation() == null || request.getDocumentation().isBlank()
                ? "Documentation requested by user."
                : request.getDocumentation());
        component.setCodeSnippet("<" + request.getName().replaceAll("\\s+", "") + " />");
        component.setUsageExample("<" + request.getName().replaceAll("\\s+", "") + " />");
        component.setCreatedBy(request.getRequestedBy());

        ComponentItem savedComponent = repository.save(component);
        request.setStatus("ACCEPTED");
        request.setComponentId(savedComponent.getId());
        request.setReviewedAt(LocalDateTime.now());
        request.setMessage("Your component request was accepted and added to the registry.");

        return requestRepository.save(request);
    }

    public ComponentRequestItem rejectComponentRequest(Long id) {
        ComponentRequestItem request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Component request not found with id: " + id));

        request.setStatus("REJECTED");
        request.setReviewedAt(LocalDateTime.now());
        request.setMessage("Your component request was rejected by the admin.");

        return requestRepository.save(request);
    }

    public ComponentItem getComponent(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Component not found with id: " + id));
    }

    public ComponentItem updateComponent(Long id, ComponentItem newData) {
        ComponentItem component = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Component not found with id: " + id));

        component.setName(newData.getName());
        component.setCategory(newData.getCategory());
        component.setDescription(newData.getDescription());
        component.setDocumentation(newData.getDocumentation());
        component.setCodeSnippet(newData.getCodeSnippet());
        component.setUsageExample(newData.getUsageExample());
        component.setTags(newData.getTags());
        component.setVersion(newData.getVersion());
        component.setStatus(newData.getStatus());
        component.setPreviewImage(newData.getPreviewImage());
        component.setPropsTable(newData.getPropsTable());
        component.setInstallationGuide(newData.getInstallationGuide());
        component.setAccessibilityNotes(newData.getAccessibilityNotes());
        component.setBestPractices(newData.getBestPractices());
        component.setCreatedBy(newData.getCreatedBy());
        return repository.save(component);
    }

    public void deleteComponent(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Component not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public List<ComponentItem> searchComponents(String q) {
        return repository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q);
    }

    public List<ComponentItem> getByCategory(String category) {
        return repository.findByCategoryContainingIgnoreCase(category);
    }
}
