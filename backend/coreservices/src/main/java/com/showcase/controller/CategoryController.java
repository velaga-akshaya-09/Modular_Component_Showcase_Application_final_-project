package com.showcase.controller;

import com.showcase.dto.CategoryRequest;
import com.showcase.repository.CategoryRepository;
import com.showcase.model.Category;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository repo;

    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Category addCategory(@RequestBody CategoryRequest request) {
        Category category = new Category();
        category.setName(request.name());
        category.setDescription(request.description());
        return repo.save(category);
    }

    @GetMapping
    public List<Category> getCategories() {
        return repo.findAll();
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id, @RequestBody CategoryRequest request) {
        Category category = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        category.setName(request.name());
        category.setDescription(request.description());
        return repo.save(category);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }
        repo.deleteById(id);
    }
}