package com.oceanview.dao;

import com.oceanview.model.Room;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.sql.SQLException;
import java.util.List;

import static org.junit.Assert.*;

public class RoomDAOTest {

    private RoomDAO roomDAO;
    private int insertedRoomId;

    @Before
    public void setUp() throws SQLException {
        roomDAO = new RoomDAO();

        Room testRoom = new Room(
                0,
                "JUnit Test Room",
                9999.0,
                true,
                2,
                "Deluxe",
                "test.jpg",
                "Test description",
                "WiFi,TV"
        );

        roomDAO.addRoom(testRoom);

        // Fetch inserted room
        List<Room> rooms = roomDAO.getAllRooms();
        for (Room r : rooms) {
            if (r.getName().equals("JUnit Test Room")) {
                insertedRoomId = r.getId();
                break;
            }
        }
    }

    @After
    public void tearDown() throws SQLException {
        if (insertedRoomId > 0) {
            roomDAO.deleteRoom(insertedRoomId);
        }
    }

    @Test
    public void testAddRoom() {
        assertTrue(insertedRoomId > 0);
    }

    @Test
    public void testGetRoomById() throws SQLException {
        Room room = roomDAO.getRoomById(insertedRoomId);
        assertNotNull(room);
        assertEquals("JUnit Test Room", room.getName());
    }

    @Test
    public void testUpdateRoomAvailability() throws SQLException {
        boolean updated = roomDAO.updateRoomAvailability(insertedRoomId, false);
        assertTrue(updated);

        Room room = roomDAO.getRoomById(insertedRoomId);
        assertFalse(room.isAvailable());
    }

    @Test
    public void testUpdateRoomFull() throws SQLException {
        Room room = roomDAO.getRoomById(insertedRoomId);

        room.setName("Updated Room");
        room.setPrice(8888.0);
        room.setAvailable(true);

        boolean updated = roomDAO.updateRoom(room);
        assertTrue(updated);

        Room updatedRoom = roomDAO.getRoomById(insertedRoomId);
        assertEquals("Updated Room", updatedRoom.getName());
        assertEquals(8888.0, updatedRoom.getPrice(), 0.01);
    }

    @Test
    public void testDeleteRoom() throws SQLException {
        boolean deleted = roomDAO.deleteRoom(insertedRoomId);
        assertTrue(deleted);
    }

    @Test
    public void testGetAllRooms() throws SQLException {
        List<Room> rooms = roomDAO.getAllRooms();
        assertNotNull(rooms);
        assertTrue(rooms.size() >= 0);
    }
}