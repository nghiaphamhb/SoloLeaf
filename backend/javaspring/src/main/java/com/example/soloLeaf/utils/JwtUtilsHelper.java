package com.example.soloLeaf.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtilsHelper {
    @Value("${jwt.privateKey}")
    private String secret;  //  Đừng commit lên git. Secret độc quyền của project

    @Value("${jwt.expirationSeconds}")
    private long expirationSeconds;

    /** Tạo SecretKey từ secret */
    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    /** Sinh token theo username và secret */
    public String generateJwtToken(String username) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expirationSeconds);

        String jws = Jwts.builder()
                .subject(username) // token sinh ra theo username
                .issuedAt(Date.from(now))  // init time
                .expiration(Date.from(exp))  // expire time
                .signWith(key())
                .compact();
        return jws;
    }

    /**
     * Chỉ kiểm tra token hợp lệ (chữ ký/exp/format).
     * Trả true nếu ok, false nếu sai/hết hạn.
     */
    public boolean verifyJwtToken(String jwtToken) {
        try{
            Jwts.parser()
                    .verifyWith(key())
                    .build()
                    .parseSignedClaims(jwtToken); // ném JwtException nếu sai
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Lấy toàn bộ Claims (payload) sau khi đã verify.
     * NÉM exception nếu token không hợp lệ -> để controller/filter bắt và trả 401.
     */
    public Claims getClaims(String jwtToken) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(jwtToken)
                .getPayload();         // tương đương .getBody() ở API cũ
    }

    /**
     * Lấy subject (thường là userId hoặc username) từ token.
     * NÉM exception nếu token không hợp lệ.
     */
    public String getSubject(String jwtToken) {
        return getClaims(jwtToken).getSubject();
    }

//    /* (tuỳ chọn) helper khác nếu bạn có nhúng thêm vào claims */
//    public String getEmail(String jwtToken) {
//        Object email = getClaims(jwtToken).get("email");
//        return email != null ? email.toString() : null;
//    }
}
