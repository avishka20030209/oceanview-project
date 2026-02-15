package com.oceanview.model;

import java.util.Date;
import java.text.SimpleDateFormat;

public class Reservation {

    private int id;
    private int userId;        
    private int roomId;        
    private String guestName;
    private String guestEmail;
    private String roomName;
    private Date checkIn;
    private Date checkOut;
    private String status;     
    private double amount;   // Total amount including VAT & service charge
    private boolean paid;      

    private static final double VAT_PERCENT = 0.15;          // 15%
    private static final double SERVICE_CHARGE_PERCENT = 0.10; // 10%

    public Reservation() {}

    public Reservation(int userId, int roomId, String guestName, String guestEmail, String roomName,
                       Date checkIn, Date checkOut, String status, double baseAmount) {
        this.userId = userId;
        this.roomId = roomId;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.roomName = roomName;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = status;
        setAmountWithExtras(baseAmount);
        this.paid = false;
    }

    public Reservation(int id, int userId, int roomId, String guestName, String guestEmail, String roomName,
                       Date checkIn, Date checkOut, String status, double baseAmount, boolean paid) {
        this.id = id;
        this.userId = userId;
        this.roomId = roomId;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.roomName = roomName;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = status;
        setAmountWithExtras(baseAmount);
        this.paid = paid;
    }

    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getRoomId() { return roomId; }
    public void setRoomId(int roomId) { this.roomId = roomId; }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public Date getCheckIn() { return checkIn; }
    public void setCheckIn(Date checkIn) { this.checkIn = checkIn; }

    public Date getCheckOut() { return checkOut; }
    public void setCheckOut(Date checkOut) { this.checkOut = checkOut; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }

    public double getVATAmount() {
        return amount * VAT_PERCENT / (1 + VAT_PERCENT + SERVICE_CHARGE_PERCENT);
    }

    public double getServiceChargeAmount() {
        return amount * SERVICE_CHARGE_PERCENT / (1 + VAT_PERCENT + SERVICE_CHARGE_PERCENT);
    }

    public void setAmountWithExtras(double baseAmount) {
        this.amount = baseAmount + (baseAmount * VAT_PERCENT) + (baseAmount * SERVICE_CHARGE_PERCENT);
    }

    public String getCheckInString() { return formatDate(checkIn); }
    public String getCheckOutString() { return formatDate(checkOut); }

    private String formatDate(Date date) {
        if (date == null) return "";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(date);
    }

    @Override
    public String toString() {
        return "Reservation{" +
                "id=" + id +
                ", userId=" + userId +
                ", roomId=" + roomId +
                ", guestName='" + guestName + '\'' +
                ", guestEmail='" + guestEmail + '\'' +
                ", roomName='" + roomName + '\'' +
                ", checkIn=" + getCheckInString() +
                ", checkOut=" + getCheckOutString() +
                ", status='" + status + '\'' +
                ", amount=" + amount +
                ", paid=" + paid +
                '}';
    }
}
