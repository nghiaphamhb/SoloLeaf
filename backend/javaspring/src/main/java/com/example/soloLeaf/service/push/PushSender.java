package com.example.soloLeaf.service.push;

import com.example.soloLeaf.config.VapidProperties;
import com.example.soloLeaf.entity.PushSubscription;
import com.example.soloLeaf.repository.PushSubscriptionRepository;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.apache.http.HttpResponse;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

/**
 * Sends Web Push notifications to a user's subscribed devices.
 *
 * Responsibilities:
 * - Build and send encrypted Web Push payloads to each subscription endpoint.
 * - Attach VAPID authentication (public/private key + subject) required by push services.
 *
 * Notes:
 * - This is an infrastructure/integration component (not business logic).
 * - The payload format can be "declarative" (web_push: 8030) so compatible with Safari/WebKit,
 *   while still supporting Service Worker fallback on Chromium-based browsers.
 */

@Service
public class PushSender {
    private final VapidProperties vapid;
    private final PushSubscriptionRepository repo;

    public PushSender(VapidProperties vapid, PushSubscriptionRepository repo) {
        this.vapid = vapid;
        this.repo = repo;
    }

    public void sendJson(PushSubscription sub, String jsonPayload) throws Exception {
        PushService pushService = new PushService();
        pushService.setSubject(vapid.getSubject());
        pushService.setPublicKey(vapid.getPublicKey());
        pushService.setPrivateKey(vapid.getPrivateKey());

        Notification notification = new Notification(
                sub.getEndpoint(),
                sub.getP256dh(),
                sub.getAuth(),
                jsonPayload.getBytes(StandardCharsets.UTF_8)
        );

        HttpResponse res = pushService.send(notification);
        int status = res.getStatusLine().getStatusCode();

        sub.setLastSeenAt(Instant.now());
        if (status == 404 || status == 410) sub.setActive(false);
        repo.save(sub);
    }
}
