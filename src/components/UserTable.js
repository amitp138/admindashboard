// UserTable.js
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdDoneOutline } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import "../App.css";

const UserTable = ({
  users,
  selectedRows,
  onRowSelect,
  onEdit,
  onDelete,
  handleSelectAll,
}) => {
  const [editableRow, setEditableRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  const handleEditClick = (id, data) => {
    setEditableRow(id);
    setEditedData(data);
  };

  const handleSaveClick = (id) => {
    onEdit(id, editedData);
    setEditableRow(null);
    setEditedData({});
  };

  const handleCancelClick = () => {
    setEditableRow(null);
    setEditedData({});
  };

  const handleEditInputChange = (field, value) => {
    setEditedData((prevData) => ({ ...prevData, [field]: value }));
  };

  return (
    <table>
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={selectedRows.length === users.length && users.length > 0}
              onChange={() => handleSelectAll()}
            />
          </th>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            style={{
              background: selectedRows.includes(user.id)
                ? "#ccc"
                : "transparent",
            }}
          >
            <td>
              <input
                type="checkbox"
                checked={selectedRows.includes(user.id)}
                onChange={() => onRowSelect(user.id)}
              />
            </td>
            <td>{user.id}</td>
            <td>
              {editableRow === user.id ? (
                <input
                  type="text"
                  value={editedData.name || user.name}
                  onChange={(e) =>
                    handleEditInputChange("name", e.target.value)
                  }
                />
              ) : (
                user.name
              )}
            </td>
            <td>
              {editableRow === user.id ? (
                <input
                  type="text"
                  value={editedData.email || user.email}
                  onChange={(e) =>
                    handleEditInputChange("email", e.target.value)
                  }
                />
              ) : (
                user.email
              )}
            </td>
            <td>
              {editableRow === user.id ? (
                <input
                  type="text"
                  value={editedData.role || user.role}
                  onChange={(e) =>
                    handleEditInputChange("role", e.target.value)
                  }
                />
              ) : (
                user.role
              )}
            </td>
            <td>
              {editableRow === user.id ? (
                <>
                  <button
                    onClick={() => handleSaveClick(user.id)}
                    className="save"
                  >
                    <MdDoneOutline />
                  </button>
                  <button onClick={handleCancelClick} className="cancel">
                    <ImCancelCircle />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditClick(user.id, user)}
                    className="edit"
                  >
                    <FaEdit />
                  </button>
                  <button onClick={() => onDelete(user.id)} className="delete">
                    <FaTrash />
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
