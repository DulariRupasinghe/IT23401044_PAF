package com.smartcampus.controller;

import com.smartcampus.model.Notification;
import com.smartcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @GetMapping
    public List<Notification> getAll() {
        return notificationService.getAllNotifications();
    }

    @PatchMapping("/{id}")
    public Notification markRead(@PathVariable String id) {
        return notificationService.markAsRead(id);
    }

    @PutMapping("/read-all")
    public void markAllRead() {
        notificationService.markAllRead();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        notificationService.deleteNotification(id);
    }
}
