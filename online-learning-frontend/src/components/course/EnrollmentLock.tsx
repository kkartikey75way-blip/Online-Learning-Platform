import React from "react";
import { HiOutlineLockClosed, HiOutlineCheckCircle } from "react-icons/hi2";

interface EnrollmentLockProps {
    onEnroll: () => void;
}

export const EnrollmentLock: React.FC<EnrollmentLockProps> = ({ onEnroll }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 text-white max-w-lg">
            <div className="bg-teal-500 p-6 rounded-full bg-opacity-20 mb-6">
                <HiOutlineLockClosed className="text-teal-400 w-16 h-16" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Course Content Locked</h2>
            <p className="text-gray-400 mb-8">
                Enroll in this course to access videos, modules, and track your progress toward a certificate.
            </p>
            <button
                onClick={onEnroll}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
                Enroll Now <HiOutlineCheckCircle />
            </button>
        </div>
    );
};
