import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Header from "@editorjs/header";
import ImageTool from '@editorjs/image';
export const EDITOR__TOOLS={
    list: {
        class: List,
        inlineToolbar: true,
        config: {
            defaultStyle: 'unordered'
        }
    },
    embed: {
        class: Embed,
        config: {
            youtube:true,
            instagram:true,
            facebook:true,
            coub: true
        }
    },
    header: Header,
    image: {
        class: ImageTool,
        config: {
            endpoints: {
                byFile: 'http://localhost:5000/posts/image', // Your backend file uploader endpoint
                byUrl: 'http://localhost:5000/posts/images/', // Your endpoint that provides uploading by Url
            },
        }
    },
}
