package com.oceanview.dao;

import com.oceanview.model.Reservation;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.sql.*;
import java.util.Date;

import static org.junit.Assert.*;

public class ReservationDAOTest {

    private ReservationDAO reservationDAO;
    private Reservation testReservation;
    private int insertedReservationId;
    private int testUserId;
    private int testRoomId;

    @Before
    public void setUp() throws Exception {
        reservationDAO = new ReservationDAO();

        // ---------- 1. Create test user ----------
        try (Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/oceanview","root","")) {

            String insertUser = "INSERT INTO users (full_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)";
            try (PreparedStatement ps = conn.prepareStatement(insertUser, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, "JUnit Test User");
                ps.setString(2, "junituser@test.com");
                ps.setString(3, "password123");
                ps.setString(4, "CUSTOMER");
                ps.setString(5, "0000000000");
                ps.executeUpdate();

                ResultSet rs = ps.getGeneratedKeys();
                rs.next();
                testUserId = rs.getInt(1);
            }

            // ---------- 2. Create test room ----------
            String checkRoom = "SELECT id FROM rooms WHERE name = ?";
            try (PreparedStatement ps = conn.prepareStatement(checkRoom)) {
                ps.setString(1, "JUnit Room");
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    testRoomId = rs.getInt("id");
                } else {
                    String insertRoom = "INSERT INTO rooms (name, price, available, max_guests, image_url, description, amenities, type) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    try (PreparedStatement ps2 = conn.prepareStatement(insertRoom, Statement.RETURN_GENERATED_KEYS)) {
                        ps2.setString(1, "JUnit Room");
                        ps2.setDouble(2, 5000);
                        ps2.setBoolean(3, true);
                        ps2.setInt(4, 2);
                        ps2.setString(5, "");
                        ps2.setString(6, "Test room for JUnit");
                        ps2.setString(7, "WiFi,TV");
                        ps2.setString(8, "Standard");
                        ps2.executeUpdate();
                        ResultSet rs2 = ps2.getGeneratedKeys();
                        rs2.next();
                        testRoomId = rs2.getInt(1);
                    }
                }
            }
        }

        // ---------- 3. Insert test reservation ----------
        testReservation = new Reservation();
        testReservation.setUserId(testUserId);
        testReservation.setGuestName("JUnit Test Guest");
        testReservation.setGuestEmail("junit@test.com");
        testReservation.setRoomId(testRoomId);
        testReservation.setRoomName("JUnit Room");
        testReservation.setCheckIn(new Date());
        testReservation.setCheckOut(new Date(System.currentTimeMillis() + 86400000)); // +1 day
        testReservation.setStatus("PENDING");
        testReservation.setAmount(5000.0);
        testReservation.setPaid(false);

        reservationDAO.addReservation(testReservation);

        // Get inserted reservation ID
        Reservation inserted = reservationDAO.getReservationByGuestName("JUnit Test Guest");
        insertedReservationId = inserted.getId();
    }

    @After
    public void tearDown() throws SQLException {
        // Delete reservation
        reservationDAO.deleteReservation(insertedReservationId);

        try (Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/oceanview","root","")) {

            // Delete test user
            String deleteUser = "DELETE FROM users WHERE email = ?";
            try (PreparedStatement ps = conn.prepareStatement(deleteUser)) {
                ps.setString(1, "junituser@test.com");
                ps.executeUpdate();
            }

            // Delete test room
            String deleteRoom = "DELETE FROM rooms WHERE name = ?";
            try (PreparedStatement ps = conn.prepareStatement(deleteRoom)) {
                ps.setString(1, "JUnit Room");
                ps.executeUpdate();
            }
        }
    }

    @Test
    public void testAddReservation() {
        assertTrue(insertedReservationId > 0);
    }

    @Test
    public void testGetReservationById() throws SQLException {
        Reservation r = reservationDAO.getReservationById(insertedReservationId);
        assertNotNull(r);
        assertEquals("JUnit Test Guest", r.getGuestName());
    }

    @Test
    public void testUpdateStatus() throws SQLException {
        boolean updated = reservationDAO.updateStatus(insertedReservationId, "CONFIRMED");
        assertTrue(updated);

        Reservation r = reservationDAO.getReservationById(insertedReservationId);
        assertEquals("CONFIRMED", r.getStatus());
    }

    @Test
    public void testMarkAsPaid() throws SQLException {
        boolean paid = reservationDAO.markAsPaid(insertedReservationId);
        assertTrue(paid);

        Reservation r = reservationDAO.getReservationById(insertedReservationId);
        assertTrue(r.isPaid());
    }

    @Test
    public void testDeleteReservation() throws SQLException {
        boolean deleted = reservationDAO.deleteReservation(insertedReservationId);
        assertTrue(deleted);

        // Insert again for tearDown
        reservationDAO.addReservation(testReservation);
        Reservation inserted = reservationDAO.getReservationByGuestName("JUnit Test Guest");
        insertedReservationId = inserted.getId();
    }

    @Test
    public void testTotalReservationsCount() throws SQLException {
        int total = reservationDAO.getTotalReservations();
        assertTrue(total >= 0);
    }
}