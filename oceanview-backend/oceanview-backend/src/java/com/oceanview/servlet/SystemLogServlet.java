package com.oceanview.servlet;

import com.oceanview.dao.SystemLogDAO;
import com.oceanview.model.SystemLog;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@WebServlet("/logs")
public class SystemLogServlet extends HttpServlet {

    private SystemLogDAO logDAO;
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    @Override
    public void init() throws ServletException {
        logDAO = new SystemLogDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        HttpSession session = request.getSession(false);
        if (session == null || !"ADMIN".equals(session.getAttribute("role"))) {
            out.println("{\"status\":\"error\",\"message\":\"Access denied\"}");
            return;
        }

        try {
            // Optional filters
            String startDateStr = request.getParameter("startDate");
            String endDateStr = request.getParameter("endDate");
            String userIdStr = request.getParameter("userId");
            String actionType = request.getParameter("action");

            Date startDate = null, endDate = null;
            Integer userId = null;

            if (startDateStr != null && !startDateStr.isEmpty()) {
                startDate = dateFormat.parse(startDateStr);
            }
            if (endDateStr != null && !endDateStr.isEmpty()) {
                endDate = dateFormat.parse(endDateStr);
            }
            if (userIdStr != null && !userIdStr.isEmpty()) {
                userId = Integer.parseInt(userIdStr);
            }

            List<SystemLog> logs = logDAO.getLogs(startDate, endDate, userId, actionType);
            StringBuilder json = new StringBuilder("{\"status\":\"success\",\"logs\":[");

            for (int i = 0; i < logs.size(); i++) {
                SystemLog log = logs.get(i);
                json.append("{")
                        .append("\"id\":").append(log.getId()).append(",")
                        .append("\"userId\":").append(log.getUserId()).append(",")
                        .append("\"action\":\"").append(log.getAction()).append("\",")
                        .append("\"details\":\"").append(log.getDetails()).append("\",")
                        .append("\"timestamp\":\"").append(log.getTimestamp()).append("\",")
                        .append("\"ipAddress\":\"").append(log.getIpAddress()).append("\"")
                        .append("}");
                if (i < logs.size() - 1) json.append(",");
            }

            json.append("]}");
            out.println(json.toString());

        } catch (ParseException | SQLException e) {
            out.println("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }
}
