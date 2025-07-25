import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';

const blogPosts = [
  {
    slug: 'how-to-set-weekly-focus-with-ai-generated-plans',
    title: 'How to Set Weekly Focus with AI-Generated Plans',
    excerpt: 'Discover how to leverage artificial intelligence to create laser-focused weekly plans that align with your long-term goals. Stop guessing, start achieving.',
    category: 'Productivity',
    date: 'July 4, 2025',
    readTime: '6 min read',
    image: 'A person at a desk using a laptop with charts and graphs on the screen'
  },
  {
    slug: 'the-roi-of-smart-scheduling',
    title: 'The ROI of Smart Scheduling: More Than Just Time Saved',
    excerpt: 'We break down the real return on investment from using a smart scheduler. It’s not just about saving time—it’s about gaining clarity, reducing stress, and hitting your targets faster.',
    category: 'Time Management',
    date: 'July 2, 2025',
    readTime: '8 min read',
    image: 'A close-up of a calendar with events and tasks scheduled'
  },
];

const BlogPage = () => {
  return (
    <>
      <Helmet>
        <title>Blog - SmartPlan</title>
        <meta name="description" content="Explore articles on productivity, time management, and goal setting from the SmartPlan team." />
      </Helmet>
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              The SmartPlan Blog
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Insights on productivity, planning, and achieving your goals with a little help from AI.
            </p>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-2">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col rounded-lg shadow-lg overflow-hidden card-hover"
              >
                <div className="flex-shrink-0">
                  <img  class="h-64 w-full object-cover" alt={post.title} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                </div>
                <div className="flex-1 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {post.category}
                    </p>
                    <Link to={`/blog/${post.slug}`} className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">{post.title}</p>
                      <p className="mt-3 text-base text-gray-500 dark:text-gray-400">{post.excerpt}</p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <time dateTime={post.date}>{post.date}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-semibold flex items-center">
                      Read more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default BlogPage;