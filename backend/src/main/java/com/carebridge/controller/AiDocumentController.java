package com.carebridge.controller;

import com.carebridge.service.GeminiAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiDocumentController {

    @Autowired
    private GeminiAiService geminiAiService;

    @PostMapping("/analyze-document")
    public ResponseEntity<?> analyzeDocument(@RequestParam("file") MultipartFile file) {
        try {
            String filename = file.getOriginalFilename();
            String mimeType = file.getContentType();
            byte[] fileBytes = file.getBytes();

            String analysisResult = geminiAiService.analyzeMedicalDocument(filename, fileBytes, mimeType);
            boolean isValid = !analysisResult.toUpperCase().contains("INVALID DOCUMENT");

            return ResponseEntity.ok(Map.of(
                "fileName", filename != null ? filename : "Document",
                "isValidMedicalDoc", isValid,
                "summary", analysisResult
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
