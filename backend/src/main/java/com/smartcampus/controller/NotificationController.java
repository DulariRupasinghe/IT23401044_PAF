package com.smartcampus.controller;

import com.smartcampus.model.Notification;
import com.smartcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public Notification send(@RequestBody Notification notification) {
        return notificationService.createNotification(notification);
    }

    @GetMapping("/id/{id}")
    public org.springframework.http.ResponseEntity<Notification> getById(@PathVariable String id) {
        return notificationService.getNotificationById(id)
                .map(org.springframework.http.ResponseEntity::ok)
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    @GetMapping("/{email}")
    public List<Notification> getUser(@PathVariable String email) {
        return notificationService.getNotificationsForUser(email);
    }

    @GetMapping("/{email}/unread")
    public List<Notification> getUnread(@PathVariable String email) {
        return notificationService.getUnreadNotificationsForUser(email);
    }

    @PatchMapping("/{id}")
    public Notification markRead(@PathVariable String id) {
        return notificationService.markAsRead(id);
    }

    @PatchMapping("/user/{email}/read-all")
    public void markAllRead(@PathVariable String email) {
        notificationService.markAllAsRead(email);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        notificationService.deleteNotification(id);
    }
}
