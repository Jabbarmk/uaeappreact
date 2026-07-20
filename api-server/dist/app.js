"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const home_1 = __importDefault(require("./routes/home"));
const search_1 = __importDefault(require("./routes/search"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const adminUsers_1 = __importDefault(require("./routes/adminUsers"));
const categories_1 = __importDefault(require("./routes/categories"));
const businesses_1 = __importDefault(require("./routes/businesses"));
const classifieds_1 = __importDefault(require("./routes/classifieds"));
const realestate_1 = __importDefault(require("./routes/realestate"));
const userRealestate_1 = __importDefault(require("./routes/userRealestate"));
const events_1 = __importDefault(require("./routes/events"));
const universities_1 = __importDefault(require("./routes/universities"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const offers_1 = __importDefault(require("./routes/offers"));
const profiles_1 = __importDefault(require("./routes/profiles"));
const taxonomy_1 = __importDefault(require("./routes/taxonomy"));
const pages_1 = __importDefault(require("./routes/pages"));
const admin_1 = __importDefault(require("./routes/admin"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.SITE_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
}));
// Serve uploaded files
const uploadsPath = path_1.default.resolve(process.env.UPLOAD_PATH || '../assets/uploads');
app.use('/assets/uploads', express_1.default.static(uploadsPath));
app.use('/assets/images', express_1.default.static(path_1.default.resolve('../assets/images')));
// API routes
app.use('/api/home', home_1.default);
app.use('/api/search', search_1.default);
app.use('/api/categories', categories_1.default);
app.use('/api/businesses', businesses_1.default);
app.use('/api/classifieds', classifieds_1.default);
app.use('/api/realestate', realestate_1.default);
app.use('/api/events', events_1.default);
app.use('/api/universities', universities_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/offers', offers_1.default);
app.use('/api/profiles', profiles_1.default);
app.use('/api', taxonomy_1.default);
app.use('/api/pages', pages_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/admin/users', adminUsers_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/user/realestate', userRealestate_1.default);
app.use('/api/user', user_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
