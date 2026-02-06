import React from "react";

interface CertificateTemplateProps {
    studentName: string;
    courseTitle: string;
    date: string;
    credentialId: string;
}

const CertificateTemplate = React.forwardRef<HTMLDivElement, CertificateTemplateProps>(
    ({ studentName, courseTitle, date, credentialId }, ref) => {
        return (
            <div
                ref={ref}
                className="w-[800px] h-[600px] bg-white border-[16px] border-double border-indigo-900 p-12 flex flex-col items-center justify-between text-center relative overflow-hidden"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                {/* Background Decoration */}
                <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-indigo-50 rounded-full opacity-50" />
                <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-teal-50 rounded-full opacity-50" />

                <div className="z-10 w-full flex flex-col items-center gap-6">
                    <div className="text-teal-600 font-bold tracking-widest text-sm uppercase">Certificate of Completion</div>

                    <div className="w-16 h-1 bg-indigo-200" />

                    <div className="text-gray-500 text-lg">This is to certify that</div>

                    <div className="text-4xl font-serif font-bold text-indigo-900 border-b-2 border-gray-100 pb-2 px-8 min-w-[300px]">
                        {studentName}
                    </div>

                    <div className="text-gray-500 text-lg">has successfully completed the course</div>

                    <div className="text-3xl font-bold text-gray-800 italic">
                        "{courseTitle}"
                    </div>
                </div>

                <div className="z-10 w-full flex justify-between items-end mt-12 px-12">
                    <div className="flex flex-col items-center">
                        <div className="w-32 border-b border-gray-400 mb-2" />
                        <div className="text-[10px] text-gray-400 uppercase tracking-tighter">Instructor Signature</div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="text-indigo-900 font-bold text-xl mb-1">Inter.</div>

                    </div>

                    <div className="flex flex-col text-right">
                        <div className="text-sm font-medium text-gray-700">Issued on {date}</div>
                        <div className="text-[10px] text-gray-400">ID: {credentialId}</div>
                    </div>
                </div>
            </div>
        );
    }
);

CertificateTemplate.displayName = "CertificateTemplate";

export default CertificateTemplate;
