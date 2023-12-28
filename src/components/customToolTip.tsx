import React, { useState } from 'react';
// import './CustomTooltip.css'; // Add your custom styles here

const CustomTooltip = ({ text }:{text:string}) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);

    const showTooltip = () => setTooltipVisible(true);
    const hideTooltip = () => setTooltipVisible(false);

    return (
        <div className="custom-tooltip-container" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
            <div className="info-icon">ℹ️</div>
            {isTooltipVisible && <div className="custom-tooltip">{text}</div>}
        </div>
    );
};

export default CustomTooltip;
