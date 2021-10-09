import React from "react";
import Masonry from "react-masonry-css";
import { AdminPassword, ControlMode, Reset, TeamPasswords, CommandTable } from "./components";

function Admin() {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };
  return (
    <div className="admin-page">
      <h2 className="mb-5">팀포크봇({window.__group__.toUpperCase()}) 관리자페이지</h2>
      <div className="cards">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
            <AdminPassword />
            <TeamPasswords />
            <ControlMode />
            <Reset />
        </Masonry>
        <CommandTable />
      </div>
    </div>
  )
}

export default Admin;