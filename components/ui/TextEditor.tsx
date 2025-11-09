'use client';

import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";

import { uploadImage } from "@/utils/helpers";

import 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model';
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin';

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to loa
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/wordcount';

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis';

// Content styles, including inline UI like fake cursors
import 'tinymce/skins/content/default/content';
import 'tinymce/skins/ui/oxide/content';

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const TextEditor = ({ value, onChange }: TextEditorProps) => {
    const editorRef = useRef<TinyMCEEditor | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleImage = async (blobInfo: any) => {
        try {
            const file = new File([blobInfo.blob()], blobInfo.filename(), { type: blobInfo.blob().type });
            console.log(file)
            const urls = await uploadImage([file]);
            console.log(urls)
            if (!urls?.[0]) throw new Error("No URL returned from upload");
            return urls[0];
        } catch (error) {
            console.error("TinyMCE image upload failed:", error);
            throw error;
        }
    };

    return (
        <Editor
            onInit={(_, editor) => {
                editorRef.current = editor;
                editor.setContent(value || "");
            }}
            licenseKey="gpl"
            onEditorChange={(content) => {
                requestAnimationFrame(() => onChange(content));
            }}
            init={{
                height: 500,
                // licenseKey: 'gpl',
                menubar: false,
                plugins:
                    'preview searchreplace autolink directionality code fullscreen image link media codesample table pagebreak anchor advlist lists wordcount help charmap quickbars emoticons',
                toolbar:
                    'undo redo | blocks fontsize | bold italic underline strikethrough forecolor backcolor removeformat | align numlist bullist lineheight outdent indent ltr rtl | link image media table | charmap emoticons | code fullscreen preview | print pagebreak anchor codesample searchreplace',
                toolbar_mode: 'wrap',
                content_style: "body { font-size:16px }",
                skin: 'oxide',
                content_css: 'default',
                images_upload_handler: handleImage,
                object_resizing: false,
                branding: false,
                promotion: false,
                // file_picker_callback(callback, value, meta) {}
            }}
        />
    );
};

export default TextEditor;