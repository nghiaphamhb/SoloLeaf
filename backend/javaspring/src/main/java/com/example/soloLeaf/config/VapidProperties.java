package com.example.soloLeaf.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration properties for VAPID (Voluntary Application Server Identification) used in Web Push.
 *
 * This class binds values from application.yml (prefix: "vapid"), including:
 * - publicKey: VAPID public key (sent to the browser for subscription)
 * - privateKey: VAPID private key (used by the backend to sign push requests)
 * - subject: Contact/identifier for the application server (e.g., "mailto:admin@example.com")
 *
 * VAPID enables the push service (e.g., FCM/APNs Web Push) to verify that the sender is authorized.
 */
@ConfigurationProperties(prefix = "vapid")
public class VapidProperties {
    private String publicKey;
    private String privateKey;
    private String subject;

    public String getPublicKey() { return publicKey; }
    public void setPublicKey(String publicKey) { this.publicKey = publicKey; }

    public String getPrivateKey() { return privateKey; }
    public void setPrivateKey(String privateKey) { this.privateKey = privateKey; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
}


