import { AdminModule } from '@adminjs/nestjs';
import * as AdminJSSequelize from '@adminjs/sequelize';
import { Module } from '@nestjs/common';
import AdminJS from 'adminjs';
import { Audio } from 'src/audios/audios.model';
import { Genre } from 'src/genres/genre.model';

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

export const adminConfig = {
  adminJsOptions: {
    rootPath: '/admin',
    resources: [Audio, Genre],
  },
  auth: {
    authenticate,
    cookieName: 'adminjs',
    cookiePassword: 'secret',
  },
  sessionOptions: {
    resave: true,
    saveUninitialized: true,
    secret: 'secret',
  },
};
