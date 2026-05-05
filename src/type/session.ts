import 'express-session';

declare module 'express-session' {
    interface SessionData {
        user: {
            email: string;
            avatar: string;
        }
    }
}