import Layout from "../components/Layout";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <h1>Playground Groq Next.js App</h1>
      <p>Select a skill to try:</p>
      <ul>
        <li><Link href="/conversation">Conversation Analysis</Link></li>
        <li><Link href="/image">Image Analysis</Link></li>
        <li><Link href="/document">Document/URL Summarization</Link></li>
      </ul>
    </Layout>
  );
}
