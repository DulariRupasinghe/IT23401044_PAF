package com.smartcampus.config;

import com.smartcampus.model.Notification;
import com.smartcampus.model.Resource;
import com.smartcampus.repository.NotificationRepository;
import com.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ResourceRepository resourceRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public void run(String... args) {
        if (resourceRepository.count() == 0) {
            log.info("Seeding initial campus resources...");
            
            Resource hall1 = new Resource(null, "Main Lecture Hall (A1)", Resource.ResourceType.LECTURE_HALL, 250, "Block A, Level 1", Resource.ResourceStatus.ACTIVE, "Primary auditorium for large lectures and events.");
            Resource lab1 = new Resource(null, "Computer Science Lab 01", Resource.ResourceType.LAB, 45, "Block B, Level 2", Resource.ResourceStatus.ACTIVE, "Equipped with high-end workstations and networking gear.");
            Resource lab2 = new Resource(null, "Advanced Physics Lab", Resource.ResourceType.LAB, 30, "Block C, Level 3", Resource.ResourceStatus.OUT_OF_SERVICE, "Currently undergoing scheduled maintenance for optical equipment.");
            Resource meeting1 = new Resource(null, "Conference Room Alpha", Resource.ResourceType.MEETING_ROOM, 12, "Administrative Wing", Resource.ResourceStatus.ACTIVE, "Standard meeting room with video conferencing support.");
            Resource projector = new Resource(null, "Portable Projector P-402", Resource.ResourceType.EQUIPMENT, 1, "Equipment Store", Resource.ResourceStatus.ACTIVE, "High-brightness portable projector for off-site presentations.");

            resourceRepository.saveAll(Arrays.asList(hall1, lab1, lab2, meeting1, projector));
            log.info("Resources seeded successfully.");
        }

        if (notificationRepository.count() == 0) {
            log.info("Seeding initial notifications...");
            
            Notification n1 = new Notification();
            n1.setTitle("System Maintenance");
            n1.setMessage("The Smart Campus Hub will be undergoing scheduled maintenance this Sunday from 2 AM to 4 AM.");
            n1.setType(Notification.NotificationType.SYSTEM);
            n1.setRead(false);
            n1.setTimestamp(LocalDateTime.now().minusHours(2));

            Notification n2 = new Notification();
            n2.setTitle("Lab Booking Confirmed");
            n2.setMessage("Your booking for Computer Science Lab 01 has been confirmed for tomorrow at 10:00 AM.");
            n2.setType(Notification.NotificationType.BOOKING);
            n2.setRead(false);
            n2.setTimestamp(LocalDateTime.now().minusDays(1));

            Notification n3 = new Notification();
            n3.setTitle("Resource Alert: Physics Lab");
            n3.setMessage("Advanced Physics Lab has been marked as 'Out of Service' due to equipment calibration.");
            n3.setType(Notification.NotificationType.MAINTENANCE);
            n3.setRead(true);
            n3.setTimestamp(LocalDateTime.now().minusDays(2));

            notificationRepository.saveAll(Arrays.asList(n1, n2, n3));
            log.info("Notifications seeded successfully.");
        }
    }
}
