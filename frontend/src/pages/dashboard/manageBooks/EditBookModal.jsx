import React, { useState } from "react";
import { useUpdateBookMutation, useCreateBookMutation } from "../../../redux/AdminApi";

const EditBookModal = ({ book = {}, mode = "edit", onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    isbn: "",
    original_publication_year: "",
    ...book,
  });

  const [updateBook] = useUpdateBookMutation();
  const [createBook] = useCreateBookMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "edit") {
        const updates = Object.keys(formData).reduce((acc, key) => {
          if (formData[key] !== book[key]) {
            acc[key] = formData[key];
          }
          return acc;
        }, {});

        if (Object.keys(updates).length > 0) {
          updates.book_id = book.book_id; // Include the book_id for update
          await updateBook(updates).unwrap();
          alert("Book updated successfully!");
          onSave(updates); // Pass updates to parent component
        } else {
          alert("No changes were made.");
        }
      } else if (mode === "create") {
        await createBook(formData).unwrap();
        alert("Book created successfully!");
        onSave(formData); // Pass new book data to parent component
      }

      onClose();
    } catch (error) {
      alert(`Failed to ${mode === "edit" ? "update" : "create"} book.`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{mode === "edit" ? "Edit Book" : "Add New Book"}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Authors:
              <input
                type="text"
                name="authors"
                value={formData.authors}
                onChange={handleChange}
              />
            </label>
            <label>
              ISBN:
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
              />
            </label>
            <label>
              Publication Year:
              <input
                type="number"
                name="original_publication_year"
                value={formData.original_publication_year}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-button">
              {mode === "edit" ? "Save" : "Add Book"}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;
