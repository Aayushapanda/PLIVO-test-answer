import Layout from "../components/Layout";
import FileUploader from "../components/FileUploader";
import { useState } from "react";

export default function ImagePage() {
  const [description, setDescription] = useState(null);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/image", {
      method: "POST",
      body: formData
    });
    setDescription(await res.json());
  };

  return (
    <Layout>
      <h2>Image Analysis</h2>
      <FileUploader onUpload={handleUpload} />
      {description && <pre>{JSON.stringify(description, null, 2)}</pre>}
    </Layout>
  );
}
