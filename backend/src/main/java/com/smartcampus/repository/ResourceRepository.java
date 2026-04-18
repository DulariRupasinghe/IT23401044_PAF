package com.smartcampus.repository;

import com.smartcampus.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByType(Resource.ResourceType type);
    List<Resource> findByLocation(String location);
    List<Resource> findByStatus(Resource.ResourceStatus status);
}
