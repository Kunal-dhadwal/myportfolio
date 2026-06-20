require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const { Education, Skill, Certificate } = require('../models/index');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany(), Profile.deleteMany(), Project.deleteMany(),
      Experience.deleteMany(), Education.deleteMany(), Skill.deleteMany(), Certificate.deleteMany()
    ]);
    console.log('Cleared existing data');

    // Create admin user
    await User.create({
      name: 'Kunal Dhadwal',
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
    });
    console.log('Admin user created');

    // Create profile
    await Profile.create({
      name: 'Kunal Dhadwal',
      title: 'Full Stack Developer & AI Engineer',
      tagline: 'Building the future, one line of code at a time.',
      bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications and AI-powered solutions. I love turning complex problems into elegant, user-friendly experiences.',
      email: 'alex@portfolio.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      typingTexts: ['Full Stack Developer', 'AI Engineer', 'DevOps Enthusiast', 'Open Source Contributor'],
      socialLinks: {
        github: 'https://github.com/alexjohnson',
        linkedin: 'https://linkedin.com/in/alexjohnson',
        twitter: 'https://twitter.com/alexjohnson',
      },
      isAvailableForWork: true,
    });
    console.log('Profile created');

    // Create skills
    const skillsData = [
      { name: 'React.js', category: 'Frontend', proficiency: 95, color: '#61DAFB', order: 1 },
      { name: 'TypeScript', category: 'Frontend', proficiency: 90, color: '#3178C6', order: 2 },
      { name: 'Next.js', category: 'Frontend', proficiency: 88, color: '#000000', order: 3 },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 92, color: '#06B6D4', order: 4 },
      { name: 'Node.js', category: 'Backend', proficiency: 93, color: '#339933', order: 1 },
      { name: 'Express.js', category: 'Backend', proficiency: 90, color: '#000000', order: 2 },
      { name: 'Python', category: 'Backend', proficiency: 85, color: '#3776AB', order: 3 },
      { name: 'FastAPI', category: 'Backend', proficiency: 80, color: '#009688', order: 4 },
      { name: 'MongoDB', category: 'Database', proficiency: 88, color: '#47A248', order: 1 },
      { name: 'PostgreSQL', category: 'Database', proficiency: 82, color: '#336791', order: 2 },
      { name: 'Redis', category: 'Database', proficiency: 75, color: '#DC382D', order: 3 },
      { name: 'Docker', category: 'DevOps', proficiency: 85, color: '#2496ED', order: 1 },
      { name: 'Kubernetes', category: 'DevOps', proficiency: 78, color: '#326CE5', order: 2 },
      { name: 'AWS', category: 'DevOps', proficiency: 80, color: '#FF9900', order: 3 },
      { name: 'TensorFlow', category: 'AI/ML', proficiency: 75, color: '#FF6F00', order: 1 },
      { name: 'PyTorch', category: 'AI/ML', proficiency: 72, color: '#EE4C2C', order: 2 },
      { name: 'LangChain', category: 'AI/ML', proficiency: 80, color: '#1C3A5E', order: 3 },
    ];
    await Skill.insertMany(skillsData);
    console.log('Skills created');

    // Create education
    await Education.insertMany([
      {
        institution: 'Stanford University',
        degree: 'Master of Science',
        fieldOfStudy: 'Computer Science',
        grade: '3.9/4.0 GPA',
        location: 'Stanford, CA',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2020-06-01'),
        achievements: ['Dean\'s List', 'Research Assistant - AI Lab', 'Best Thesis Award'],
        order: 1,
      },
      {
        institution: 'UC Berkeley',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science & Mathematics',
        grade: '3.7/4.0 GPA',
        location: 'Berkeley, CA',
        startDate: new Date('2014-09-01'),
        endDate: new Date('2018-05-01'),
        achievements: ['Honors Program', 'ACM Chapter President', 'Hackathon Winner x3'],
        order: 2,
      },
    ]);
    console.log('Education created');

    // Create experiences
    await Experience.insertMany([
      {
        companyName: 'Google',
        jobRole: 'Senior Software Engineer',
        jobType: 'Full-time',
        location: 'Mountain View, CA',
        responsibilities: [
          'Led development of ML-powered search features serving 1B+ users',
          'Architected microservices reducing latency by 40%',
          'Mentored team of 5 junior engineers',
          'Contributed to open-source TensorFlow projects',
        ],
        achievements: ['Promoted to Senior in 18 months', 'Impact Award Q3 2023', 'Led 3 successful product launches'],
        technologiesUsed: ['Python', 'Go', 'TensorFlow', 'Kubernetes', 'BigQuery', 'React'],
        startDate: new Date('2021-03-01'),
        isCurrent: true,
        order: 1,
      },
      {
        companyName: 'Startup Labs',
        jobRole: 'Full Stack Engineer',
        jobType: 'Full-time',
        location: 'San Francisco, CA',
        responsibilities: [
          'Built and launched SaaS product from scratch to 10K users',
          'Designed MongoDB schema and REST APIs',
          'Implemented CI/CD pipeline with GitHub Actions',
        ],
        technologiesUsed: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS'],
        startDate: new Date('2020-07-01'),
        endDate: new Date('2021-02-28'),
        isCurrent: false,
        order: 2,
      },
    ]);
    console.log('Experiences created');

    // Create projects
    await Project.insertMany([
      {
        title: 'AI Chat Platform',
        description: 'A full-featured AI chat platform powered by LangChain and GPT-4, supporting multi-modal inputs, document analysis, and persistent conversation memory.',
        shortDescription: 'LangChain-powered multi-modal AI chat with document analysis',
        category: 'AI',
        images: [{ url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200', caption: 'Main interface' }],
        githubUrl: 'https://github.com/alexjohnson/ai-chat-platform',
        liveDemoUrl: 'https://ai-chat-demo.com',
        techStack: ['React', 'Python', 'FastAPI', 'LangChain', 'GPT-4', 'PostgreSQL', 'Redis'],
        timeline: { startDate: new Date('2023-01-01'), endDate: new Date('2023-06-01') },
        featured: true,
        order: 1,
      },
      {
        title: 'E-Commerce Microservices',
        description: 'Scalable e-commerce platform built with microservices architecture, featuring product catalog, cart, payments, and real-time notifications.',
        shortDescription: 'Microservices e-commerce with real-time notifications',
        category: 'Full Stack',
        images: [{ url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200', caption: 'Dashboard' }],
        githubUrl: 'https://github.com/alexjohnson/ecommerce-microservices',
        liveDemoUrl: 'https://ecommerce-demo.com',
        techStack: ['React', 'Node.js', 'Docker', 'Kubernetes', 'MongoDB', 'Stripe', 'Socket.io'],
        timeline: { startDate: new Date('2022-06-01'), endDate: new Date('2022-12-01') },
        featured: true,
        order: 2,
      },
      {
        title: 'K8s Auto-Scaler',
        description: 'Intelligent Kubernetes auto-scaling solution using ML to predict traffic patterns and pre-scale pods, reducing costs by 35%.',
        shortDescription: 'ML-powered Kubernetes intelligent auto-scaling',
        category: 'DevOps',
        images: [{ url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200', caption: 'K8s dashboard' }],
        githubUrl: 'https://github.com/alexjohnson/k8s-autoscaler',
        techStack: ['Python', 'Kubernetes', 'Prometheus', 'Grafana', 'scikit-learn', 'Helm'],
        timeline: { startDate: new Date('2023-07-01'), endDate: new Date('2023-10-01') },
        featured: false,
        order: 3,
      },
    ]);
    console.log('Projects created');

    // Create certificates
    await Certificate.insertMany([
      {
        name: 'AWS Certified Solutions Architect',
        organization: 'Amazon Web Services',
        credentialId: 'AWS-SAA-C03-123456',
        verificationUrl: 'https://aws.amazon.com/verification',
        issueDate: new Date('2023-01-15'),
        doesNotExpire: false,
        expiryDate: new Date('2026-01-15'),
        description: 'Professional-level AWS architecture certification',
        skills: ['AWS', 'Cloud Architecture', 'S3', 'EC2', 'Lambda'],
        order: 1,
      },
      {
        name: 'Google Cloud Professional Data Engineer',
        organization: 'Google',
        credentialId: 'GCP-PDE-789012',
        issueDate: new Date('2023-05-20'),
        doesNotExpire: false,
        description: 'Professional data engineering on Google Cloud Platform',
        skills: ['BigQuery', 'Dataflow', 'Pub/Sub', 'ML on GCP'],
        order: 2,
      },
    ]);
    console.log('Certificates created');

    console.log('\n✅ Database seeded successfully!');
    console.log(`Admin Email: ${process.env.ADMIN_EMAIL || 'admin@portfolio.com'}`);
    console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
