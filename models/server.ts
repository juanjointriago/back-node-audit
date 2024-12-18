import express, { Application } from 'express';
import userRoutes from '../routes/user';
import profilesRoutes from '../routes/profile';
import rolesRoutes from '../routes/role';
import authRoutes from '../routes/auth';
import paramsRoutes from '../routes/param';
import cors from 'cors';

class Server{

    private app: Application;
    private port: string;
    private apiPaths = {
        users: '/api/users',
        profiles: '/api/profiles',
        roles: '/api/roles',
        auth: '/api/auth',
        params: '/api/params'
    }

    constructor(){
        this.app = express();
        this.port = process.env.PORT || '3000';
        this.middlewares();
        this.routes();
    }

    middlewares (){
        this.app.use( cors() );
        this.app.use( express.json() );
        this.app.use( express.static('public') );
    }

    routes (){
        this.app.use(this.apiPaths.users, userRoutes);
        this.app.use(this.apiPaths.profiles, profilesRoutes);
        this.app.use(this.apiPaths.roles, rolesRoutes);
        this.app.use(this.apiPaths.auth, authRoutes);
        this.app.use(this.apiPaths.params, paramsRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server iniciado: ' + this.port);
        })
    }
}

export default Server;