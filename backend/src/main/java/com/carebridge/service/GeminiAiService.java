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
            return "Unable to extract medical summary from Gemini AI.";
        } catch (Exception e) {
            return "Error calling Gemini Vision API: " + e.getMessage();
        }
    }

    public String chatWithCareBot(String userMessage, String patientContext) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return "Hello! I am CareBot, your AI Recovery Companion. Please make sure GEMINI_API_KEY is configured for real-time live answers. In general: take medications with water at scheduled times, keep surgical wounds clean & dry, and alert your doctor if you experience chest pain, sudden breathlessness, or fever above 101°F.";
        }

        try {
            String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

            String systemPrompt = "You are 'CareBot', a friendly, compassionate, and medically sound AI Post-Hospital Recovery & Medication Assistant for CareBridge in India. "
                    + "LANGUAGE & TONE INSTRUCTIONS: "
                    + "1) You MUST understand both English, Hindi (हिंदी), and Hinglish (Hindi written in Roman script) fluently. "
                    + "2) If the user asks in Hindi/Hinglish (e.g. 'Dawai khali pet leni hai ya khana khane ke baad?', 'Taanke kab katenge?'), ALWAYS reply back in warm, respectful, and easy-to-understand conversational Hinglish or simple Hindi. "
                    + "3) Keep answers concise (under 3-4 sentences), reassuring, and medically accurate. "
                    + "4) CRITICAL EMERGENCY PROTOCOL: If the user describes emergency red-flag symptoms (severe chest pain / seene me dard, sudden breathlessness / saans lene me takleef, severe dizziness / behoshi, bleeding / khoon nikalna), explicitly warn them in their language to immediately tap the Emergency QR Pass or call an ambulance/doctor! "
                    + "5) Patient Profile & Active Medicines Context: " + (patientContext != null ? patientContext : "None") + "\n\n"
                    + "User Query: " + userMessage;

            Map<String, Object> textPart = Map.of("text", systemPrompt);
            Map<String, Object> contentObj = Map.of("parts", List.of(textPart));
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
            return "I am here to help you recover comfortably. For specific clinical concerns, always confirm with your attending physician.";
        } catch (Exception e) {
            return "CareBot is currently operating in offline guidance mode: Stay well hydrated, rest adequately, and take prescribed medicines at the exact times marked in your checklist.";
        }
    }
}
