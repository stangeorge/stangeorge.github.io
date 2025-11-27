import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 py-12">
        <div className="flex-shrink-0">
          <Image
            src="/stan.jpg"
            alt="Stan George"
            width={200}
            height={200}
            className="rounded-full"
            priority
          />
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Stan George</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Director of Software Engineering
          </p>
          <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
            Building scalable software systems and leading engineering teams.
            Creator of{' '}
            <a
              href="https://macrosia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              macrosia.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* Recent Work */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">
          Featured Project
        </h2>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
          <h3 className="text-xl font-semibold mb-2">
            <a
              href="https://macrosia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Macrosia
            </a>
          </h3>
          <p className="text-gray-700 dark:text-gray-400 mb-4">
            AI-powered nutrition tracking and analysis platform.
            Built with FastAPI, React, PostgreSQL, and deployed on Fly.io.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">FastAPI</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">React</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">PostgreSQL</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">Claude AI</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">Fly.io</span>
          </div>
        </div>
      </section>

      {/* Writing */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">
          Writing
        </h2>
        <div className="space-y-4">
          <Link
            href="/articles/building-a-repo-aware-coding-agent"
            className="block group"
          >
            <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
              November 2025 - Building a Repo-Aware Coding Agent
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              My experience building a &quot;Mini Claude Code&quot; from scratch
            </p>
          </Link>
          <Link
            href="/articles/tips-to-hire-a-software-engineer"
            className="block group"
          >
            <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
              December 2019 - Tips to Hire a Software Engineer
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Practical strategies for building your engineering team
            </p>
          </Link>
          <Link
            href="/articles/7-things-a-software-engineer-should-look-for-in-their-next-team"
            className="block group"
          >
            <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
              November 2019 - 7 Things a Software Engineer Should Look for in Their Next Team
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              What to prioritize when evaluating your next engineering role
            </p>
          </Link>
          <Link
            href="/articles/how-i-interview-a-software-engineer"
            className="block group"
          >
            <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
              October 2019 - How I Interview a Software Engineer
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              My approach to evaluating engineering candidates
            </p>
          </Link>
        </div>
      </section>

      {/* Reading */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">
          Reading
        </h2>
        <p className="text-gray-700 dark:text-gray-400">
          I enjoy reading science fiction and non-fiction. Some favorites include
          Isaac Asimov&apos;s Foundation series, Frank Herbert&apos;s Dune, and various works
          on software engineering and leadership.
        </p>
        <Link
          href="/reading"
          className="inline-block text-blue-600 dark:text-blue-400 hover:underline"
        >
          View reading list →
        </Link>
      </section>
    </div>
  )
}
