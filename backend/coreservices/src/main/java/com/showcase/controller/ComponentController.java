package com.showcase.controller;

import com.showcase.model.ComponentItem;
import com.showcase.model.ComponentRequestItem;
import com.showcase.service.ComponentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/components")
public class ComponentController {

    private final ComponentService service;

    public ComponentController(ComponentService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ComponentItem addComponent(@Valid @RequestBody ComponentItem component) {
        return service.addComponent(component);
    }

    @GetMapping
    public List<ComponentItem> getAllComponents() {
        return service.getAllComponents();
    }

    @PostMapping("/requests")
    @ResponseStatus(HttpStatus.CREATED)
    public ComponentRequestItem requestComponent(@Valid @RequestBody ComponentRequestItem request) {
        return service.requestComponent(request);
    }

    @GetMapping("/requests")
    public List<ComponentRequestItem> getComponentRequests(@RequestParam(required = false) String requestedBy) {
        return service.getComponentRequests(requestedBy);
    }

    @PostMapping("/requests/{id}/accept")
    public ComponentRequestItem acceptComponentRequest(@PathVariable Long id) {
        return service.acceptComponentRequest(id);
    }

    @PostMapping("/requests/{id}/reject")
    public ComponentRequestItem rejectComponentRequest(@PathVariable Long id) {
        return service.rejectComponentRequest(id);
    }

    @GetMapping("/{id}")
    public ComponentItem getComponent(@PathVariable Long id) {
        return service.getComponent(id);
    }

    @PutMapping("/{id}")
    public ComponentItem updateComponent(@PathVariable Long id, @Valid @RequestBody ComponentItem newData) {
        return service.updateComponent(id, newData);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComponent(@PathVariable Long id) {
        service.deleteComponent(id);
    }

    @GetMapping("/search")
    public List<ComponentItem> searchComponents(@RequestParam String q) {
        return service.searchComponents(q);
    }

    @GetMapping("/category/{category}")
    public List<ComponentItem> getByCategory(@PathVariable String category) {
        return service.getByCategory(category);
    }
}