package com.oceanview.servlet;

import com.oceanview.dao.ReservationDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

@WebServlet("/room/checkAvailability")
public class RoomAvailabilityServlet extends HttpServlet {

    private ReservationDAO reservationDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        reservationDAO = new ReservationDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            int roomId = Integer.parseInt(request.getParameter("roomId"));  // ✅ now int
            String checkInStr = request.getParameter("checkIn");
            String checkOutStr = request.getParameter("checkOut");

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date checkIn = sdf.parse(checkInStr);
            Date checkOut = sdf.parse(checkOutStr);

            boolean available = reservationDAO.isRoomAvailable(roomId, checkIn, checkOut); // ✅ DAO must take roomId now
            out.println("{\"available\":" + available + "}");

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"available\":false,\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
