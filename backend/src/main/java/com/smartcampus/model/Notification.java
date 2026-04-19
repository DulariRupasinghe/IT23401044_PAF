package com.smartcampus.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String title;
    private String message;

    private NotificationStatus status = NotificationStatus.UNREAD;
    private NotificationType type;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum NotificationStatus {
        READ, 
        UNREAD
    }

    public enum NotificationType {
        BOOKING, 
        MAINTENANCE, 
        COMMENT, 
        SYSTEM
    }
}
