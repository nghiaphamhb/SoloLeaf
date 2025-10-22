package com.example.soloLeaf.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Component
public class JwtUtilsHelper {
    @Value("${jwt.privateKey}")
    private String privateKey;

    public String generateJwtToken(String username) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));  // giai ma chuoi string ma hoa thanh key
        String jws = Jwts.builder().subject("Joe").signWith(key).compact();
        return jws;
    }

    public boolean verifyJwtToken(String jwtToken) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));

        try{
            Jwts.parser()
                    .verifyWith(key)
                    .build()        // build jwtsParser duoc verify with key tu jwtsParserBuilder
                    .parseSignedClaims(jwtToken); // ném JwtException nếu sai
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
