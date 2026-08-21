package com.carebridge.repository;

import com.carebridge.model.CaregiverLink;
import com.carebridge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CaregiverLinkRepository extends JpaRepository<CaregiverLink, Long> {
    List<CaregiverLink> findByCaregiver(User caregiver);
    List<CaregiverLink> findByPatientId(Long patientId);
}
