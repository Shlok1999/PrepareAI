import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases } from '../appwrite/appwriteConfig'; // Import configured Appwrite client
import './InfoForm.css';

function InfoForm({ isOpen, onClose }) {
  const databaseId = process.env.REACT_APP_DATABASE_ID;
  const collectionId = process.env.REACT_APP_COLLECTION_ID;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle loading
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit function to Appwrite
  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading when the form is submitted

    try {
      const response = await databases.createDocument(
        databaseId, // Replace with your actual Database ID
        collectionId, // Replace with your actual Collection ID
        'unique()', // Generate unique document ID
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        }
      );
      navigate('/test');
    } catch (error) {
      console.error('Error submitting the form:', error);
    } finally {
      setIsSubmitting(false); // Stop loading after the form submission is complete
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-heading">Fill in your details</h2>
        <form onSubmit={submitForm}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InfoForm;
