package com.example.soloLeaf.config;

import jakarta.annotation.PostConstruct;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.context.annotation.Configuration;

import java.security.Security;

@Configuration
public class BouncyCastleConfig {
    /**
     * Registers the Bouncy Castle (BC) security provider for the JVM.
     *
     * Why:
     * - Web Push / VAPID often relies on EC crypto (P-256), ECDSA signatures and AES-GCM encryption.
     * - Some environments/JDKs may not provide all required algorithms/implementations reliably.
     * - Adding BC ensures the required crypto primitives are available and consistent across OS/JDKs.
     *
     * Note:
     * - This is safe to call on startup; we only add BC if it isn't already registered.
     */
    @PostConstruct
    public void register() {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
    }
}
