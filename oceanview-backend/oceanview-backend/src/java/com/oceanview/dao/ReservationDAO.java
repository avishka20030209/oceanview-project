package com.oceanview.dao;

import com.oceanview.model.Reservation;
import java.sql.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ReservationDAO {

    private final String jdbcURL = "jdbc:mysql://localhost:3306/oceanview";
    private final String jdbcUsername = "root";
    private final String jdbcPassword = "";

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(jdbcURL, jdbcUsername, jdbcPassword);
    }

    // ------------------ ROOM AVAILABILITY ------------------
    public boolean isRoomAvailable(int roomId, Date checkIn, Date checkOut) throws SQLException {
        String sql =
            "SELECT COUNT(*) FROM reservations WHERE room_id = ? " +
            "AND NOT (check_out <= ? OR check_in >= ?)";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, roomId);
            ps.setDate(2, new java.sql.Date(checkIn.getTime()));
            ps.setDate(3, new java.sql.Date(checkOut.getTime()));

            ResultSet rs = ps.executeQuery();
            rs.next();
            return rs.getInt(1) == 0;
        }
    }

    // ------------------ ADD RESERVATION ------------------
    public boolean addReservation(Reservation r) throws SQLException {
        String sql =
            "INSERT INTO reservations " +
            "(user_id, guest_name, guest_email, room_id, room_name, check_in, check_out, status, amount, paid) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, r.getUserId());
            ps.setString(2, r.getGuestName());
            ps.setString(3, r.getGuestEmail()); // ✅ store email
            ps.setInt(4, r.getRoomId());
            ps.setString(5, r.getRoomName());
            ps.setDate(6, new java.sql.Date(r.getCheckIn().getTime()));
            ps.setDate(7, new java.sql.Date(r.getCheckOut().getTime()));
            ps.setString(8, r.getStatus());
            ps.setDouble(9, r.getAmount());
            ps.setBoolean(10, r.isPaid());

            return ps.executeUpdate() > 0;
        }
    }

    // ------------------ GET RESERVATIONS BY USER ------------------
    public List<Reservation> getReservationsByUserId(int userId) throws SQLException {
        String sql = "SELECT * FROM reservations WHERE user_id = ? ORDER BY id DESC";
        List<Reservation> list = new ArrayList<>();
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                list.add(mapResultSetToReservation(rs));
            }
        }
        return list;
    }

    // ------------------ ADMIN: ALL RESERVATIONS ------------------
    public List<Reservation> getAllReservations() throws SQLException {
        String sql = "SELECT * FROM reservations ORDER BY id DESC";
        List<Reservation> list = new ArrayList<>();
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToReservation(rs));
            }
        }
        return list;
    }

    // ------------------ GET RESERVATION BY ID ------------------
    public Reservation getReservationById(int id) throws SQLException {
        String sql = "SELECT * FROM reservations WHERE id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapResultSetToReservation(rs);
        }
        return null;
    }

    // ------------------ GET RESERVATION BY GUEST NAME ------------------
    public Reservation getReservationByGuestName(String guestName) throws SQLException {
        String sql = "SELECT * FROM reservations WHERE guest_name LIKE ? ORDER BY id DESC LIMIT 1";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, "%" + guestName + "%");
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapResultSetToReservation(rs);
        }
        return null;
    }

    // ------------------ UPDATE STATUS ------------------
    public boolean updateStatus(int reservationId, String status) throws SQLException {
        String sql = "UPDATE reservations SET status = ? WHERE id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, status);
            ps.setInt(2, reservationId);
            return ps.executeUpdate() > 0;
        }
    }

    // ------------------ MARK AS PAID ------------------
    public boolean markAsPaid(int reservationId) throws SQLException {
        String sql = "UPDATE reservations SET paid = TRUE WHERE id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, reservationId);
            return ps.executeUpdate() > 0;
        }
    }

    // ------------------ DELETE RESERVATION ------------------
    public boolean deleteReservation(int reservationId) throws SQLException {
        String sql = "DELETE FROM reservations WHERE id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, reservationId);
            return ps.executeUpdate() > 0;
        }
    }

    // ------------------ DASHBOARD STATS ------------------
    public int getTotalReservations() throws SQLException {
        return getCount("SELECT COUNT(*) FROM reservations");
    }

    public int getConfirmedReservations() throws SQLException {
        return getCount("SELECT COUNT(*) FROM reservations WHERE status = 'CONFIRMED'");
    }

    public int getPendingReservations() throws SQLException {
        return getCount("SELECT COUNT(*) FROM reservations WHERE status = 'PENDING'");
    }

    public double getTotalRevenue() throws SQLException {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM reservations WHERE status = 'CONFIRMED'";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            rs.next();
            return rs.getDouble(1);
        }
    }

    private int getCount(String sql) throws SQLException {
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            rs.next();
            return rs.getInt(1);
        }
    }

    public int getRoomIdByName(String roomName) throws SQLException {
        String sql = "SELECT id FROM rooms WHERE name = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, roomName);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt("id");
        }
        return -1;
    }

    private Reservation mapResultSetToReservation(ResultSet rs) throws SQLException {
        Reservation r = new Reservation();
        r.setId(rs.getInt("id"));
        r.setUserId(rs.getInt("user_id"));
        r.setGuestName(rs.getString("guest_name"));
        r.setGuestEmail(rs.getString("guest_email")); // ✅ now included
        r.setRoomId(rs.getInt("room_id"));
        r.setRoomName(rs.getString("room_name"));
        r.setCheckIn(rs.getDate("check_in"));
        r.setCheckOut(rs.getDate("check_out"));
        r.setStatus(rs.getString("status"));
        r.setAmount(rs.getDouble("amount"));
        r.setPaid(rs.getBoolean("paid"));
        return r;
    }
}
