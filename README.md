# Smart Campus Operations Hub

This project is developed as part of the PAF module.

It includes a Spring Boot backend and a React frontend to manage campus resources and notifications.

## Project Overview

The system allows users to manage facilities such as lecture halls, labs, and equipment, and receive notifications related to system activities.

## Modules

### Module A: Facilities & Assets Catalogue
- Manage resources (lecture halls, labs, equipment)
- Store details such as type, capacity, location, and status
- Perform basic search and filtering

### Module D: Notifications System
- Display notifications related to system updates
- Notify users when resource status changes
- Mark notifications as read

## Project Structure

smart-campus-project/
├── backend/        # Spring Boot API  
├── frontend/       # React application  

## Getting Started

### Backend
1. Navigate to backend folder  
2. Run the application using Maven or your IDE  
3. API runs on http://localhost:8080  

### Frontend
1. Navigate to frontend folder  
2. Run npm install  
3. Run npm start or npm run dev  

## Features

- Resource management (CRUD operations)
- Notification panel with periodic updates (polling)
- Basic UI for managing and viewing data
