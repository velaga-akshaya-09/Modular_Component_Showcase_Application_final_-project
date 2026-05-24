package com.showcase.repository;

import com.showcase.model.ComponentRequestItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComponentRequestRepository extends JpaRepository<ComponentRequestItem, Long> {
    List<ComponentRequestItem> findByRequestedByOrderByRequestedAtDesc(String requestedBy);
    List<ComponentRequestItem> findAllByOrderByRequestedAtDesc();
}
