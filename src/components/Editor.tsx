import { useEffect, useRef } from "react";
import EditorJS, { type OutputData, type API } from "@editorjs/editorjs";

export type EditorState = OutputData;

interface EditorProps {
  initialState?: EditorState;
  onChange?: (val: EditorState) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const editorElementId = "editor";

const Editor: React.FC<EditorProps> = ({
  initialState,
  placeholder,
  readOnly = false,
  onChange,
}) => {
  const editor = useRef<EditorJS>();

  const handleOnChange = async (api: API) => {
    if (onChange) {
      const data = await api.saver.save();
      onChange(data);
    }
  };

  useEffect(() => {
    if (!editor.current) {
      editor.current = new EditorJS({
        holder: editorElementId,
        data: initialState,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onChange: handleOnChange,
        placeholder,
        readOnly,
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
