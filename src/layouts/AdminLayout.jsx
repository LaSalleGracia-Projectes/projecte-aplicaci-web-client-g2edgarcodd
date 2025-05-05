import React from "react";
import AdminSidebar from "../components/UI/AdminSidebar";
import "../styles/components/admin/variables.css";
import "../styles/components/admin/layout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="adminPanel-layout">
      <AdminSidebar />
      <main className="adminPanel-main-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
