import Modal from "react-modal";
import { FaCheckCircle } from "react-icons/fa";

Modal.setAppElement("#root");

function SuccessModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-3xl shadow-2xl p-10 w-[420px] mx-auto mt-32 outline-none relative"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-gray-400 hover:text-black text-2xl"
      >
        ×
      </button>

      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="bg-blue-100 p-5 rounded-full">
          <FaCheckCircle
            size={55}
            className="text-blue-600"
          />
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-center mb-3">
        Success!
      </h2>

      <p className="text-gray-600 text-center mb-8">
        Your lead has been submitted successfully.
        <br />
        Our sales team will contact you shortly.
      </p>

      <button
        onClick={onClose}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
      >
        Close
      </button>
    </Modal>
  );
}

export default SuccessModal;