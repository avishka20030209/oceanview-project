package com.oceanview.servlet;

import com.oceanview.dao.ReservationDAO;
import com.oceanview.model.Reservation;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/reservation/my")
public class MyReservationsServlet extends HttpServlet {

    private ReservationDAO reservationDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        reservationDAO = new ReservationDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        // Get current logged-in user ID from session
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.println("{\"error\":\"User not logged in\"}");
            return;
        }

        int userId = (int) session.getAttribute("userId");

        try {
            List<Reservation> reservations = reservationDAO.getReservationsByUserId(userId);

            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < reservations.size(); i++) {
                Reservation r = reservations.get(i);
                json.append("{")
                    .append("\"id\":").append(r.getId()).append(",")
                    .append("\"userId\":").append(r.getUserId()).append(",")
                    .append("\"roomId\":").append(r.getRoomId()).append(",")
                    .append("\"guestName\":\"").append(r.getGuestName()).append("\",")
                    .append("\"roomName\":\"").append(r.getRoomName()).append("\",")
                    .append("\"checkIn\":\"").append(r.getCheckInString()).append("\",")
                    .append("\"checkOut\":\"").append(r.getCheckOutString()).append("\",")
                    .append("\"status\":\"").append(r.getStatus()).append("\",")
                    .append("\"totalAmount\":").append(r.getAmount())
                    .append("}");
                if (i < reservations.size() - 1) json.append(",");
            }
            json.append("]");

            out.println(json.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
