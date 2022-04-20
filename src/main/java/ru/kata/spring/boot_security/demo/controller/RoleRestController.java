package ru.kata.spring.boot_security.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.dao.RoleDao;
import ru.kata.spring.boot_security.demo.model.Role;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RoleRestController {

    private final RoleDao roleDao;

    public RoleRestController(RoleDao roleDao) {
        this.roleDao = roleDao;
    }

    @GetMapping("/roles")
    public List<Role> getAllRoles() {
        return roleDao.getAllRoles();
    }

    @GetMapping("/roles/{role}")
    public Role getRole(@PathVariable String role) {
        return roleDao.getRoleByName(role);
    }
}
