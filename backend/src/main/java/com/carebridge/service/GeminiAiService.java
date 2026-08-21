package com.carebridge.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class GeminiAiService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String analyzeMedicalDocument(String textContentOrFilename, byte[] fileBytes, String mimeType) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return "Note: Gemini API key not configured. Please add GEMINI_API_KEY in backend/.env for live AI extraction.";
        }

        try {
            String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

            String prompt = "You are a clinical AI medical assistant for the CareBridge Post-Hospital Recovery app. "
                    + "Analyze the uploaded document content. "
                    + "CRITICAL RULE: If the content is NOT a medical document (e.g. random image, photo, bill, or unrelated text), clearly respond: 'INVALID DOCUMENT: This file is not a medical report or prescription. Please upload a valid clinical record.' "
                    + "If it IS a valid medical report or prescription, extract: 1) Document Type (Prescription/Lab/Discharge), 2) Key Diagnoses/Vitals, 3) Prescribed Medicines with Dosages, and 4) Follow-up Instructions in 3 clean bullet points.";

            Map<String, Object> textPart = Map.of("text", prompt + "\nDocument Context: " + textContentOrFilename);
            List<Map<String, Object>> parts = new ArrayList<>();
            parts.add(textPart);

            if (fileBytes != null && fileBytes.length > 0 && mimeType != null && !mimeType.isEmpty()) {
                String base64Data = Base64.getEncoder().encodeToString(fileBytes);
                Map<String, Object> inlineData = Map.of(
                    "mime_type", mimeType,
                    "data", base64Data
                );
                parts.add(Map.of("inline_data", inlineData));
            }

            Map<String, Object> contentObj = Map.of("parts", parts);
            Map<String, Object> requestBody = Map.of("contents", List.of(contentObj));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(geminiUrl, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map body = response.getBody();
                List candidates = (List) body.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map firstCandidate = (Map) candidates.get(0);
                    Map content = (Map) firstCandidate.get("content");
                    List resParts = (List) content.get("parts");
                    if (resParts != null && !resParts.isEmpty()) {
                        Map firstPart = (Map) resParts.get(0);
                        return (String) firstPart.get("text");
                    }
                }
            }
            return "Unable to parse document response from Gemini AI.";
        } catch (Exception e) {
            return "AI Analysis Error: " + e.getMessage();
        }
    }
}
