import Link from "next/link";
import "../styles/globals.css";

export default function Layout({ children }) {
  return (
    <div>
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link href="/">Home</Link> |{" "}
        <Link href="/conversation">Conversation</Link> |{" "}
        <Link href="/image">Image</Link> |{" "}
        <Link href="/document">Document</Link>
      </nav>
      <main style={{ padding: "20px" }}>{children}</main>
    </div>
  );
}
