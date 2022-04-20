package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
@Transactional
public class RoleDaoImpl implements RoleDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Role> getAllRoles() {
        return entityManager.createQuery("select r from Role r", Role.class).getResultList();
    }

    @Override
    public void save(Role role) {

        Role fine = entityManager.merge(role);
        entityManager.persist(fine);

    }

    @Override
    public Role getRoleByName(String role) {

        return entityManager.createQuery("select r from Role r", Role.class)
                .getResultStream()
                .filter(name -> name.getRole().equals(role))
                .findAny()
                .orElse(null);

    }

}