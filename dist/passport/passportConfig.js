"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const passport_local_1 = require("passport-local");
const dbconnector_1 = __importDefault(require("../dbConfig/dbconnector"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        dbconnector_1.default.query(`SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            if (results.rows.length > 0) {
                const user = results.rows[0];
                bcrypt_1.default.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    }
                    if (isMatch) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false, { message: 'Password is not correct' });
                    }
                });
            }
            else {
                return done(null, false, { message: 'Email not registered' });
            }
        });
    };
    passport.use(new passport_local_1.Strategy({
        usernameField: 'email',
        passwordField: 'password',
    }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        dbconnector_1.default.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
            if (err) {
                return done(err);
            }
            console.log(`ID is ${results.rows[0].id}`);
            return done(null, results.rows[0]);
        });
    });
}
exports.initialize = initialize;
//# sourceMappingURL=passportConfig.js.map