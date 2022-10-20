"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dbconnector_1 = __importDefault(require("./dbConfig/dbconnector"));
const express_session_1 = __importDefault(require("express-session"));
const express_flash_1 = __importDefault(require("express-flash"));
const passport_1 = __importDefault(require("passport"));
const passportConfig_1 = require("./passport/passportConfig");
(0, passportConfig_1.initialize)(passport_1.default);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.set('view engine', 'ejs');
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_session_1.default)({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));
let body;
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, express_flash_1.default)());
app.get('/', (_req, res) => {
    res.render('index');
});
app.get('/users/register', checkAuthenticated, (_req, res) => {
    res.render('register');
});
app.get('/users/login', checkAuthenticated, (_req, res) => {
    res.render('login');
});
app.get('/users/display', checkNotAuthenticated, (req, res) => {
    res.render('display', { user: req.user.name });
});
app.get('/users/logout', (req, res) => {
    req.logOut(function (err) {
        if (err) {
            return err;
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });
});
app.post('/users/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    body = req.body;
    console.log({ body });
    let errors = [];
    if (!body.name || !body.email || !body.password || !body.password2) {
        errors.push('Please enter all fields');
    }
    if (body.password.length < 6) {
        errors.push('Please should be at least 6 character');
    }
    if (body.password != body.password2) {
        errors.push('Password do not match');
    }
    if (errors.length > 0) {
        res.render('register', { errors });
    }
    else {
        let hashedPassword = yield bcrypt_1.default.hash(body.password, 10);
        dbconnector_1.default.query(`SELECT * FROM users
     WHERE email = $1`, [body.email], (err, results) => {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            if (results.rows.length > 0) {
                errors.push('Email already exist');
                res.render('register', { errors });
            }
            else {
                dbconnector_1.default.query(`INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`, [body.name, body.email, hashedPassword], (err, results) => {
                    if (err) {
                        throw err;
                    }
                    console.log(results.rows);
                    req.flash('success_msg', 'You are now registered. Log in');
                    res.redirect('/users/login');
                });
            }
        });
    }
}));
app.post('/users/login', passport_1.default.authenticate('local', {
    successRedirect: '/users/display',
    failureRedirect: '/users/login',
    failureFlash: true,
}));
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/display');
    }
    next();
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}
app.listen(PORT, () => console.log(`Sever running on port ${PORT}`));
//# sourceMappingURL=server.js.map