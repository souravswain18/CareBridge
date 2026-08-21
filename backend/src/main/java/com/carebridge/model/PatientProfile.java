package com.carebridge.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "patient_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    private LocalDate dob;
    private String bloodGroup; // e.g. O+, B-, etc.
    
    @Column(columnDefinition = "TEXT")
    private String allergies; // e.g. Penicillin, Peanuts

    @Column(columnDefinition = "TEXT")
    private String chronicConditions; // e.g. Hypertension, Diabetes Type 2

    @Column(unique = true, nullable = false)
    private String linkCode; // e.g. CB-8921 for Caregiver connection

    @Column(unique = true, nullable = false)
    private String emergencyQrToken; // UUID for public emergency view

    private String emergencyContactName;
    private String emergencyContactPhone;
}
