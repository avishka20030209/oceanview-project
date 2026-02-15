package com.oceanview.servlet;

import com.oceanview.dao.ReservationDAO;
import com.oceanview.model.Reservation;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@WebServlet("/reservation")
public class ReservationServlet extends HttpServlet {

    private ReservationDAO reservationDAO;
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    @Override
    public void init() {
        reservationDAO = new ReservationDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        String action = request.getParameter("action");
        String query = request.getParameter("query");

        try {
            if ("my".equalsIgnoreCase(action)) {
                Integer userId = getUserIdFromSession(request);
                if (userId == null) {
                    out.println("{\"status\":\"error\",\"message\":\"User not logged in\"}");
                    return;
                }
                List<Reservation> list = reservationDAO.getReservationsByUserId(userId);
                out.println(buildReservationListResponse(list));
                return;
            }

            if ("adminAll".equalsIgnoreCase(action)) {
                List<Reservation> reservations = reservationDAO.getAllReservations();
                out.println(buildReservationListResponse(reservations));
                return;
            }

            if ("search".equalsIgnoreCase(action) && query != null) {
                Reservation res = null;
                try { int id = Integer.parseInt(query); res = reservationDAO.getReservationById(id); } catch (NumberFormatException ignored) {}
                if (res == null) res = reservationDAO.getReservationByGuestName(query);

                if (res != null) {
                    out.println("{\"status\":\"success\",\"reservation\":{"
                            + "\"id\":" + res.getId() + ","
                            + "\"guestName\":\"" + res.getGuestName() + "\","
                            + "\"guestEmail\":\"" + res.getGuestEmail() + "\","
                            + "\"roomId\":" + res.getRoomId() + ","
                            + "\"roomName\":\"" + res.getRoomName() + "\","
                            + "\"checkIn\":\"" + dateFormat.format(res.getCheckIn()) + "\","
                            + "\"checkOut\":\"" + dateFormat.format(res.getCheckOut()) + "\","
                            + "\"status\":\"" + res.getStatus() + "\","
                            + "\"amount\":" + res.getAmount() + ","
                            + "\"paid\":" + res.isPaid()
                            + "}}");
                } else {
                    out.println("{\"status\":\"error\",\"message\":\"Reservation not found\"}");
                }
                return;
            }

            out.println("{\"status\":\"error\",\"message\":\"Invalid action\"}");
        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        String action = request.getParameter("action");

        try {
            Integer userId = getUserIdFromSession(request);
            String userRole = getUserRoleFromSession(request);

            if (userId == null) {
                out.println("{\"status\":\"error\",\"message\":\"Login required\"}");
                return;
            }

            if ("add".equalsIgnoreCase(action)) {
                // ----- Get room info -----
                String roomName = request.getParameter("roomName");
                int roomId = reservationDAO.getRoomIdByName(roomName);

                if (roomId == -1) {
                    out.println("{\"status\":\"error\",\"message\":\"Room not found\"}");
                    return;
                }

                Date checkIn = dateFormat.parse(request.getParameter("checkIn"));
                Date checkOut = dateFormat.parse(request.getParameter("checkOut"));

                if (!reservationDAO.isRoomAvailable(roomId, checkIn, checkOut)) {
                    out.println("{\"status\":\"error\",\"message\":\"Room not available\"}");
                    return;
                }

                double totalAmount = Double.parseDouble(request.getParameter("amount"));

                // ----- Determine guest info -----
                String guestName;
                String guestEmail;

                if ("CUSTOMER".equalsIgnoreCase(userRole)) {
                    // Customer: use their own info
                    guestName = getGuestNameFromSession(request);
                    guestEmail = getGuestEmailFromSession(request);
                } else {
                    // Staff: use entered guest info
                    guestName = request.getParameter("guestName");
                    guestEmail = request.getParameter("guestEmail");

                    if (guestName == null || guestName.trim().isEmpty()) {
                        out.println("{\"status\":\"error\",\"message\":\"Guest name is required\"}");
                        return;
                    }
                    if (guestEmail == null || guestEmail.trim().isEmpty()) {
                        out.println("{\"status\":\"error\",\"message\":\"Guest email is required\"}");
                        return;
                    }
                }

                // ----- Create reservation -----
                Reservation r = new Reservation();
                r.setUserId(userId);           // staff or customer ID
                r.setGuestName(guestName);
                r.setGuestEmail(guestEmail);
                r.setRoomId(roomId);
                r.setRoomName(roomName);
                r.setCheckIn(checkIn);
                r.setCheckOut(checkOut);
                r.setStatus("CONFIRMED");
                r.setAmount(totalAmount);
                r.setPaid(false);

                boolean success = reservationDAO.addReservation(r);
                out.println("{\"status\":\"" + (success ? "success" : "error") + "\"}");
                return;
            }

            // ----- Cancel Reservation -----
            if ("cancel".equalsIgnoreCase(action)) {
                int id = Integer.parseInt(request.getParameter("reservationId"));
                boolean success = reservationDAO.updateStatus(id, "CANCELLED");
                out.println("{\"status\":\"" + (success ? "success" : "error") + "\"}");
                return;
            }

            // ----- Delete Reservation -----
            if ("delete".equalsIgnoreCase(action)) {
                int id = Integer.parseInt(request.getParameter("reservationId"));
                boolean success = reservationDAO.deleteReservation(id);
                out.println("{\"status\":\"" + (success ? "success" : "error") + "\"}");
                return;
            }

            // ----- Update Status -----
            if ("updateStatus".equalsIgnoreCase(action)) {
                int id = Integer.parseInt(request.getParameter("id"));
                String status = request.getParameter("status");
                boolean success = reservationDAO.updateStatus(id, status);
                out.println("{\"status\":\"" + (success ? "success" : "error") + "\"}");
                return;
            }

            // ----- Mark as Paid -----
            if ("pay".equalsIgnoreCase(action)) {
                int id = Integer.parseInt(request.getParameter("reservationId"));
                boolean success = reservationDAO.markAsPaid(id);
                out.println("{\"status\":\"" + (success ? "success" : "error") + "\"}");
                return;
            }

            out.println("{\"status\":\"error\",\"message\":\"Invalid action\"}");
        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }

    // ------------------ HELPER METHODS ------------------
    private Integer getUserIdFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return (session != null && session.getAttribute("userId") != null)
                ? (Integer) session.getAttribute("userId") : null;
    }

    private String getGuestNameFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return (session != null && session.getAttribute("fullName") != null)
                ? (String) session.getAttribute("fullName") : null;
    }

    private String getGuestEmailFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return (session != null && session.getAttribute("email") != null)
                ? (String) session.getAttribute("email") : null;
    }

    private String getUserRoleFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return (session != null && session.getAttribute("role") != null)
                ? (String) session.getAttribute("role") : null;
    }

    private String buildReservationListResponse(List<Reservation> list) {
        StringBuilder sb = new StringBuilder();
        sb.append("{\"status\":\"success\",\"reservations\":[");
        for (int i = 0; i < list.size(); i++) {
            Reservation r = list.get(i);
            sb.append("{\"id\":").append(r.getId())
              .append(",\"guestName\":\"").append(r.getGuestName())
              .append("\",\"guestEmail\":\"").append(r.getGuestEmail())
              .append("\",\"roomId\":").append(r.getRoomId())
              .append(",\"roomName\":\"").append(r.getRoomName())
              .append("\",\"checkIn\":\"").append(dateFormat.format(r.getCheckIn()))
              .append("\",\"checkOut\":\"").append(dateFormat.format(r.getCheckOut()))
              .append("\",\"status\":\"").append(r.getStatus())
              .append("\",\"amount\":").append(r.getAmount())
              .append(",\"paid\":").append(r.isPaid())
              .append("}");
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]}");
        return sb.toString();
    }
}
