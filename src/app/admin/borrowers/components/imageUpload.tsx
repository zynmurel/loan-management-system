import { Form, Input } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDB } from "~/app/_utils/firebase/firebaseupload";
import { v4 } from "uuid"
const ImageUpload = ({ imageUrl, setImageUrl, imageFile, setImageFile, form }: any) => {
    const handleUpload = () => {
        if (imageFile !== null) {
            const imageRef = ref(imageDB, `loanManagementSystem/${v4()}`)
            uploadBytes(imageRef, imageFile).then((val) => {
                getDownloadURL(val.ref).then((url) => {
                    console.log(url)
                })
            })
        }
    }
    return (
        <>
            <Form.Item name={"imageBase64"} rules={[{ required: true, message: "Photo required" }]}>
                <Input type="file" onChange={(e) => { setImageFile(e.target.files?.[0]) }} />
            </Form.Item>
            <button type="button" onClick={handleUpload}>Uploadsample</button>
        </>
    );
}

export default ImageUpload;