import Layout from "../components/Layout";
import FileUploader from "../components/FileUploader";
import { useState } from "react";

export default function Conversation() {
  const [result, setResult] = useState(null);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("audio", file);

    const res = await fetch("/api/conversation", {
      method: "POST",
      body: formData
    });
    setResult(await res.json());
  };

  return (
    <Layout>
      <h2>Conversation Analysis</h2>
      <FileUploader onUpload={handleUpload} />
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </Layout>
  );
}
