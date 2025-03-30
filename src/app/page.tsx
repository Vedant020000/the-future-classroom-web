import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGradientOverlay} />
        <div className={styles.heroBgImage} />

        {/* Animated Particles or Grid (visual effect) */}
        <div className={styles.particlesGrid}>
          <div className={styles.gridContainer}>
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className={styles.gridItem}>
                {Math.random() > 0.92 && (
                  <div className={styles.gridDot} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.flexRow}>
            <div className={styles.halfColumn}>
              <h1 className={styles.title}>
                <span className={styles.gradientText}>The Future Classroom</span>
                <br />AI-Powered Education
              </h1>
              <p className={styles.subtitle}>
                Empowering K-12 teachers to harness the transformative power of artificial intelligence in education.
              </p>
              <div className={styles.buttonGroup}>
                <Link href="/ai-access" className={styles.primaryButton}>
                  Try Our AI Tools
                </Link>
                <Link href="/community" className={styles.secondaryButton}>
                  Join Community
                </Link>
              </div>
            </div>
            <div className={styles.halfColumn}>
              <div className={styles.demoContainer}>
                <div className={styles.demoGlowEffect} />
                <div className={styles.demoBorder} />
                <div className={styles.demoContent}>
                  {/* This would be a placeholder for a video or interactive demo */}
                  <div className={styles.demoPlaceholder}>
                    <span className={styles.demoText}>AI Classroom Demo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.gradientText}>Transforming Education</span>
            </h2>
            <p className={styles.sectionDescription}>
              Our platform offers tools and resources designed to simplify lesson planning and enhance classroom management.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <span className={styles.featureIconText}>{feature.icon}</span>
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.gradientText}>How It Works</span>
            </h2>
            <p className={styles.sectionDescription}>
              Get started in just a few simple steps and transform your classroom experience.
            </p>
          </div>

          <div className={styles.stepsContainer}>
            <div className={styles.stepsLine} />
            <div className={styles.stepsGrid}>
              {steps.map((step, index) => (
                <div key={index} className={styles.stepItem}>
                  <div className={styles.stepIcon}>
                    <span className={styles.stepNumber}>
                      {index + 1}
                    </span>
                    <span className={styles.stepIconText}>{step.icon}</span>
                  </div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.gradientText}>Teacher Testimonials</span>
            </h2>
            <p className={styles.sectionDescription}>
              See what educators are saying about The Future Classroom.
            </p>
          </div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <div className={styles.testimonialHeader}>
                  <div className={styles.testimonialAvatar}>
                    <span className={styles.testimonialInitial}>{testimonial.initial}</span>
                  </div>
                  <div>
                    <h4 className={styles.testimonialName}>{testimonial.name}</h4>
                    <p className={styles.testimonialRole}>{testimonial.role}</p>
                  </div>
                </div>
                <p className={styles.testimonialQuote}>"{testimonial.quote}"</p>
                <div className={styles.testimonialStars}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={styles.star} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${styles.section} ${styles.ctaSection}`}>
        <div className={styles.ctaBackground} />
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to Transform Your Classroom?
            </h2>
            <p className={styles.ctaDescription}>
              Join thousands of teachers already using The Future Classroom to enhance their teaching experience.
            </p>
            <div className={styles.buttonGroup}>
              <Link href="/ai-access" className={styles.primaryButton}>
                Try AI Tools Now
              </Link>
              <Link href="/community" className={styles.secondaryButton}>
                Explore Community
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Data
const features = [
  {
    icon: '🔍',
    title: 'AI Lesson Planning',
    description: 'Create personalized lesson plans in minutes with our AI-powered system that adapts to your teaching style and curriculum.',
  },
  {
    icon: '📝',
    title: 'Smart Assessment',
    description: 'Generate quizzes, assignments, and assessments automatically, with intelligent grading and student progress tracking.',
  },
  {
    icon: '👥',
    title: 'Collaborative Community',
    description: 'Connect with educators worldwide to share resources, experiences, and best practices for AI integration in the classroom.',
  },
];

const steps = [
  {
    icon: '📋',
    title: 'Create Account',
    description: 'Sign up for free and set up your teacher profile with your preferences and teaching style.',
  },
  {
    icon: '🔧',
    title: 'Customize Tools',
    description: 'Personalize your AI tools to match your curriculum needs and classroom dynamics.',
  },
  {
    icon: '🚀',
    title: 'Generate Content',
    description: 'Use AI to create lesson plans, assignments, and assessments in seconds.',
  },
  {
    icon: '🌟',
    title: 'Engage & Improve',
    description: 'Implement in your classroom and gather feedback to continuously enhance learning outcomes.',
  },
];

const testimonials = [
  {
    initial: 'S',
    name: 'Sarah Johnson',
    role: 'Middle School Science Teacher',
    quote: 'The AI tools have saved me countless hours of preparation time, allowing me to focus more on individual student needs.',
  },
  {
    initial: 'M',
    name: 'Michael Rodriguez',
    role: 'High School Math Teacher',
    quote: 'The personalized assessment generation is incredible. My students are more engaged, and I can track their progress easily.',
  },
  {
    initial: 'L',
    name: 'Lisa Chen',
    role: 'Elementary School Teacher',
    quote: 'The community support has transformed how I teach. I\'ve found so many innovative ideas from fellow educators.',
  },
];
