import React from "react";
import ListItem from "./ListItem";
import { useLanguage } from "../../contexts/LanguageContext";

function ListsView({ lists, onRemoveList }) {
  const { t } = useLanguage();

  if (!lists || lists.length === 0) {
    return (
      <div className="empty-lists">
        <div className="empty-content">
          <i className="far fa-list-alt empty-icon"></i>
          <h3>{t("lists.noListsCreated")}</h3>
          <p>{t("lists.createListsDescription")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lists-grid">
      {lists.map((list) => (
        <ListItem key={list.id} list={list} onRemoveList={onRemoveList} />
      ))}
    </div>
  );
}

export default ListsView;
