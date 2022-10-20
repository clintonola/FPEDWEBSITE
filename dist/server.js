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
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.set('view engine', 'ejs');
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', (_req, res) => {
    res.render('index');
});
app.get('/users/register', (_req, res) => {
    res.render('register');
});
app.get('/users/login', (_req, res) => {
    res.render('login');
});
app.get('/users/display', (_req, res) => {
    res.render('display', { user: 'clinton' });
});
app.post('/users/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body;
    body = req.body;
    console.log({ body });
    let errors = [];
    if (!body.name || !body.email || !body.password || !body.password2) {
        errors.push({ message: 'Please enter all fields' });
    }
    if (body.password.length < 6) {
        errors.push({ message: 'Please should be at least 6 character' });
    }
    if (body.password != body.password2) {
        errors.push({ message: 'Password do not match' });
    }
    if (errors.length > 0) {
        res.render('register', { errors });
    }
    else {
        let hashedPassword = yield bcrypt_1.default.hash(body.password, 10);
        console.log(hashedPassword);
        dbconnector_1.default.query(`SELECT * FROM users
     WHERE email = $1`, [body.email], (err, results) => {
            if (err) {
                console.log('here');
                throw err;
            }
            console.log(results.rows);
        });
    }
}));
app.listen(PORT, () => console.log(`Sever running on port ${PORT}`));
//# sourceMappingURL=server.js.map