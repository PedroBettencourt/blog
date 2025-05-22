const { ExtractJwt, Strategy } = require('passport-jwt');
const passport = require('passport');
const prisma = require('./prisma/queries').prisma;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};

const strategy = new Strategy(opts, async(payload, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, null);
    }
});

module.exports = () => passport.use(strategy);