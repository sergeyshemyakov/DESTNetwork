import { useRef, useState } from "react";
import { Button, Input } from "@nextui-org/react";

interface CustomFileInputProps {
  onFileChange: (file: File | null) => void;
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({ onFileChange }) => {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileChange(event.target.files[0]);
      setFileName(event.target.files[0].name);
    } else {
      onFileChange(null);
    }
  };

  return (
    <div
      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer border-default-200 hover:border-default-400"
      onClick={handleButtonClick}
    >
      <label htmlFor="file-upload" className="cursor-pointer">
        <div>
          {!!fileName ? (
            <p className="text-sm mb-2">{fileName}</p>
          ) : (
            <p className="text-sm text-gray-500 mb-2">
              Click here to upload your photo
            </p>
          )}

          <Button
            variant="bordered"
            color="primary"
            onClick={handleButtonClick}
          >
            {fileName ? "Change file" : "Browse files"}
          </Button>
        </div>
      </label>
      <div className="hidden">
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default CustomFileInput;
