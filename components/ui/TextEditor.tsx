import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor, BlobInfo } from "tinymce";
import { uploadImage } from "@/utils/helpers";

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const TextEditor = ({ value, onChange }: TextEditorProps) => {
    const editorRef = useRef<TinyMCEEditor | null>(null);

    // useEffect(() => {
    //     if (editorRef.current && value !== editorRef.current.getContent()) {
    //         editorRef.current.setContent(value || "");
    //     }
    // }, [value]);


    const handleImage = async (blobInfo: BlobInfo) => {
        try {
            // const file = blobInfo.blob();
            // const url = await uploadImage(file);

            const file = new File([blobInfo.blob()], blobInfo.filename(), { type: blobInfo.blob().type });
            const url = await uploadImage(file);
            if (!url) throw new Error("No URL returned from upload");

            return url;
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            console.error("TinyMCE image upload failed:", message);
            throw error;
        }
    };

    return (
        <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API}
            onInit={(_evt, editor) => editorRef.current = editor}
            value={value}
            initialValue="<p>This is the initial content of the editor.</p>"
            onEditorChange={(content) => onChange(content)}
            init={{
                height: 500,
                menubar: false,
                plugins: [
                    "advlist autolink lists link image charmap preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table help wordcount",
                ],
                toolbar:
                    "undo redo | blocks | bold italic forecolor | " +
                    "alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist outdent indent | removeformat | image | help",
                content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                images_upload_handler: handleImage
            }}
        />
    );
};

export default TextEditor;
