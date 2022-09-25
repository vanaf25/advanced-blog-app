import React from 'react';
import EditorJS, {OutputBlockData} from '@editorjs/editorjs';
import {Box} from "@mui/system";
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Header from "@editorjs/header";
import ImageTool from '@editorjs/image';
interface EditorProps {
  onChange: (blocks: OutputBlockData[]) => void;
  defaultBlocks?:OutputBlockData[];
}
const EDITOR__TOOLS={
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
export const Editor: React.FC<EditorProps> = ({onChange, defaultBlocks}) => {
  React.useEffect(() => {
    const editor = new EditorJS({
      holder: 'editor',
      tools: EDITOR__TOOLS,
      data: {
        blocks: defaultBlocks
      },
      placeholder: 'Введите текст вашей статьи',
      async onChange() {
        const {blocks} = await editor.save();
        onChange(blocks)
      },
    });
    return () => {
      editor.isReady
          .then(() => {
            editor.destroy();
          })
          .catch((e) => console.error('ERROR editor cleanup', e));
    };
  }, []);

  return <Box   id="editor">

  </Box>;
};
