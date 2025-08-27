import React, { useState, useEffect } from "react";
import { Menu, Dropdown } from "antd";

/**
 * RightClickRow
 * Wraps a <tr> and allows a right-click menu
 * @param {Array} menuItems - AntD Menu items [{ label, key }]
 * @param {Function} onMenuClick - Callback when menu item clicked
 * @param {React.ReactNode} children - Table row content (<td>...</td>)
 */
const RightClickRow = ({ menuItems, onMenuClick, children }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent default browser menu
    setPosition({ x: e.clientX, y: e.clientY });
    setVisible(true);
  };

  const handleMenuClick = ({ key }) => {
    onMenuClick(key);
    setVisible(false);
  };

  const handleClickOutside = () => setVisible(false);

  useEffect(() => {
    if (visible) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }
    return () => window.removeEventListener("click", handleClickOutside);
  }, [visible]);

  const menu = <Menu items={menuItems} onClick={handleMenuClick} />;

  return (
    <tr onContextMenu={handleContextMenu}>
      {children}

      {visible && (
        <div
          style={{
            position: "fixed",
            top: position.y,
            left: position.x,
            zIndex: 9999,
          }}
        >
          <Dropdown overlay={menu} trigger={[]}>
            <div />
          </Dropdown>
        </div>
      )}
    </tr>
  );
};

export default RightClickRow;
