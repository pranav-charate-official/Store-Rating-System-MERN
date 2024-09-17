# Store Rating System

This project is a Store Rating System that allows users to rate stores, and store owners to view ratings. It includes three main user roles: System Admin, Normal User, and Store Owner. Each role has specific functionalities to manage and interact with the system.

## Features

### System Admin
- Add Stores, Normal Users, and Admin Users
- View Dashboard with total users, total stores, and users who submitted ratings
- Manage user and store listings with sorting and filtering options

### Normal User
- Sign up and log in
- View and search registered stores
- Submit and modify ratings for stores
- Change password

### Store Owner
- Log in
- View dashboard with user ratings and average rating
- Change password

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/pranav-charate-official/store-rating-system.git
cd store-rating-system
```

2. Install dependencies for both backend and frontend:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### Running the Project

1. Start the development server:

```bash
npm run dev
```

This command will concurrently start both the backend and frontend servers.

2. Open your browser and navigate to:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

### Environment Variables

Create a `.env` file in the [`backend`] directory and add the following environment variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```


###

 API Endpoints

- **Auth Routes**: `/api/auth`
- **User Routes**: `/api/users`
- **Store Routes**: `/api/stores`

### Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## License

This project is licensed under the MIT License.
