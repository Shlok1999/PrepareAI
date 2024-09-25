import React, {useState} from 'react'
import InfoForm from '../Component/InfoForm';
import '../Style/Homepage.css'

function Homepage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="main-container">
            <div className="content-container">
                <div className="text-container">
                    <h1 className="heading">Welcome to PrepareAI</h1>
                    <p className="subheading">Sharpen your mind with the toughest questions designed for your success.</p>
                    <button className="get-started-button" onClick={openModal}>Get Started</button>
                </div>
                <div className="animation-container">
                    {/* The animated gradient section */}
                </div>
            </div>
            <InfoForm isOpen={isModalOpen} onClose={closeModal} /> {/* Modal rendering */}

        </div>
    )
}

export default Homepage