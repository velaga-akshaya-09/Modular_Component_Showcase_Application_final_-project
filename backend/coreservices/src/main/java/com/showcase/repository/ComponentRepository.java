package com.showcase.repository;

import com.showcase.model.ComponentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComponentRepository extends JpaRepository<ComponentItem, Long> {
    List<ComponentItem> findByCategoryContainingIgnoreCase(String category);
    List<ComponentItem> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
}