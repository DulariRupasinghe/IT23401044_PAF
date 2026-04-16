package com.smartcampus.service;

import com.smartcampus.model.Resource;
import com.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<Resource> getResourcesByType(Resource.ResourceType type) {
        return resourceRepository.findByType(type);
    }

    public List<Resource> getResourcesByStatus(Resource.ResourceStatus status) {
        return resourceRepository.findByStatus(status);
    }

    public Optional<Resource> getResourceById(String id) {
        return resourceRepository.findById(id);
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(String id, Resource resourceDetails) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));

        resource.setName(resourceDetails.getName());
        resource.setType(resourceDetails.getType());
        resource.setCapacity(resourceDetails.getCapacity());
        resource.setLocation(resourceDetails.getLocation());
        resource.setStatus(resourceDetails.getStatus());
        resource.setDescription(resourceDetails.getDescription());

        return resourceRepository.save(resource);
    }

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }
}
