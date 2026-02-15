package com.oceanview.dao;

import com.oceanview.model.SystemLog;

import java.sql.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class SystemLogDAO {

    private final String jdbcURL = "jdbc:mysql://localhost:3306/oceanview";
    private final String dbUser = "root";
    private final String dbPassword = "";

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(jdbcURL, dbUser, dbPassword);
    }

    // Fetch logs with optional filters
    public List<SystemLog> getLogs(Date startDate, Date endDate, Integer userId, String actionType) throws SQLException {
        List<SystemLog> logs = new ArrayList<>();

        StringBuilder sql = new StringBuilder("SELECT * FROM system_logs WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (startDate != null) {
            sql.append(" AND timestamp >= ?");
            params.add(new java.sql.Timestamp(startDate.getTime()));
        }
        if (endDate != null) {
            sql.append(" AND timestamp <= ?");
            params.add(new java.sql.Timestamp(endDate.getTime()));
        }
        if (userId != null) {
            sql.append(" AND user_id = ?");
            params.add(userId);
        }
        if (actionType != null && !actionType.isEmpty()) {
            sql.append(" AND action LIKE ?");
            params.add("%" + actionType + "%");
        }

        sql.append(" ORDER BY timestamp DESC");

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < params.size(); i++) {
                stmt.setObject(i + 1, params.get(i));
            }

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                SystemLog log = new SystemLog();
                log.setId(rs.getInt("id"));
                log.setUserId(rs.getInt("user_id"));
                log.setAction(rs.getString("action"));
                log.setDetails(rs.getString("details"));
                log.setTimestamp(rs.getTimestamp("timestamp"));
                log.setIpAddress(rs.getString("ip_address"));
                logs.add(log);
            }
        }

        return logs;
    }

    // Optional: add a log entry
    public void addLog(int userId, String action, String details, String ipAddress) throws SQLException {
        String sql = "INSERT INTO system_logs (user_id, action, details, timestamp, ip_address) VALUES (?, ?, ?, NOW(), ?)";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setString(2, action);
            stmt.setString(3, details);
            stmt.setString(4, ipAddress);
            stmt.executeUpdate();
        }
    }
}
