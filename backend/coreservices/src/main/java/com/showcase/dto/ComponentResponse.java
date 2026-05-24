package com.showcase.dto;

public record ComponentResponse(
        Long id,
        String name,
        String description,
        String documentation,
        String usageExample,
        Long categoryId,
        String categoryName
) {
}

