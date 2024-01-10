import { Form, Input } from "antd";
const ImageUpload = ({ setImageFile }: any) => {
  return (
    <>
      <Form.Item
        name={"imageBase64"}
        rules={[{ required: true, message: "Photo required" }]}
      >
        <Input
          type="file"
          onChange={(e) => {
            setImageFile(e.target.files?.[0]);
          }}
        />
      </Form.Item>
    </>
  );
};

export default ImageUpload;
