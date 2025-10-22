package com.example.soloLeaf.security;

import com.example.soloLeaf.utils.JwtUtilsHelper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class CustomJwtFilter extends OncePerRequestFilter {
    @Autowired
    JwtUtilsHelper jwtUtilsHelper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromHeader(request);
        System.out.println("[Server] From request (header) get token: " + token);
        if (token != null) {
            if (jwtUtilsHelper.verifyJwtToken(token)) {
                //cài token xác thực thông qua cho UsernamePasswordAuthentication - filter ngay sau CustomJwtFilter
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken("", "", new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }

        }
        filterChain.doFilter(request, response);
    }


    private String getTokenFromHeader(HttpServletRequest request) {
        String headerContainsToken = request.getHeader("Authorization");
        String token = null;

        if (StringUtils.hasText(headerContainsToken) && headerContainsToken.startsWith("Bearer ")) {
            token = headerContainsToken.substring(7);
        }
        return token;
    }
}
