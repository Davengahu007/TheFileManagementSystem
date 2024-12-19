# File Management System

## Introduction
This project is a File Management System designed to organize and manage digital files within a structured directory. It allows users to create, delete, and navigate through directories and manage files, including uploading, downloading, renaming, and deleting files.

## Features
- **Directory Management**: Create, delete, and browse directories.
- **File Operations**: Upload, download, rename, and delete files.
- **Dynamic Navigation**: Navigate through directories and view their contents.
- **File Previews**: Preview file details before downloading.

## Technologies Used
- **Backend**: SpringBoot Java
- **Frontend**: React.js with Tailwind CSS for styling
- **Database**: PostgreSQL (choose based on your setup)
- **API Testing**: Postman for API route testing

## Setup Instructions

### Prerequisites
- Springboot Framework
- npm
- PostgreSQL
- Git (optional)

### Backend Setup
1. Clone the repository (if using Git):
   ```git clone https://github.com/Davengahu007/FileManagementSystem```

2. Install Dependendcies
   ```cd backend npm install```

3. Configure your database:
- Ensure that your database service is running.
- Configure the database connection settings in `config.js` or through environment variables.

4. Start the server:
   ```npm start```


### Frontend Setup
1. Navigate to the frontend directory:
   ```cd frontend```

2. Install dependencies:
   ```npm install```

3. Start the React application:
   ```npm start```

- The application will run on `http://localhost:3000`.

## API Endpoints

### Directories
- **GET /api/directories/all** - Retrieve all directories.
- **GET /api/directories/** - Retrieve all top-level directories.
- **GET /api/directories/{id}** - Retrieve a specific directory by ID.
- **GET /api/directories/{id}/children** - Retrieve all child directories of a specific directory.
- **GET /api/directories/{id}/files** - Retrieve all files within a specific directory.
- **POST /api/directories/** - Create a new directory.
- **PUT /api/directories/{id}** - Update a specific directory.
- **DELETE /api/directories/{id}** - Delete a specific directory.

### Files
- **GET /api/files/** - Retrieve all files.
- **GET /api/files/{id}** - Retrieve a specific file by ID.
- **POST /api/files/** - Create a new file record.
- **POST /api/files/upload** - Upload a file to a specified directory.
- **GET /api/files/files/download/{id}** - Download a specific file.
- **PUT /api/files/{id}** - Update a specific file.
- **DELETE /api/files/{id}** - Delete a specific file.

## Using the Application
- Navigate to the root URL (e.g., `http://localhost:3000`).
- Use the interface to create, delete, and navigate directories.
- Upload or download files by following the prompts on the interface.

##Screenshots
![image](https://github.com/user-attachments/assets/0cc95c4b-bd24-4a26-bdc4-d64275caaa67)
![image](https://github.com/user-attachments/assets/49133505-5287-498b-961e-98e88e4fab69)
![image](https://github.com/user-attachments/assets/194e0021-5bcd-46ed-a48d-5a773f119504)
![image](https://github.com/user-attachments/assets/890a86cc-aa63-435a-b604-19d6cb306a74)
![image](https://github.com/user-attachments/assets/f2733f12-1172-4981-af8d-5542effc118f)
![image](https://github.com/user-attachments/assets/1627f34a-a73c-4147-ac1c-f9e1070e20dd)
![image](https://github.com/user-attachments/assets/2e5c350d-0357-40a2-932a-0938df55e1e1)
![image](https://github.com/user-attachments/assets/b94ae235-0e16-441a-af6c-66dca401e162)
![image](https://github.com/user-attachments/assets/f247bfee-7e6c-457e-9830-dbc75516f64d)
![image](https://github.com/user-attachments/assets/fe0c9d62-4132-4fe5-b102-200b0ac42807)


## Future Enhancements
- Implement user authentication.
- Add file search functionality.
- Support file versioning.


