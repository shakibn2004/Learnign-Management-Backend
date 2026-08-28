export default {
  routes: [
    {
      method: 'POST',
      path: '/lms-users/login',
      handler: 'lms-user.login',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/lms-users/register',
      handler: 'lms-user.register',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/lms-users/me',
      handler: 'lms-user.me',
      config: {
        auth: false,
      },
    },
  ],
};
