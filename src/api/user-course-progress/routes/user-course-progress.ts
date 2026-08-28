import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::user-course-progress.user-course-progress', {
  config: {
    find: { auth: false },
    findOne: { auth: false },
    create: { auth: false },
    update: { auth: false },
    delete: { auth: false },
  },
});
