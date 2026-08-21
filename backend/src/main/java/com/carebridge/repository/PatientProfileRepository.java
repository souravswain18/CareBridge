package com.carebridge.repository;

import com.carebridge.model.PatientProfile;
import com.carebridge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {
    Optional<PatientProfile> findByUser(User user);
    Optional<PatientProfile> findByUserId(Long userId);
    Optional<PatientProfile> findByLinkCode(String linkCode);
    Optional<PatientProfile> findByEmergencyQrToken(String token);
}
