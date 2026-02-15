package com.oceanview.servlet;

import com.oceanview.dao.RoomDAO;
import com.oceanview.model.Room;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/room")
public class RoomServlet extends HttpServlet {

    private RoomDAO roomDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        roomDAO = new RoomDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        String idParam = request.getParameter("id");

        try {
            if (idParam != null) {
                int roomId = Integer.parseInt(idParam);
                Room room = roomDAO.getRoomById(roomId);
                if (room != null) {
                    out.println("{"
                            + "\"id\":" + room.getId() + ","
                            + "\"name\":\"" + room.getName() + "\","
                            + "\"price\":" + room.getPrice() + ","
                            + "\"available\":" + room.isAvailable() + ","
                            + "\"maxGuests\":" + room.getMaxGuests() + ","
                            + "\"imageUrl\":\"" + room.getImageUrl() + "\","
                            + "\"description\":\"" + room.getDescription() + "\","
                            + "\"amenities\":\"" + room.getAmenities() + "\""
                            + "}");
                } else {
                    out.println("{\"status\":\"error\",\"message\":\"Room not found\"}");
                }
            } else {
                List<Room> rooms = roomDAO.getAllRooms();
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < rooms.size(); i++) {
                    Room r = rooms.get(i);
                    json.append("{")
                            .append("\"id\":").append(r.getId()).append(",")
                            .append("\"name\":\"").append(r.getName()).append("\",")
                            .append("\"price\":").append(r.getPrice()).append(",")
                            .append("\"available\":").append(r.isAvailable()).append(",")
                            .append("\"maxGuests\":").append(r.getMaxGuests()).append(",")
                            .append("\"imageUrl\":\"").append(r.getImageUrl()).append("\",")
                            .append("\"description\":\"").append(r.getDescription()).append("\",")
                            .append("\"amenities\":\"").append(r.getAmenities()).append("\"")
                            .append("}");
                    if (i < rooms.size() - 1) json.append(",");
                }
                json.append("]");
                out.println(json.toString());
            }
        } catch (SQLException e) {
            e.printStackTrace();
            out.println("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Add new room
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        String action = request.getParameter("action");
        try {
            if ("add".equalsIgnoreCase(action)) {
                Room room = new Room();
                room.setName(request.getParameter("name"));
                room.setPrice(Double.parseDouble(request.getParameter("price")));
                room.setAvailable(Boolean.parseBoolean(request.getParameter("available")));
                room.setMaxGuests(Integer.parseInt(request.getParameter("maxGuests")));
                room.setImageUrl(request.getParameter("imageUrl"));
                room.setDescription(request.getParameter("description"));
                room.setAmenities(request.getParameter("amenities"));

                boolean success = roomDAO.addRoom(room);
                if (success) out.println("{\"status\":\"success\",\"message\":\"Room added\"}");
                else out.println("{\"status\":\"error\",\"message\":\"Failed to add room\"}");
            } else if ("delete".equalsIgnoreCase(action)) {
                int roomId = Integer.parseInt(request.getParameter("id"));
                boolean success = roomDAO.deleteRoom(roomId);
                if (success) out.println("{\"status\":\"success\",\"message\":\"Room deleted\"}");
                else out.println("{\"status\":\"error\",\"message\":\"Failed to delete room\"}");
            } else if ("updateAvailability".equalsIgnoreCase(action)) {
                int roomId = Integer.parseInt(request.getParameter("id"));
                boolean available = Boolean.parseBoolean(request.getParameter("available"));
                boolean success = roomDAO.updateRoomAvailability(roomId, available);
                if (success) out.println("{\"status\":\"success\",\"message\":\"Availability updated\"}");
                else out.println("{\"status\":\"error\",\"message\":\"Failed to update availability\"}");
            } else {
                out.println("{\"status\":\"error\",\"message\":\"Invalid action\"}");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            out.println("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }
}
