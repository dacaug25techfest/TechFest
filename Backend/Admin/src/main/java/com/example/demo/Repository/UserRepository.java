package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByRole_Rid(Long roleId);
}
