package com.carebridge.service;

import com.carebridge.model.Reminder;
import com.carebridge.model.PatientProfile;
import com.carebridge.model.User;
import com.carebridge.repository.ReminderRepository;
import com.carebridge.repository.PatientProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private PatientProfileRepository patientProfileRepository;

    public Reminder createReminder(Long patientId, User createdBy, String title, Reminder.ReminderType type, 
                                   String dosageNotes, LocalDateTime scheduledTime, Reminder.Frequency frequency) {
        PatientProfile profile = patientProfileRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        Reminder reminder = Reminder.builder()
            .patient(profile)
            .createdBy(createdBy)
            .title(title)
            .type(type)
            .dosageNotes(dosageNotes)
            .scheduledTime(scheduledTime)
            .frequency(frequency)
            .isCompleted(false)
            .escalationSent(false)
            .build();

        return reminderRepository.save(reminder);
    }

    public Reminder markComplete(Long reminderId) {
        Reminder reminder = reminderRepository.findById(reminderId)
            .orElseThrow(() -> new RuntimeException("Reminder not found"));
        reminder.setIsCompleted(true);
        reminder.setCompletedAt(LocalDateTime.now());
        return reminderRepository.save(reminder);
    }

    public List<Reminder> getPatientReminders(Long patientId) {
        return reminderRepository.findByPatientIdOrderByScheduledTimeAsc(patientId);
    }
}
