package com.carebridge.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReminderDto {
    private Long id;
    private String title;
    private String type;
    private String dosageNotes;
    private LocalDateTime scheduledTime;
    private String frequency;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
    private Boolean escalationSent;
}
