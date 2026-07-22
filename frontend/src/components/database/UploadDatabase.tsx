import { useRef, useState } from "react";
import { uploadDatabase } from "../../api/database";

interface UploadDatabaseProps {
  onUploadSuccess: () => void;
}

export default function UploadDatabase({
  onUploadSuccess,
}: UploadDatabaseProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      await uploadDatabase(file);

      setFileName(file.name);

      onUploadSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to upload database.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-3">
        Database
      </h2>

      <input
        ref={inputRef}
        type="file"
        accept=".db"
        className="hidden"
        onChange={handleUpload}
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {uploading ? "Uploading..." : "Upload SQLite Database"}
      </button>

      {fileName && (
        <div className="mt-3 rounded bg-gray-100 p-2 text-sm">
          <strong>Current Database:</strong>
          <br />
          {fileName}
        </div>
      )}
    </div>
  );
}