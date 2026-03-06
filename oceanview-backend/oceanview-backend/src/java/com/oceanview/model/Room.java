package com.oceanview.model;

public class Room {
    private int id;
    private String name;
    private double price;
    private boolean available;
    private int maxGuests;
    private String type;
    private String imageUrl;
    private String description;
    private String amenities;

    public Room() {}

    public Room(int id, String name, double price, boolean available, int maxGuests,
                String type, String imageUrl, String description, String amenities) { // ✅ include type
        this.id = id;
        this.name = name;
        this.price = price;
        this.available = available;
        this.maxGuests = maxGuests;
        this.type = type;
        this.imageUrl = imageUrl;
        this.description = description;
        this.amenities = amenities;
    }

   
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public int getMaxGuests() { return maxGuests; }
    public void setMaxGuests(int maxGuests) { this.maxGuests = maxGuests; }

    public String getType() { return type; } // ✅ new getter
    public void setType(String type) { this.type = type; } // ✅ new setter

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }

    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", available=" + available +
                ", maxGuests=" + maxGuests +
                ", type='" + type + '\'' +
                '}';
    }
}