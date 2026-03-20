package com.sentinel.policy;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/policy")
public class PolicyController {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public PolicyController(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @PostMapping("/shift")
    public String triggerShift(@RequestBody String payload) {
        kafkaTemplate.send("policy-events", payload);
        return "Event successfully sent to Sentinel-AI Pipeline on topic: policy-events";
    }
}
