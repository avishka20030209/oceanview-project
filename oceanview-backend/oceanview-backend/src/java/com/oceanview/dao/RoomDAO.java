package com.oceanview.dao;

import com.oceanview.connection.DBConnection;
import com.oceanview.model.Room;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RoomDAO {

    // Get all rooms
    public List<Room> getAllRooms() throws SQLException {
        List<Room> rooms = new ArrayList<>();
        String sql = "SELECT * FROM rooms";

        try (Connection conn = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Room room = new Room(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getDouble("price"),
                        rs.getBoolean("available"),
                        rs.getInt("max_guests"),
                        rs.getString("image_url"),
                        rs.getString("description"),
                        rs.getString("amenities")
                );
                rooms.add(room);
            }
        }
        return rooms;
    }

    // Get room by ID
    public Room getRoomById(int id) throws SQLException {
        String sql = "SELECT * FROM rooms WHERE id = ?";
        try (Connection conn = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Room(
                            rs.getInt("id"),
                            rs.getString("name"),
                            rs.getDouble("price"),
                            rs.getBoolean("available"),
                            rs.getInt("max_guests"),
                            rs.getString("image_url"),
                            rs.getString("description"),
                            rs.getString("amenities")
                    );
                }
            }
        }
        return null;
    }

    // Add new room
    public boolean addRoom(Room room) throws SQLException {
        String sql = "INSERT INTO rooms (name, price, available, max_guests, image_url, description, amenities) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, room.getName());
            stmt.setDouble(2, room.getPrice());
            stmt.setBoolean(3, room.isAvailable());
            stmt.setInt(4, room.getMaxGuests());
            stmt.setString(5, room.getImageUrl());
            stmt.setString(6, room.getDescription());
            stmt.setString(7, room.getAmenities());

            return stmt.executeUpdate() > 0;
        }
    }

    // Update availability
    public boolean updateRoomAvailability(int roomId, boolean available) throws SQLException {
        String sql = "UPDATE rooms SET available = ? WHERE id = ?";
        try (Connection conn = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setBoolean(1, available);
            stmt.setInt(2, roomId);
            return stmt.executeUpdate() > 0;
        }
    }

    // Delete room
    public boolean deleteRoom(int roomId) throws SQLException {
        String sql = "DELETE FROM rooms WHERE id = ?";
        try (Connection conn = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, roomId);
            return stmt.executeUpdate() > 0;
        }
    }
}
