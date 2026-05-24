package com.showcase.controller;

import com.showcase.model.ComponentItem;
import com.showcase.model.ComponentRequestItem;
import com.showcase.repository.ComponentRepository;
import com.showcase.repository.ComponentRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/components")
public class ComponentController {

    private final ComponentRepository repository;
    private final ComponentRequestRepository requestRepository;

    public ComponentController(ComponentRepository repository, ComponentRequestRepository requestRepository) {
        this.repository = repository;
        this.requestRepository = requestRepository;
    }

    @PostMapping
    public ComponentItem addComponent(@RequestBody ComponentItem component) {
        return repository.save(component);
    }

    @GetMapping
    public List<ComponentItem> getAllComponents() {
        return repository.findAll();
    }

    @PostMapping("/requests")
    public ComponentRequestItem requestComponent(@RequestBody ComponentRequestItem request) {
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

    @GetMapping("/requests")
    public List<ComponentRequestItem> getComponentRequests(@RequestParam(required = false) String requestedBy) {
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

    @PostMapping("/requests/{id}/accept")
    public ComponentRequestItem acceptComponentRequest(@PathVariable Long id) {
        ComponentRequestItem request = requestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Component request not found"));

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

    @PostMapping("/requests/{id}/reject")
    public ComponentRequestItem rejectComponentRequest(@PathVariable Long id) {
        ComponentRequestItem request = requestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Component request not found"));

        request.setStatus("REJECTED");
        request.setReviewedAt(LocalDateTime.now());
        request.setMessage("Your component request was rejected by the admin.");

        return requestRepository.save(request);
    }

    @GetMapping("/{id}")
    public ComponentItem getComponent(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public ComponentItem updateComponent(@PathVariable Long id, @RequestBody ComponentItem newData) {
        ComponentItem component = repository.findById(id).orElse(null);

        if (component != null) {
            component.setName(newData.getName());
            component.setCategory(newData.getCategory());
            component.setDescription(newData.getDescription());
            component.setDocumentation(newData.getDocumentation());
            component.setCodeSnippet(newData.getCodeSnippet());
            component.setUsageExample(newData.getUsageExample());
            component.setCreatedBy(newData.getCreatedBy());
            return repository.save(component);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public String deleteComponent(@PathVariable Long id) {
        repository.deleteById(id);
        return "Component deleted successfully";
    }

    @GetMapping("/search")
    public List<ComponentItem> searchComponents(@RequestParam String q) {
        return repository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q);
    }

    @GetMapping("/category/{category}")
    public List<ComponentItem> getByCategory(@PathVariable String category) {
        return repository.findByCategoryContainingIgnoreCase(category);
    }
}