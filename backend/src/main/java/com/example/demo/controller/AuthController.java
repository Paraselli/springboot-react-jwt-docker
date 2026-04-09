package com.example.demo.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.security.JwtUtil;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins="http://localhost:3000")
public class AuthController {
 @Autowired private JwtUtil jwtUtil;

 @PostMapping("/login")
 public String login(@RequestBody Map<String,String> req){
  if("admin".equals(req.get("username")) && "admin".equals(req.get("password"))){
   return jwtUtil.generateToken(req.get("username"));
  }
  throw new RuntimeException("Invalid");
 }
}