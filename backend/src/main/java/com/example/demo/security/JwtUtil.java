package com.example.demo.security;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import java.util.Date;
@Component
public class JwtUtil {
 private String secret="secretKey";
 public String generateToken(String username){
  return Jwts.builder().setSubject(username)
  .setIssuedAt(new Date())
  .setExpiration(new Date(System.currentTimeMillis()+86400000))
  .signWith(SignatureAlgorithm.HS256,secret).compact();
 }
 public String extractUsername(String token){
  return Jwts.parser().setSigningKey(secret)
  .parseClaimsJws(token).getBody().getSubject();
 }
}