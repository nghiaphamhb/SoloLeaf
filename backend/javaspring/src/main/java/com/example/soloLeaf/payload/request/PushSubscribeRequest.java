package com.example.soloLeaf.payload.request;

public class PushSubscribeRequest {
    public String endpoint;
    public Keys keys;
    public String deviceId;
    public String userAgent;

    public static class Keys {
        public String p256dh;
        public String auth;
    }
}
