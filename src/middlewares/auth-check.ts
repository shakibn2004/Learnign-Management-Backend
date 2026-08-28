import type { Core } from '@strapi/strapi';

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    // Only check API routes
    if (!ctx.path.startsWith('/api/')) {
      return next();
    }

    const userRole = ctx.headers['x-user-role'];
    const userId = ctx.headers['x-user-id'];

    // In Strapi, if there is no role header, we allow GET requests (public read access).
    // But any write/mutating request (POST, PUT, DELETE) must specify a role header.
    if (!userRole) {
      if (ctx.method === 'GET') {
        return next();
      }
      ctx.status = 403;
      ctx.body = { error: 'No user role specified in headers.' };
      return;
    }

    if (userRole === 'Admin') {
      return next(); // Admin has full access
    }

    const method = ctx.method;
    const path = ctx.path;

    // 1. LMS User management: Admin only (non-admins cannot modify or access other user data, except updating own profile)
    if (path.startsWith('/api/lms-users')) {
      if (method !== 'GET') {
        // Students can update their own profile enrolled courses
        if (userRole === 'Student' && method === 'PUT' && userId) {
          const parts = path.split('/');
          const targetId = parts[parts.length - 1];
          if (targetId === userId) {
            return next();
          }
        }
        ctx.status = 403;
        ctx.body = { error: 'Only Admin can modify user roles.' };
        return;
      }
    }

    // 2. Blog Posts: Content Manager and Admin can write/edit. Others (Student, Instructor) can only read (GET).
    if (path.startsWith('/api/blog-posts')) {
      if (method !== 'GET') {
        if (userRole !== 'Content Manager') {
          ctx.status = 403;
          ctx.body = { error: 'Only Content Manager and Admin can edit blog posts.' };
          return;
        }
      }
    }

    // 3. Quiz Attempts: Student can submit attempts.
    if (path.startsWith('/api/quiz-attempts')) {
      if (method === 'POST') {
        if (userRole !== 'Student') {
          ctx.status = 403;
          ctx.body = { error: 'Only Students can submit quiz attempts.' };
          return;
        }
      }
    }

    // 4. User Course Progresses: Students can update progress.
    if (path.startsWith('/api/user-course-progresses')) {
      if (method === 'POST' || method === 'PUT') {
        if (userRole !== 'Student') {
          ctx.status = 403;
          ctx.body = { error: 'Only Students can update course progress.' };
          return;
        }
      }
    }

    // 5. Courses, Lessons, Quizzes
    if (path.startsWith('/api/courses') || path.startsWith('/api/lessons') || path.startsWith('/api/quizzes')) {
      if (method !== 'GET') {
        if (userRole === 'Student') {
          ctx.status = 403;
          ctx.body = { error: 'Students cannot modify courses, lessons, or quizzes.' };
          return;
        }

        if (userRole === 'Instructor') {
          // If editing a course, check ownership
          if (path.startsWith('/api/courses/')) {
            const parts = path.split('/');
            const courseId = parts[parts.length - 1];
            const course = await strapi.documents('api::course.course').findOne({ documentId: courseId });
            if (course && course.instructorId !== userId) {
              ctx.status = 403;
              ctx.body = { error: 'Instructors can only manage their own courses.' };
              return;
            }
          }
          // If creating a course, check that instructorId is themselves
          if (path.startsWith('/api/courses') && method === 'POST') {
            if (ctx.request.body && ctx.request.body.data && ctx.request.body.data.instructorId !== userId) {
              ctx.status = 403;
              ctx.body = { error: 'Instructors must assign themselves as the course instructor.' };
              return;
            }
          }
          // If modifying a lesson, check course instructorId
          if (path.startsWith('/api/lessons')) {
            if (method === 'POST') {
              const courseId = ctx.request.body?.data?.course;
              if (courseId) {
                const course = await strapi.documents('api::course.course').findOne({ documentId: courseId });
                if (course && course.instructorId !== userId) {
                  ctx.status = 403;
                  ctx.body = { error: 'Instructors can only add lessons to their own courses.' };
                  return;
                }
              }
            } else if (method === 'PUT' || method === 'DELETE') {
              const parts = path.split('/');
              const lessonId = parts[parts.length - 1];
              const lesson = await strapi.documents('api::lesson.lesson').findOne({
                documentId: lessonId,
                populate: ['course']
              });
              if (lesson && lesson.course && lesson.course.instructorId !== userId) {
                ctx.status = 403;
                ctx.body = { error: 'Instructors can only modify lessons in their own courses.' };
                return;
              }
            }
          }
          // If modifying a quiz, check course instructorId
          if (path.startsWith('/api/quizzes')) {
            if (method === 'POST') {
              const courseId = ctx.request.body?.data?.course;
              if (courseId) {
                const course = await strapi.documents('api::course.course').findOne({ documentId: courseId });
                if (course && course.instructorId !== userId) {
                  ctx.status = 403;
                  ctx.body = { error: 'Instructors can only add quizzes to their own courses.' };
                  return;
                }
              }
            } else if (method === 'PUT' || method === 'DELETE') {
              const parts = path.split('/');
              const quizId = parts[parts.length - 1];
              const quiz = await strapi.documents('api::quiz.quiz').findOne({
                documentId: quizId,
                populate: ['course']
              });
              if (quiz && quiz.course && quiz.course.instructorId !== userId) {
                ctx.status = 403;
                ctx.body = { error: 'Instructors can only modify quizzes in their own courses.' };
                return;
              }
            }
          }
        }
      }
    }

    return next();
  };
};
