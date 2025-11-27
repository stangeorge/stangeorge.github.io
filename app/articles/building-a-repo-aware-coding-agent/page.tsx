import Link from 'next/link'

export default function Article() {
  return (
    <article className="prose dark:prose-invert max-w-3xl mx-auto">
      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block">
        ← Back to home
      </Link>

      <h1>Building a Repo-Aware Coding Agent</h1>

      <p className="text-gray-600 dark:text-gray-400 text-lg italic">
        November 2025
      </p>

      <p>
        You see a lot of hype about &quot;autonomous coding agents&quot; these days. Devin, Claude Code, you name it.
        Everyone says they are the future of software engineering. I got curious. Is it really that complicated?
        Or is it just a glorified loop that calls an LLM?
      </p>

      <p>
        So I decided to build one from scratch. I used <a href="https://ampcode.com" className="text-blue-600 dark:text-blue-400 hover:underline">Amp</a> to
        help me code it (ironic, I know—using an agent to build an agent), but the architecture is straightforward.
        I call it &quot;Mini Claude Code&quot;.
      </p>

      <p>
        The full source code is available here: <a href="https://github.com/stangeorge/coding-agent-cli" className="text-blue-600 dark:text-blue-400 hover:underline">stangeorge/coding-agent-cli</a>.
        Feel free to fork it and break things.
      </p>

      <h2>The Stack</h2>

      <p>
        I didn&apos;t want to overcomplicate things. I stuck to what I know:
      </p>

      <ul>
        <li>Node.js & TypeScript (because types save lives)</li>
        <li>Vercel AI SDK (to talk to the LLMs)</li>
        <li>Anthropic&apos;s Claude 3.5 Sonnet (the brains)</li>
      </ul>

      <p>
        The whole thing is a CLI tool. You run <code>npm start -- &quot;Fix the bug in the user service&quot;</code> and it goes off to work.
      </p>

      <h2>How it actually works</h2>

      <p>
        It turns out, the &quot;magic&quot; is pretty simple. It&apos;s a loop.
      </p>

      <p>
        <strong>1. Plan:</strong> The agent looks at the history of what it has done so far and the user&apos;s task.
        It decides which tool to use next. &quot;I need to read the file to understand the bug.&quot;
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{`const systemPrompt = \`
You are an autonomous coding agent working on a local code repository.
You have a fixed set of tools available:

- readFile(path: string): read a text file from the repo.
- writeFile(path: string, content: string): overwrite or create a file.
- searchInRepo(query: string): search for files containing the text.
- runTests(command?: string): run tests in the repo (e.g. "npm test").

Constraints:
- Paths must be relative to the repo root.
- Prefer small, incremental edits and frequent test runs.
- Stop when the task is complete or you are stuck.
\`;`}</code>
      </pre>

      <p>
        <strong>2. Act:</strong> It executes the tool. I gave it a few basic ones: <code>readFile</code>, <code>writeFile</code>,
        <code>searchInRepo</code>, and <code>runTests</code>.
      </p>

      <p>
        <strong>3. Observe:</strong> It reads the output of the tool. &quot;Oh, the file says X.&quot;
      </p>

      <p>
        Then it goes back to step 1. It keeps doing this until it thinks it&apos;s done.
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{`// The main agent loop
for (let i = 0; i < config.maxSteps; i++) {
  // 1. Ask the planner what to do
  const decision = await callPlanner(task, steps);

  // 2. Handle "done"
  if (decision.type === 'done') {
    console.log("Agent finished:", decision.message);
    break;
  }

  // 3. Execute tool
  if (decision.type === 'tool') {
    const result = await tools[decision.tool](decision.input);
    steps.push({ tool: decision.tool, result });
  }
}`}</code>
      </pre>

      <h3>Safety First</h3>

      <p>
        I&apos;m not crazy enough to let an AI run wild on my machine. I built a sandbox.
        The agent can only read and write files inside a specific <code>sandbox/</code> directory.
        It can&apos;t access my system files or run dangerous shell commands.
        True story: I once saw an agent try to <code>rm -rf</code> a directory because it was &quot;cleaning up&quot;.
        Always sandbox your agents, folks.
      </p>

      <h2>The &quot;Whoa&quot; Moment</h2>

      <p>
        I was testing it with a simple task: &quot;Write a function that adds two numbers and a test for it.&quot;
      </p>

      <p>
        It wrote the function. Then it wrote the test. Then it ran the test. The test passed.
        It felt a bit like watching a junior engineer&apos;s first successful commit.
        Except it happened in about 30 seconds.
      </p>

      <p>
        Then I tried something harder. I gave it a file with a subtle bug and asked it to fix it.
        It used <code>searchInRepo</code> to find the file, read it, analyzed the logic, and wrote a patch.
        It even ran the tests afterwards to make sure it didn&apos;t break anything.
      </p>

      <h2>It&apos;s not all sunshine and rainbows</h2>

      <p>
        Sometimes it gets stuck. It reads a file, thinks &quot;I need to read this file again,&quot; and enters an infinite loop.
        I had to add a <code>maxSteps</code> config to kill it if it goes rogue.
      </p>

      <p>
        And context windows are real. If you feed it a massive repo, it forgets what it was doing 5 steps ago.
        But for small, focused tasks? It&apos;s surprisingly competent.
      </p>

      <p>
        I should clarify: this is just a toy project. Building a robust, production-grade agent is incredibly hard.
        Armin Ronacher wrote a great piece on this called <a href="https://lucumr.pocoo.org/2025/11/21/agents-are-hard/" className="text-blue-600 dark:text-blue-400 hover:underline">&quot;Agents are Hard&quot;</a>.
        Real agents need to handle ambiguity, undo mistakes, and navigate complex dependency graphs.
        My little CLI tool is just scratching the surface.
      </p>

      <h2>Conclusion</h2>

      <p>
        Building this stripped away a lot of the mystery for me.
        It&apos;s not magic. It&apos;s just clever prompting and a feedback loop.
      </p>

      <p>
        If you&apos;re a software engineer, I highly recommend trying to build one.
        You&apos;ll learn a ton about how these LLMs actually &quot;think&quot; (or don&apos;t think).
        Plus, it&apos;s pretty cool to have a CLI tool that can write its own tests.
      </p>

      <p>
        If you want to chat about agents or see the code, drop me a line.
      </p>

      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mt-8 inline-block">
        ← Back to home
      </Link>
    </article>
  )
}
