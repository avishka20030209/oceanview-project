package com.oceanview.servlet;

import com.oceanview.dao.UserDAO;
import com.oceanview.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/user")
public class UserServlet extends HttpServlet {
    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        userDAO = new UserDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        String action = request.getParameter("action");
        if ("session".equalsIgnoreCase(action)) {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("userId") != null) {
                out.println("{\"status\":\"success\",\"userId\":" + session.getAttribute("userId") +
                        ",\"fullName\":\"" + session.getAttribute("fullName") +
                        "\",\"email\":\"" + session.getAttribute("email") +
                        "\",\"role\":\"" + session.getAttribute("role") + "\"}");
            } else {
                out.println("{\"status\":\"error\",\"message\":\"No active session\"}");
            }
            return;
        }

        // Optional: handle admin listing users
        HttpSession session = request.getSession(false);
        if (session == null || !"ADMIN".equals(session.getAttribute("role"))) {
            out.println("{\"status\":\"error\",\"message\":\"Access denied\"}");
            return;
        }

        try {
            List<User> users = userDAO.getAllUsers();
            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < users.size(); i++) {
                User u = users.get(i);
                json.append("{")
                        .append("\"id\":").append(u.getId()).append(",")
                        .append("\"fullName\":\"").append(u.getFullName()).append("\",")
                        .append("\"email\":\"").append(u.getEmail()).append("\",")
                        .append("\"role\":\"").append(u.getRole()).append("\",")
                        .append("\"phone\":\"").append(u.getPhone()).append("\"")
                        .append("}");
                if (i < users.size() - 1) json.append(",");
            }
            json.append("]");
            out.println(json.toString());
        } catch (SQLException e) {
            out.println("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        String action = request.getParameter("action");

        try {
            switch (action.toLowerCase()) {
                case "login":
                    handleLogin(request, out);
                    break;
                case "register":
                    handleRegister(request, out);
                    break;
                case "update":
                    handleUpdate(request, out);
                    break;
                case "delete":
                    handleDelete(request, out);
                    break;
                default:
                    out.println("{\"status\":\"error\",\"message\":\"Invalid action\"}");
            }
        } catch (SQLException e) {
            out.println("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }

    private void handleLogin(HttpServletRequest request, PrintWriter out) throws SQLException {
        String email = request.getParameter("email");
        String password = hashPassword(request.getParameter("password"));

        User user = userDAO.login(email, password);
        if (user != null) {
            HttpSession session = request.getSession();
            session.setAttribute("userId", user.getId());
            session.setAttribute("fullName", user.getFullName());
            session.setAttribute("email", user.getEmail());
            session.setAttribute("role", user.getRole());

            out.println("{\"status\":\"success\",\"userId\":" + user.getId() +
                    ",\"fullName\":\"" + user.getFullName() +
                    "\",\"email\":\"" + user.getEmail() +
                    "\",\"role\":\"" + user.getRole() + "\"}");
        } else {
            out.println("{\"status\":\"error\",\"message\":\"Invalid email or password\"}");
        }
    }

    private void handleRegister(HttpServletRequest request, PrintWriter out) throws SQLException {
        String fullName = request.getParameter("fullName");
        String email = request.getParameter("email");
        String password = hashPassword(request.getParameter("password"));
        String role = request.getParameter("role");
        String phone = request.getParameter("phone");

        if (userDAO.emailExists(email)) {
            out.println("{\"status\":\"error\",\"message\":\"Email already registered\"}");
            return;
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        user.setPhone(phone);

        boolean success = userDAO.register(user);
        if (success) {
            out.println("{\"status\":\"success\",\"message\":\"User registered successfully\"}");
        } else {
            out.println("{\"status\":\"error\",\"message\":\"Registration failed\"}");
        }
    }

    private void handleUpdate(HttpServletRequest request, PrintWriter out) throws SQLException {
        int id = Integer.parseInt(request.getParameter("id"));
        String fullName = request.getParameter("fullName");
        String email = request.getParameter("email");
        String role = request.getParameter("role");
        String phone = request.getParameter("phone");

        User user = new User();
        user.setId(id);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setRole(role);
        user.setPhone(phone);

        boolean success = userDAO.update(user);
        out.println("{\"status\":\"" + (success ? "success" : "error") +
                "\",\"message\":\"" + (success ? "User updated successfully" : "Update failed") + "\"}");
    }

    private void handleDelete(HttpServletRequest request, PrintWriter out) throws SQLException {
        int id = Integer.parseInt(request.getParameter("id"));
        boolean success = userDAO.delete(id);
        out.println("{\"status\":\"" + (success ? "success" : "error") +
                "\",\"message\":\"" + (success ? "User deleted successfully" : "Delete failed") + "\"}");
    }

    // -------------------------------
    // Password hashing with SHA-256
    // -------------------------------
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashed = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashed) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}
