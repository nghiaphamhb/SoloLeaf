package com.example.soloLeaf.security;

import com.example.soloLeaf.utils.JwtUtilsHelper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * Đây là custom filter trước filter UsernamePasswordAuthentication
 */
@Component
public class CustomJwtFilter extends OncePerRequestFilter {
    @Autowired
    JwtUtilsHelper jwtUtilsHelper;

    @Autowired
    CustomUserDetailService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromHeader(request);
        System.out.println("[Server] From request (header) get token: " + token); // ẩn đi sau khi dự án hoàn thiện

        if (token != null) {
            if (jwtUtilsHelper.verifyJwtToken(token)) {
                String subject = jwtUtilsHelper.getSubject(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(subject); // lấy subject là username

                UsernamePasswordAuthenticationToken authenticationToken = // tạo token cho filter sau
                        new UsernamePasswordAuthenticationToken(userDetails, null, new ArrayList<>()); // mục thứ 3 là roles

                SecurityContextHolder.getContext()
                        .setAuthentication(authenticationToken); // set up filter sau vào Security Context
            }

        }
        filterChain.doFilter(request, response);// chuyển tiếp request response cho filter sau
    }

    /**
     * Lấy token từ http header request
     */
    private String getTokenFromHeader(HttpServletRequest request) {
        String headerContainsToken = request.getHeader("Authorization");
        String token = null;

        if (StringUtils.hasText(headerContainsToken) && headerContainsToken.startsWith("Bearer ")) {
            token = headerContainsToken.substring(7);
        }
        return token;
    }
}
