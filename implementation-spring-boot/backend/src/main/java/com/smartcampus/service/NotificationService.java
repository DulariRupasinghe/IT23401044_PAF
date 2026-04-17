package com.smartcampus.service;

import com.smartcampus.model.Notification;
import com.smartcampus.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<Notification> getNotificationsForUser(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
    }

    public List<Notification> getUnreadNotificationsForUser(String email) {
        return notificationRepository.findByRecipientEmailAndStatus(email, Notification.NotificationStatus.UNREAD);
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void sendNotification(String recipientEmail, String title, String message, Notification.NotificationType type) {
        Notification notification = new Notification();
        notification.setRecipientEmail(recipientEmail);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setStatus(Notification.NotificationStatus.UNREAD);
        notification.setCreatedAt(java.time.LocalDateTime.now());
        notificationRepository.save(notification);
    }

    public Notification markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        notification.setStatus(Notification.NotificationStatus.READ);
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(String email) {
        List<Notification> unread = notificationRepository.findByRecipientEmailAndStatus(email, Notification.NotificationStatus.UNREAD);
        unread.forEach(n -> n.setStatus(Notification.NotificationStatus.READ));
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }
}
