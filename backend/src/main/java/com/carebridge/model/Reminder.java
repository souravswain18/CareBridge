package com.carebridge.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientProfile patient;

    @ManyToOne
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy;

    @Column(nullable = false)
    private String title; // e.g. Telmisartan 40mg

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderType type; // MEDICINE, CHECKUP, LAB_TEST

    private String dosageNotes; // e.g. 1 Tablet after breakfast

    @Column(nullable = false)
    private LocalDateTime scheduledTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Frequency frequency = Frequency.DAILY; // ONCE, DAILY, WEEKLY

    @Column(nullable = false)
    private Boolean isCompleted = false;

    private LocalDateTime completedAt;

    @Column(nullable = false)
    private Boolean escalationSent = false; // Set to true after 20-min grace period alert

    public enum ReminderType {
        MEDICINE,
        CHECKUP,
        LAB_TEST
    }

    public enum Frequency {
        ONCE,
        DAILY,
        WEEKLY
    }
}
