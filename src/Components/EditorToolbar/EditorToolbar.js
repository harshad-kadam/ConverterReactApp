// EditorToolbar.js
import React from 'react';
import { FaCompress, FaWrench, FaFile, FaDownload, FaTrash, FaCopy, FaExpand, FaFileUpload } from 'react-icons/fa';

import './EditorToolbar.css';

const EditorToolbar = ({ onBeautify, onCompress, onSampleJSON, onOpenFile, onDownloadJSON, onClear, onCopy, onResizeWindow }) => {
  return (
    <div className="editor-toolbar">
      <div onClick={onBeautify}>
        <FaWrench />
        <span>Beautify</span>
      </div>
      <div onClick={onCompress}>
        <FaCompress />
        <span>Compress</span>
      </div>
      <div onClick={onSampleJSON}>
        <FaFile />
        <span>Sample JSON</span>
      </div>
      <div onClick={onOpenFile}>
        <FaFileUpload />
        <span>Open File</span>
      </div>
      <div onClick={onDownloadJSON}>
        <FaDownload />
        <span>Download JSON</span>
      </div>
      <div onClick={onClear}>
        <FaTrash />
        <span>Clear</span>
      </div>
      <div onClick={onCopy}>
        <FaCopy />
        <span>Copy</span>
      </div>
      <div onClick={onResizeWindow}>
        <FaExpand />
        <span>Resize Window</span>
      </div>
    </div>
  );
};

export default EditorToolbar;
