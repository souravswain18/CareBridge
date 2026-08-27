package com.carebridge.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientProfile patient;

    @Column(nullable = false)
    private String fileName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocType docType; // PRESCRIPTION, LAB_REPORT, DISCHARGE_SUMMARY

    @Column(columnDefinition = "TEXT")
    private String aiSummary; // Gemini AI generated bullet summary

    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();

    public enum DocType {
        PRESCRIPTION,
        LAB_REPORT,
        DISCHARGE_SUMMARY,
        OTHER
    }
}
