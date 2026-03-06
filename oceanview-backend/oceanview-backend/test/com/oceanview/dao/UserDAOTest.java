package com.oceanview.dao;

import com.oceanview.model.User;
import org.junit.*;
import static org.junit.Assert.*;

import java.sql.SQLException;
import java.util.List;

public class UserDAOTest {

    private UserDAO userDAO;

    @Before
    public void setUp() {
        userDAO = new UserDAO();
    }

    @Test
    public void testRegisterAndEmailExists() throws SQLException {
        User user = new User();
        user.setFullName("JUnit Generated User (Default)");
        user.setEmail("testuser@example.com");
        user.setPassword("hashedpassword");
        user.setRole("CUSTOMER");
        user.setPhone("0771234567");

        boolean registered = userDAO.register(user);
        assertTrue("User should be registered", registered);

        boolean exists = userDAO.emailExists("testuser@example.com");
        assertTrue("Email should exist after registration", exists);
    }

    @Test
    public void testGetAllUsers() throws SQLException {
        List<User> users = userDAO.getAllUsers();
        assertNotNull(users);
        assertTrue(users.size() >= 0);
    }

    @Test
    public void testLoginFailure() throws SQLException {
        User user = userDAO.login("nonexistent@email.com", "wrongpass");
        assertNull("Login should fail for invalid credentials", user);
    }
}