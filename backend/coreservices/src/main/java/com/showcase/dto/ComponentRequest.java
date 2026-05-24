package com.showcase.dto;

public record ComponentRequest(
        String name,
        String description,
        String documentation,
        String usageExample,
        Long categoryId
) {
}
