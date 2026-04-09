package com.example.demo.controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.service.UserService;
import com.example.demo.entity.User;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins="http://localhost:3000")
public class UserController {
 @Autowired private UserService service;
 @GetMapping public List<User> all(){return service.getAll();}
 @PostMapping public User add(@RequestBody User u){return service.save(u);}
}