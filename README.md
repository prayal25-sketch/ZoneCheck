# ZoneCheck - Smart Travel Safety & Emergency Assistance

## Overview

ZoneCheck is a comprehensive travel safety application designed to help tourists and travelers identify safe locations in real-time using crime reports, emergency data, community reporting, and location intelligence.

## 🎯 Core Features

### Safety Awareness
- **Real-time Safety Assessment**: Get instant safety scores for any location
- **Crime Heatmaps**: Visualize crime patterns and dangerous areas
- **Time-Based Analysis**: Understand how safety changes throughout day and night
- **Interactive Safety Map**: See safety zones with color-coded classifications

### Emergency Systems
- **One-Tap SOS**: Emergency alert system with live location sharing
- **Emergency Contacts**: Pre-saved emergency services by country/city
- **Nearby Emergency Services**: Find police, ambulance, fire departments
- **Emergency Guidance**: First-aid instructions before professional help arrives

### Community Features
- **Anonymous Incident Reporting**: Report safety concerns without identification
- **Report Verification**: Community-driven verification system
- **Tourist Scam Alerts**: Real-time warnings about common scams
- **Fake Taxi Alerts**: Report and view fraudulent taxi reports

### Safety Navigation
- **Safe Route Recommendations**: Avoid dangerous areas
- **Women Safety Features**: Specialized safety features for women travelers
- **"Walk With Me" Mode**: Real-time safety tracking and alerts
- **Offline Emergency Support**: Access critical information without internet

## 🏗️ Architecture

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for live updates
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting

### Frontend Stack (To be implemented)
- **Framework**: React with TypeScript
- **Mapping**: Google Maps/Mapbox API
- **State Management**: Redux/Context API
- **UI Components**: Material-UI

## 📦 Project Structure

```
ZoneCheck/
├── backend/
│   ├── src/
│   │   ├── models/              # Database schemas (7 models)
│   │   ├── controllers/         # Route controllers (7 controllers)
│   │   ├── routes/              # API endpoints (7 route files)
│   │   ├── middleware/          # Express middleware
│   │   └── utils/               # Helper functions
│   ├── server.js                # Server entry point
│   └── package.json
├── frontend/                    # React app (to be implemented)
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prayal25-sketch/ZoneCheck.git
   cd ZoneCheck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker-compose up -d mongodb
   
   # Or start MongoDB service locally
   ```

5. **Run the server**
   ```bash
   npm run dev  # Development mode with nodemon
   npm start    # Production mode
   ```

6. **Access the API**
   ```
   http://localhost:5000/health
   ```

### Using Docker

```bash
# Build and start all services
docker-compose up --build

# Access the API at http://localhost:5000
```

## 📡 Complete API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Safety Reports
- `POST /api/safety/report` - Submit safety report
- `GET /api/safety/reports` - Get reports near location
- `POST /api/safety/verify/:reportId` - Verify a report
- `GET /api/safety/zones` - Get safety zones
- `GET /api/safety/score/:location` - Get location safety score
- `GET /api/safety/heatmap` - Get crime heatmap data

### Emergency Services
- `GET /api/emergency/contacts/:country` - Get emergency contacts by country
- `GET /api/emergency/nearby` - Get nearby emergency services
- `GET /api/emergency/hospitals` - Find nearby hospitals
- `GET /api/emergency/police-stations` - Find nearby police stations

### SOS Alerts
- `POST /api/sos/trigger` - Trigger SOS alert
- `PATCH /api/sos/:sosId/status` - Update SOS status
- `POST /api/sos/:sosId/share-location` - Share live location
- `GET /api/sos/:sosId` - Get SOS alert details
- `POST /api/sos/:sosId/cancel` - Cancel SOS alert

### First Aid Guides
- `GET /api/firstaid/guide/:emergencyType` - Get first-aid guide
- `GET /api/firstaid/guides` - Get all guides
- `GET /api/firstaid/search` - Search guides
- `GET /api/firstaid/offline` - Get offline available guides

### Tourist Alerts
- `POST /api/reports/scam` - Report a scam
- `GET /api/reports/scam-reports` - Get scam alerts nearby
- `POST /api/reports/fake-taxi` - Report fake taxi
- `GET /api/reports/tourist-alerts` - Get tourist alerts

### Map & Location
- `GET /api/map/data` - Get map data
- `POST /api/map/safe-routes` - Calculate safe routes
- `POST /api/map/track-location` - Track user location
- `PATCH /api/map/update-location` - Update user location

## 🗄️ Database Models

### User Model
- Profile information (first name, last name, email, phone)
- Emergency contacts
- Medical information (blood type, allergies, medications)
- Safety preferences
- Current location with geospatial indexing
- Safety score (0-100)
- User type (tourist, resident, emergency_responder)

### SafetyReport Model
- Report ID and user ID
- Geolocation (Point with coordinates)
- Incident type (crime, harassment, accident, etc.)
- Severity level (low, medium, high, critical)
- Description and media (images, videos)
- Verification status and count
- Crowd analysis data
- Time of incident and report

### EmergencyContact Model
- Service type (police, ambulance, fire, women helpline, etc.)
- Contact details (phone, email, website)
- Location with geospatial indexing
- Operating hours
- Available 24/7 flag
- Languages supported
- Rating and review count

### SOSAlert Model
- SOS ID and user ID
- Location with coordinates
- Emergency type and severity
- Status tracking (active, acknowledged, resolved)
- Shared with emergency contacts
- Nearest services (police, ambulance, fire)
- First-aid guide recommendations
- Response notes from responders

### FirstAidGuide Model
- Emergency type (15+ types)
- Severity level
- Step-by-step instructions
- Precautions and warnings
- Symptoms to watch for
- When to call emergency services
- Voice guidance URL
- Offline availability flag

### SafetyZone Model
- Zone boundaries (Polygon)
- Safety score and classification
- Crime statistics
- Day/night safety scores
- Amenities list
- Nearby emergency services
- Travel recommendations

### TouristAlert Model
- Alert type (scam, fake taxi, theft risk, etc.)
- Location and severity
- Specific warnings and prevention tips
- Target groups and methods
- Active status and expiration
- Similar reports reference

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication with 7-day expiry
- **Helmet**: Protects against various HTTP attacks
- **CORS**: Cross-origin resource sharing configured
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Password Hashing**: Bcrypt with 10 salt rounds
- **Input Validation**: Joi schema validation for all inputs
- **Error Handling**: Comprehensive error handling middleware
- **Async Error Handling**: Automatic try-catch wrapping

## 📝 Environment Variables

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zonecheck
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
GOOGLE_MAPS_API_KEY=your_api_key
FIREBASE_API_KEY=your_firebase_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

See `.env.example` for all configuration options.

## 🚢 Deployment

### Using Docker

1. Build the image
   ```bash
   docker build -t zonecheck:latest .
   ```

2. Run the container
   ```bash
   docker run -p 5000:5000 --env-file .env zonecheck:latest
   ```

3. Or use Docker Compose
   ```bash
   docker-compose up -d
   ```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 📚 File Structure Details

### Backend Models (7 files)
- `User.js` - 95 lines - User profiles and authentication
- `SafetyReport.js` - 105 lines - Community incident reports
- `EmergencyContact.js` - 85 lines - Emergency services directory
- `SOSAlert.js` - 110 lines - Emergency SOS system
- `FirstAidGuide.js` - 95 lines - First-aid instructions
- `SafetyZone.js` - 100 lines - Geofenced safety areas
- `TouristAlert.js` - 100 lines - Tourist-specific alerts

### Controllers (7 files)
- `authController.js` - Authentication endpoints
- `safetyController.js` - Safety reports and heatmaps
- `emergencyController.js` - Emergency services lookup
- `sosController.js` - SOS alert management
- `firstaidController.js` - First-aid guide retrieval
- `mapController.js` - Map data and routing
- `reportController.js` - Tourist alerts and scam reporting

### Routes (7 files)
- `auth.js` - /api/auth endpoints
- `safety.js` - /api/safety endpoints
- `emergency.js` - /api/emergency endpoints
- `sos.js` - /api/sos endpoints
- `firstaid.js` - /api/firstaid endpoints
- `map.js` - /api/map endpoints
- `reports.js` - /api/reports endpoints

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Priyanshi shah** - Initial work

## 📞 Support

For support, open an issue on GitHub or email support@zonecheck.com

## 🗺️ Roadmap

- [ ] Frontend React application
- [ ] Mobile app (iOS/Android)
- [ ] AI-based safety prediction
- [ ] Machine learning models for crime prediction
- [ ] Integration with local authorities
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] SMS/Push notifications
- [ ] Video verification system
- [ ] Blockchain-based report verification

---

**ZoneCheck** - Making travel safer, one location at a time. 🛡️
