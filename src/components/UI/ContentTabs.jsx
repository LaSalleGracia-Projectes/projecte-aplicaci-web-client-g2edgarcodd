import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/components/ui.css";

/**
 * Componente de pestañas para organizar contenido
 */
const ContentTabs = ({
  tabs,
  defaultActiveTab,
  className = "",
  tabClassName = "",
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={`content-tabs-container ${className}`}>
      <div className="content-tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`content-tab-button ${tabClassName} ${
              activeTab === tab.id ? "active" : ""
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon && <i className={tab.icon}></i>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="content-tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div className="content-tabs-body">{activeContent}</div>
    </div>
  );
};

ContentTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  defaultActiveTab: PropTypes.string,
  className: PropTypes.string,
  tabClassName: PropTypes.string,
};

export default ContentTabs;
