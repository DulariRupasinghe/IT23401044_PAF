package com.smartcampus.controller;

import com.smartcampus.model.Resource;
import com.smartcampus.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @RequestParam(required = false) Resource.ResourceStatus status) {
        if (type != null) {
            return resourceService.getResourcesByType(type);
        } else if (status != null) {
            return resourceService.getResourcesByStatus(status);
        }
        return resourceService.getAllResources();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getById(@PathVariable String id) {
        return resourceService.getResourceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Resource create(@RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    @PutMapping("/{id}")
    public Resource update(@PathVariable String id, @RequestBody Resource resource) {
        return resourceService.updateResource(id, resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok().build();
    }
}
