package com.carebridge.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "caregiver_links")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaregiverLink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientProfile patient;

    @ManyToOne
    @JoinColumn(name = "caregiver_user_id", nullable = false)
    private User caregiver;

    private String relationship; // e.g. Son, Daughter, Spouse

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACCEPTED; // PENDING, ACCEPTED

    @Column(nullable = false, updatable = false)
    private LocalDateTime linkedAt = LocalDateTime.now();

    public enum Status {
        PENDING,
        ACCEPTED,
        REJECTED
    }
}
