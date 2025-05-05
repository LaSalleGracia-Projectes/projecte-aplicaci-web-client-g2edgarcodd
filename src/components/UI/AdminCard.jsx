import React from "react";
import PropTypes from "prop-types";
import "../../styles/components/admin/variables.css";
import "../../styles/components/admin/cards.css";

const AdminCard = ({ title, value, icon, trend, trendType }) => {
  return (
    <div className="adminPanel-realtime-stat">
      <div className="adminPanel-card-icon">
        <i className={icon}></i>
      </div>
      <h3 className="adminPanel-realtime-stat-label">{title}</h3>
      <p className="adminPanel-realtime-stat-value">{value}</p>
      {trend && (
        <div className={`adminPanel-realtime-stat-trend ${trendType}`}>
          <i
            className={
              trendType === "up" ? "fas fa-arrow-up" : "fas fa-arrow-down"
            }
          ></i>
          {trend}
        </div>
      )}
    </div>
  );
};

AdminCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  trend: PropTypes.string,
  trendType: PropTypes.oneOf(["up", "down"]),
};

export default AdminCard;
