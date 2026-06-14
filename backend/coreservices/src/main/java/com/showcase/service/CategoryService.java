package com.showcase.service;

import com.showcase.dto.CategoryRequest;
import com.showcase.exception.ResourceNotFoundException;
import com.showcase.model.Category;
import com.showcase.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repo;

    public CategoryService(CategoryRepository repo) {
        this.repo = repo;
    }

    public Category addCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.name());
        category.setDescription(request.description());
        return repo.save(category);
    }

    public List<Category> getCategories() {
        return repo.findAll();
    }

    public Category updateCategory(Long id, CategoryRequest request) {
        Category category = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        category.setName(request.name());
        category.setDescription(request.description());
        return repo.save(category);
    }

    public void deleteCategory(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        repo.deleteById(id);
    }
}
