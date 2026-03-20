package com.sentinel.policy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import java.util.UUID;

@SpringBootApplication
@EnableScheduling
public class CorePolicyCenterApplication {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public static void main(String[] args) {
        SpringApplication.run(CorePolicyCenterApplication.class, args);
    }

 
     
    @Scheduled(fixedRate = 30000) 
    public void broadcastMalformedEvent() {
        String policyId = "GW-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        
        // Intentionally using 'p_id' and 'state' (Non-Guidewire standard)
        String malformedJson = String.format(
            "{\"p_id\": \"%s\", \"state\": \"ACTIVE_SHIFT\", \"origin\": \"Legacy-System-A\"}", 
            policyId
        );

        System.out.println(">>> BROADCASTING BROKEN DATA: " + malformedJson);
        kafkaTemplate.send("policy-events", malformedJson);
    }
}