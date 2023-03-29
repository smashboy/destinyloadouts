import { useEffect, useRef } from "react";
import EditorJS, { type OutputData, type API } from "@editorjs/editorjs";

export type EditorState = OutputData;

interface EditorProps {
  initialState?: EditorState;
  onChange(val: EditorState): void;
  placeholder?: string;
}

const editorElementId = "editor";

const Editor: React.FC<EditorProps> = ({
  initialState,
  placeholder,
  onChange,
}) => {
  const editor = useRef<EditorJS>();

  const handleOnChange = async (api: API) => {
    const data = await api.saver.save();

    onChange(data);
  };

  useEffect(() => {
    if (!editor.current) {
      editor.current = new EditorJS({
        holder: editorElementId,
        data: initialState,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onChange: handleOnChange,
        placeholder,
      });
    }

    return () => {
      if (editor.current && editor.current.destroy) editor.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id={editorElementId} />;
};

export default Editor;
