'use strict';

async function setPublicPermissions(newPermissions) {
  // Find the ID of the public role
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: {
      type: 'public',
    },
  });

  // Create the new permissions and link them to the public role
  const allPermissionsToCreate = [];
  Object.keys(newPermissions).map((controller) => {
    const actions = newPermissions[controller];
    const permissionsToCreate = actions.map((action) => {
      // Find and delete existing permission if it exists to avoid unique constraint errors
      return strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      });
    });
    allPermissionsToCreate.push(...permissionsToCreate);
  });
  await Promise.all(allPermissionsToCreate);
}

const INITIAL_USERS = [
  {
    id: 'user-admin',
    name: 'Alex Rivera',
    email: 'alex.admin@learnhub.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    enrolledCourseIds: [],
  },
  {
    id: 'user-cm',
    name: 'Sophia Chen',
    email: 'sophia.chen@learnhub.com',
    role: 'Content Manager',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    enrolledCourseIds: [],
  },
  {
    id: 'user-inst-1',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@learnhub.com',
    role: 'Instructor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    enrolledCourseIds: [],
  },
  {
    id: 'user-inst-2',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@learnhub.com',
    role: 'Instructor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    enrolledCourseIds: [],
  },
  {
    id: 'user-student-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@student.edu',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    enrolledCourseIds: ['course-1', 'course-2'],
  },
  {
    id: 'user-student-2',
    name: 'David Kim',
    email: 'david.kim@student.edu',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    enrolledCourseIds: ['course-1'],
  },
];

const INITIAL_COURSES = [
  {
    id: 'course-1',
    title: 'Full-Stack Next.js 14 & Strapi Masterclass',
    subtitle: 'Master modern serverless web development with Next.js App Router and Headless Strapi CMS.',
    description: 'A comprehensive step-by-step masterclass covering Next.js Server Components, Strapi REST & GraphQL APIs, Role-Based Access Control, JWT authentication, and Vercel & Railway cloud deployments.',
    category: 'Web Development',
    level: 'Intermediate',
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
    instructorId: 'user-inst-1',
    instructorName: 'Dr. Marcus Vance',
    price: 89.99,
    published: true,
    lessons: [
      {
        id: 'c1-l1',
        title: '1. Course Orientation & Architecture Overview',
        durationMinutes: 12,
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: `### Welcome to Full-Stack Next.js 14 & Strapi Masterclass!\n\nIn this introductory module, we will explore:\n- High-level architecture of Next.js 14 App Router\n- Decoupled Headless CMS paradigm with Strapi\n- Setting up state management and role permissions\n- End-to-end deployment target architecture on Vercel & Railway`,
        order: 1,
      },
      {
        id: 'c1-l2',
        title: '2. Next.js App Router & Server Components',
        durationMinutes: 25,
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: `### Deep Dive into React Server Components (RSC)\n\nServer Components allow developers to render UI on the server, significantly improving performance, reducing client bundle size, and enhancing SEO.\n\n#### Key Takeaways:\n1. Difference between Client Components (\`'use client'\`) and Server Components.\n2. Data fetching paradigms with \`fetch()\` caching options (\`revalidate\`, \`no-store\`).\n3. Parallel and Intercepting routes for complex dashboards.`,
        order: 2,
      },
      {
        id: 'c1-l3',
        title: '3. Strapi CMS Setup & Role-Based Access Control',
        durationMinutes: 30,
        type: 'text',
        content: `### Configuring Strapi Roles & Permissions\n\nStrapi provides built-in RBAC capabilities. In this module, we configure four primary roles:\n\n1. **Admin**: Full backend administration.\n2. **Content Manager**: Access to Content Manager plugin for editing entries.\n3. **Instructor**: Access to course management endpoints.\n4. **Student**: Authenticated user with read-only access to enrolled content and submission privileges.\n\n#### Security Best Practices:\n- Always enforce JWT validation on API middleware.\n- Never trust client-side role claims; sanitize requests on Strapi controllers.`,
        order: 3,
      },
      {
        id: 'c1-l4',
        title: '4. Building the Sequential Progress Tracker',
        durationMinutes: 20,
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: `### Progress Calculation Algorithm\n\nProgress for a course is dynamically computed using:\n\`\`\`ts\nconst completionPercentage = (completedLessonsCount / totalLessonsCount) * 100;\n\`\`\`\nThis progress is persisted per student per course in the backend database and synchronized across sessions.`,
        order: 4,
      },
      {
        id: 'c1-l5',
        title: '5. Production Deployment on Vercel & Railway',
        durationMinutes: 18,
        type: 'text',
        content: `### Continuous Integration & Cloud Deployment\n\n- **Vercel**: Deploy Frontend Next.js app with zero configuration, linking Git commits to automatic previews.\n- **Railway**: Deploy Strapi Node.js instance paired with PostgreSQL database.\n- **Environment Variables**: Manage \`NEXT_PUBLIC_STRAPI_URL\`, \`STRAPI_API_TOKEN\`, and JWT secrets.`,
        order: 5,
      },
    ],
    quiz: {
      id: 'quiz-c1',
      title: 'Next.js 14 & Strapi Architecture Assessment',
      description: 'Test your understanding of Next.js Server Components, Strapi RBAC, and progress logic.',
      passingScore: 75,
      questions: [
        {
          id: 'q1',
          question: 'Which statement accurately describes React Server Components in Next.js App Router?',
          options: [
            { id: 'opt1', text: 'They execute strictly on the browser client during initial hydration.' },
            { id: 'opt2', text: 'They execute on the server and send pre-rendered HTML/RSC payload to the client without adding to bundle size.' },
            { id: 'opt3', text: 'They require the "use client" directive at the top of the file.' },
            { id: 'opt4', text: 'They cannot fetch data from external APIs.' },
          ],
          correctOptionId: 'opt2',
          explanation: 'Server components execute exclusively on the server, generating zero client JavaScript bundle impact.',
        },
        {
          id: 'q2',
          question: 'Where should Role-Based Access Control (RBAC) permissions be strictly enforced?',
          options: [
            { id: 'opt1', text: 'Only on the frontend by hiding buttons.' },
            { id: 'opt2', text: 'In CSS rules using display: none.' },
            { id: 'opt3', text: 'On the backend server/API controllers, validating token roles before executing operations.' },
            { id: 'opt4', text: 'In browser localStorage.' },
          ],
          correctOptionId: 'opt3',
          explanation: 'Security requires backend validation on API endpoints so unauthorized users cannot bypass UI restrictions.',
        },
        {
          id: 'q3',
          question: 'If a course has 5 lessons and a student completes 3 lessons, what is their progress percentage?',
          options: [
            { id: 'opt1', text: '40%' },
            { id: 'opt2', text: '50%' },
            { id: 'opt3', text: '60%' },
            { id: 'opt4', text: '75%' },
          ],
          correctOptionId: 'opt3',
          explanation: '(3 / 5) * 100 = 60% completion rate.',
        },
      ],
    },
  },
  {
    id: 'course-2',
    title: 'Advanced UI/UX & Motion Design for Web Systems',
    subtitle: 'Craft breathtaking digital experiences using CSS Glassmorphism, Tailwind, and Micro-interactions.',
    description: 'Learn modern design system fundamentals, color harmony, typography hierarchy, micro-animations, accessible contrast ratios, and responsive dashboard layouts.',
    category: 'Design & UI/UX',
    level: 'Beginner',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    instructorId: 'user-inst-2',
    instructorName: 'Sarah Jenkins',
    price: 69.99,
    published: true,
    lessons: [
      {
        id: 'c2-l1',
        title: '1. Glassmorphism & Modern Aesthetic Tokens',
        durationMinutes: 15,
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: `### Glassmorphism CSS Fundamentals\n\n\`\`\`css\n.glass-panel {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(16px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);\n}\n\`\`\`\n\nGlassmorphism provides depth and high aesthetic visual visual quality when paired with subtle gradients.`,
        order: 1,
      },
      {
        id: 'c2-l2',
        title: '2. Dynamic Animations & Micro-Interactions',
        durationMinutes: 22,
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: `### Enhancing User Engagement with Motion\n\nMicro-interactions inform users of state changes (e.g. button click states, completion checkmarks, toast alerts) without distracting from the main task.`,
        order: 2,
      },
      {
        id: 'c2-l3',
        title: '3. Accessibility & WCAG Compliance',
        durationMinutes: 18,
        type: 'text',
        content: `### Designing Accessible Dashboards\n\n- Maintain contrast ratio of at least 4.5:1 for normal text.\n- Ensure keyboard focus outlines are clear.\n- Provide descriptive ARIA labels for interactive icons.`,
        order: 3,
      },
    ],
    quiz: {
      id: 'quiz-c2',
      title: 'UI/UX Principles Checkup',
      description: 'Test your understanding of glassmorphism and accessibility standards.',
      passingScore: 66,
      questions: [
        {
          id: 'q2-1',
          question: 'Which CSS property creates the frosted glass effect in Glassmorphism?',
          options: [
            { id: 'op1', text: 'filter: drop-shadow()' },
            { id: 'op2', text: 'backdrop-filter: blur()' },
            { id: 'op3', text: 'mix-blend-mode: overlay' },
            { id: 'op4', text: 'transform: perspective()' },
          ],
          correctOptionId: 'op2',
          explanation: 'backdrop-filter: blur() applies a blur effect to the background content behind the element.',
        },
        {
          id: 'q2-2',
          question: 'What is the recommended WCAG AA minimum contrast ratio for normal text?',
          options: [
            { id: 'op1', text: '2:1' },
            { id: 'op2', text: '3:1' },
            { id: 'op3', text: '4.5:1' },
            { id: 'op4', text: '7:1' },
          ],
          correctOptionId: 'op3',
          explanation: 'WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text.',
        },
      ],
    },
  },
  {
    id: 'course-3',
    title: 'Cloud Architecture & Microservices with Railway & Docker',
    subtitle: 'Deploy scalable backend services, databases, and microservices with high reliability.',
    description: 'Learn continuous deployment pipelines, environment configuration, database management, microservice communication, and monitoring.',
    category: 'DevOps & Cloud',
    level: 'Advanced',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    instructorId: 'user-inst-1',
    instructorName: 'Dr. Marcus Vance',
    price: 99.99,
    published: true,
    lessons: [
      {
        id: 'c3-l1',
        title: '1. Dockerizing Strapi & PostgreSQL Services',
        durationMinutes: 28,
        type: 'text',
        content: `### Docker Setup for Production\n\nContainerizing backend applications ensures consistency across development, staging, and production environments.`,
        order: 1,
      },
    ],
  },
];

const INITIAL_PROGRESS = [
  {
    userId: 'user-student-1',
    courseId: 'course-1',
    completedLessonIds: ['c1-l1', 'c1-l2'],
    lastAccessedLessonId: 'c1-l3',
  },
  {
    userId: 'user-student-1',
    courseId: 'course-2',
    completedLessonIds: ['c2-l1'],
    lastAccessedLessonId: 'c2-l2',
  },
  {
    userId: 'user-student-2',
    courseId: 'course-1',
    completedLessonIds: ['c1-l1'],
    lastAccessedLessonId: 'c1-l2',
  },
];

const INITIAL_BLOG_POSTS = [
  {
    id: 'blog-1',
    title: 'Why Next.js 14 App Router & Headless Strapi is the Ultimate Stack',
    excerpt: 'Explore how combining Next.js Server Components with Strapi CMS accelerates development speed while delivering top-tier performance.',
    content: `Modern web development demands speed, security, and exceptional user experiences. The combination of Next.js 14 App Router and Strapi Headless CMS provides an unbeatable architecture for modern applications.\n\n### 1. Server-Side Rendering & Instant Hydration\nWith React Server Components, initial page renders happen directly on the server, sending pre-rendered markup to the browser. This results in ultra-fast Largest Contentful Paint (LCP) scores and superior SEO.\n\n### 2. Flexible Content Modeling\nStrapi allows non-technical content managers to quickly structure content models without touching backend databases directly.\n\n### 3. Decoupled Role-Based Security\nBy enforcing authentication tokens and strict role policies on the Strapi API level, applications maintain bulletproof data integrity across all roles.`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    authorId: 'user-cm',
    authorName: 'Sophia Chen',
    authorRole: 'Content Manager',
    status: 'Published',
    publishedAt: '2026-08-20T09:00:00Z',
    tags: ['Architecture', 'Next.js', 'Strapi'],
  },
  {
    id: 'blog-2',
    title: 'Designing Intuitive Micro-interactions for E-Learning Interfaces',
    excerpt: 'Small animation details, progress rings, and feedback modals double student retention and course completion rates.',
    content: `User interface feedback is crucial in educational platforms. When students mark a lesson complete or receive immediate quiz feedback, visual rewards keep them motivated.\n\n### Micro-feedback Techniques:\n- **Instant Confetti on Quiz Pass**: Celebrating achievements triggers dopamine and reinforces learning.\n- **Progress Ring Recalculation**: Smooth SVG stroke-dashoffset transitions provide tactile visual progress.\n- **Role Permission Indicators**: Clear badge indicators reassure users of their current system authority.`,
    coverImage: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80',
    authorId: 'user-admin',
    authorName: 'Alex Rivera',
    authorRole: 'Admin',
    status: 'Published',
    publishedAt: '2026-08-22T11:30:00Z',
    tags: ['UI/UX', 'Design', 'EdTech'],
  },
  {
    id: 'blog-3',
    title: '[Draft] Future Roadmap: AI-Powered Adaptive Quiz Generation',
    excerpt: 'Draft article exploring AI automated question generation based on video lesson transcripts.',
    content: `This is a draft blog post under review by the Content Management team. \n\nIn upcoming releases, instructors will be able to click "Generate Quiz" to automatically digest lesson transcripts and produce high-quality multiple choice assessments.`,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    authorId: 'user-cm',
    authorName: 'Sophia Chen',
    authorRole: 'Content Manager',
    status: 'Draft',
    tags: ['Draft', 'AI', 'Roadmap'],
  },
];

const INITIAL_QUIZ_ATTEMPTS = [
  {
    id: 'qa-1',
    quizId: 'quiz-c1',
    studentId: 'user-student-1',
    scorePercentage: 100,
    passed: true,
    answers: {
      q1: 'opt2',
      q2: 'opt3',
      q3: 'opt3',
    },
    completedAt: '2026-08-25T15:00:00Z',
  },
];

async function seedLMSApp() {
  console.log('Seeding LMS database...');

  // Set public permissions for API endpoints so our custom middleware handles authorization
  await setPublicPermissions({
    course: ['find', 'findOne', 'create', 'update', 'delete'],
    lesson: ['find', 'findOne', 'create', 'update', 'delete'],
    quiz: ['find', 'findOne', 'create', 'update', 'delete'],
    'blog-post': ['find', 'findOne', 'create', 'update', 'delete'],
    'quiz-attempt': ['find', 'findOne', 'create', 'update', 'delete'],
    'user-course-progress': ['find', 'findOne', 'create', 'update', 'delete'],
    'lms-user': ['find', 'findOne', 'create', 'update', 'delete', 'login', 'register', 'me'],
  });

  // Clear existing tables
  console.log('Clearing old database records...');
  try {
    await strapi.db.query('api::lms-user.lms-user').deleteMany({ where: {} });
  } catch(e) {}
  try {
    await strapi.db.query('api::lesson.lesson').deleteMany({ where: {} });
  } catch(e) {}
  try {
    await strapi.db.query('api::quiz.quiz').deleteMany({ where: {} });
  } catch(e) {}
  try {
    await strapi.db.query('api::course.course').deleteMany({ where: {} });
  } catch(e) {}
  try {
    await strapi.db.query('api::blog-post.blog-post').deleteMany({ where: {} });
  } catch(e) {}
  try {
    await strapi.db.query('api::quiz-attempt.quiz-attempt').deleteMany({ where: {} });
  } catch(e) {}
  try {
    await strapi.db.query('api::user-course-progress.user-course-progress').deleteMany({ where: {} });
  } catch(e) {}

  const bcrypt = require('bcryptjs');
  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Seed users
  console.log('Seeding LMS Users...');
  for (const u of INITIAL_USERS) {
    await strapi.documents('api::lms-user.lms-user').create({
      data: {
        documentId: u.id,
        name: u.name,
        email: u.email,
        password: defaultPasswordHash,
        role: u.role,
        avatar: u.avatar,
        enrolledCourseIds: u.enrolledCourseIds,
      },
    });
  }

  // 2. Seed courses & lessons & quizzes
  console.log('Seeding Courses, Lessons, and Quizzes...');
  for (const c of INITIAL_COURSES) {
    const courseDoc = await strapi.documents('api::course.course').create({
      data: {
        documentId: c.id,
        title: c.title,
        subtitle: c.subtitle,
        description: c.description,
        category: c.category,
        level: c.level,
        coverImage: c.coverImage,
        instructorId: c.instructorId,
        instructorName: c.instructorName,
        price: c.price,
        published: c.published,
      },
    });

    // Seed lessons
    if (c.lessons && c.lessons.length > 0) {
      for (const l of c.lessons) {
        await strapi.documents('api::lesson.lesson').create({
          data: {
            documentId: l.id,
            title: l.title,
            durationMinutes: l.durationMinutes,
            type: l.type,
            videoUrl: l.videoUrl,
            content: l.content,
            order: l.order,
            course: courseDoc.documentId,
          },
        });
      }
    }

    // Seed quiz
    if (c.quiz) {
      await strapi.documents('api::quiz.quiz').create({
        data: {
          documentId: c.quiz.id,
          title: c.quiz.title,
          description: c.quiz.description,
          passingScore: c.quiz.passingScore,
          questions: c.quiz.questions,
          course: courseDoc.documentId,
        },
      });
    }
  }

  // 3. Seed blog posts
  console.log('Seeding Blog Posts...');
  for (const b of INITIAL_BLOG_POSTS) {
    await strapi.documents('api::blog-post.blog-post').create({
      data: {
        documentId: b.id,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        coverImage: b.coverImage,
        authorId: b.authorId,
        authorName: b.authorName,
        authorRole: b.authorRole,
        status: b.status,
        publishedAt: b.publishedAt || (b.status === 'Published' ? new Date().toISOString() : null),
        tags: b.tags,
      },
    });
  }

  // 4. Seed user course progress
  console.log('Seeding Course Progresses...');
  for (const p of INITIAL_PROGRESS) {
    await strapi.documents('api::user-course-progress.user-course-progress').create({
      data: {
        userId: p.userId,
        courseId: p.courseId,
        completedLessonIds: p.completedLessonIds,
        lastAccessedLessonId: p.lastAccessedLessonId,
      },
    });
  }

  // 5. Seed quiz attempts
  console.log('Seeding Quiz Attempts...');
  for (const qa of INITIAL_QUIZ_ATTEMPTS) {
    await strapi.documents('api::quiz-attempt.quiz-attempt').create({
      data: {
        documentId: qa.id,
        quizId: qa.quizId,
        studentId: qa.studentId,
        scorePercentage: qa.scorePercentage,
        passed: qa.passed,
        answers: qa.answers,
        completedAt: qa.completedAt,
      },
    });
  }

  console.log('LMS Database seeding completed successfully.');
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  try {
    await seedLMSApp();
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.destroy();
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
