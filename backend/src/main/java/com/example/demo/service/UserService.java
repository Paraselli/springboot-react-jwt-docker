package com.example.demo.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.example.demo.repository.UserRepository;
import com.example.demo.entity.User;

@Service
public class UserService {
 @Autowired private UserRepository repo;
 public List<User> getAll(){return repo.findAll();}
 public User save(User u){return repo.save(u);}
}