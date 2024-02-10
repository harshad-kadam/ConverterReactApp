import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

// import './Tooltip.css';

const TooltipWrapper = ({ icon, action, text }) => {
  const [tooltipText, setTooltipText] = useState('');

  const tooltip = (
    <Tooltip id="tooltip">
      {tooltipText}
    </Tooltip>
  );

  const handleIconHover = () => {
    setTooltipText(text);
  };

  const handleIconLeave = () => {
    setTooltipText('');
  };

  return (
    <OverlayTrigger
      placement="left"
      overlay={tooltip}
    >
      <div onClick={action} onMouseEnter={handleIconHover} onMouseLeave={handleIconLeave}>
        {icon}
      </div>
    </OverlayTrigger>
  );
};

export default TooltipWrapper;
