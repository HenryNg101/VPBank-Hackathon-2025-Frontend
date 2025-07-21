export default function FileUploadPanel() {
  return (
    <div className="text-sm text-gray-700">
      <h2 className="text-lg font-semibold mb-2">Upload Files</h2>
      <p className="mb-2">(Upload logic will go here.)</p>
      <input type="file" className="block" multiple />
    </div>
  );
}