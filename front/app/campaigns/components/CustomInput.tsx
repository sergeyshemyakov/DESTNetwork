// components/CustomFileInput.tsx
import { useRef } from "react";
import { Button, Input } from "@nextui-org/react";

interface CustomFileInputProps {
  onFileChange: (file: File | null) => void;
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({ onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileChange(event.target.files[0]);
    } else {
      onFileChange(null);
    }
  };

  return (
    <div>
      <Button onClick={handleButtonClick}>Upload Photo</Button>
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
