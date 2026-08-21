package com.carebridge.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitalsLogDto {
    private Long id;
    private String vitalType;
    private Double value;
    private String unit;
    private Boolean isSpikeAlert;
    private LocalDateTime loggedAt;
}
