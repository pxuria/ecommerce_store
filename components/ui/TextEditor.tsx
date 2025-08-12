import { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import type { EditorEvent } from "@tinymce/tinymce-react/lib/cjs/main/ts/TinyMCE";
import { uploadImage } from "@/utils/helpers";

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const TextEditor = ({ value, onChange }: TextEditorProps) => {
    const editorRef = useRef<TinyMCEEditor | null>(null);

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.getContent()) {
            editorRef.current.setContent(value || "");
        }
    }, [value]);

    return (
        <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API}
            onInit={(evt: EditorEvent<"init">, editor: TinyMCEEditor) =>
                (editorRef.current = editor)
            }
            initialValue="<p>This is the initial content of the editor.</p>"
            value={value}
            onEditorChange={onChange}
            init={{
                height: 500,
                menubar: false,
                plugins: [
                    "advlist autolink lists link image charmap preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table code help wordcount",
                ],
                // plugins: [
                //   "advlist autolink lists link image charmap preview anchor",
                //   "autolink",
                //   "lists",
                //   "link",
                //   "image",
                //   "charmap",
                //   "preview",
                //   "anchor",
                //   "searchreplace",
                //   "visualblocks",
                //   "code",
                //   "fullscreen",
                //   "insertdatetime",
                //   "media",
                //   "table",
                //   "code",
                //   "help",
                //   "wordcount",
                // ],
                toolbar:
                    "undo redo | blocks | bold italic forecolor | " +
                    "alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist outdent indent | removeformat | image | help",
                // toolbar:
                //   "undo redo | blocks | image" +
                //   "bold italic forecolor | alignleft aligncenter image" +
                //   "alignright alignjustify | bullist numlist outdent indent | " +
                //   "removeformat | help",
                content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                images_upload_handler: async (
                    blobInfo,
                    success,
                    failure,
                    _progress
                ) => {
                    try {
                        const file = blobInfo.blob();
                        const url = await uploadImage(file);
                        if (!url) throw new Error("No URL returned from upload");
                        success(url);
                    } catch (error) {
                        console.error("TinyMCE image upload failed:", error);
                        failure("Image upload failed: " + error.message);
                    }
                },
            }}
        />
    );
};

export default TextEditor;
