export default function FileUploader({ onUpload }) {
  return (
    <input
      type="file"
      onChange={(e) => {
        if (e.target.files.length > 0) {
          onUpload(e.target.files[0]);
        }
      }}
    />
  );
}
