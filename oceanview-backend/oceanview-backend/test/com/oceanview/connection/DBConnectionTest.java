package com.oceanview.connection;

import org.junit.Test;
import static org.junit.Assert.*;

import java.sql.Connection;
import java.sql.SQLException;

public class DBConnectionTest {

    @Test
    public void testDatabaseConnectionNotNull() throws SQLException {
        DBConnection dbConnection = DBConnection.getInstance();
        Connection connection = dbConnection.getConnection();

        assertNotNull("Connection should not be null", connection);
        assertFalse("Connection should not be closed", connection.isClosed());
    }

    @Test
    public void testSingletonInstance() throws SQLException {
        DBConnection instance1 = DBConnection.getInstance();
        DBConnection instance2 = DBConnection.getInstance();

        assertSame("Both instances should be the same (Singleton)", instance1, instance2);
    }
}