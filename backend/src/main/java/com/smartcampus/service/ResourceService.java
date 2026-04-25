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
    private final NotificationService notificationService;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<Resource> getResources(Resource.ResourceType type, Integer minCapacity) {
        if (type != null && minCapacity != null) {
            return resourceRepository.findByTypeAndCapacityGreaterThanEqual(type, minCapacity);
        } else if (type != null) {
            return resourceRepository.findByType(type);
        } else if (minCapacity != null) {
            return resourceRepository.findByCapacityGreaterThanEqual(minCapacity);
        } else {
            return resourceRepository.findAll();
        }
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

        Resource.ResourceStatus oldStatus = resource.getStatus();
        Resource.ResourceStatus newStatus = resourceDetails.getStatus();

        resource.setName(resourceDetails.getName());
        resource.setType(resourceDetails.getType());
        resource.setCapacity(resourceDetails.getCapacity());
        resource.setLocation(resourceDetails.getLocation());
        resource.setStatus(newStatus);
        resource.setDescription(resourceDetails.getDescription());

        Resource updatedResource = resourceRepository.save(resource);

        if (!oldStatus.equals(newStatus)) {
            notificationService.sendNotification(
                "Resource Status Update",
                "Resource " + updatedResource.getName() + " is now " + newStatus,
                com.smartcampus.model.Notification.NotificationType.MAINTENANCE
            );
        }

        return updatedResource;
    }

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }
}