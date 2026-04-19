package com.smartcampus.repository;

import com.smartcampus.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    // Basic CRUD support is inherited from MongoRepository
    
    // Method to find resources by type using the ResourceType enum
    List<Resource> findByType(Resource.ResourceType type);

    // Method to find resources by status
    List<Resource> findByStatus(Resource.ResourceStatus status);
}
