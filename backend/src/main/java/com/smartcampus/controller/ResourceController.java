package com.smartcampus.controller;

import com.smartcampus.model.Resource;
import com.smartcampus.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public List<Resource> getAll(
            @RequestParam(required = false) Resource.ResourceType type,
            @RequestParam(required = false) Integer capacity) {
        return resourceService.getResources(type, capacity);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getById(@PathVariable String id) {
        return resourceService.getResourceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Resource create(@Valid @RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    @PutMapping("/{id}")
    public Resource update(@PathVariable String id, @Valid @RequestBody Resource resource) {
        return resourceService.updateResource(id, resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok().build();
    }
}
