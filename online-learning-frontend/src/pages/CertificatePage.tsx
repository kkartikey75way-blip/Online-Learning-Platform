import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CertificatePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [certificate, setCertificate] = useState<any>(null);

  useEffect(() => {
    if (!courseId) return;

    api
      .get(`/certificates/${courseId}`)
      .then((res) => setCertificate(res.data))
      .catch(() => setCertificate(null));
  }, [courseId]);

  if (!certificate) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-600">
          Complete the course to unlock certificate
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 bg-[#f9f7f2] min-h-screen text-center">
      <h1 className="text-3xl font-bold text-indigo-900 mb-4">
        🎓 Certificate of Completion
      </h1>

      <p className="mb-6 text-gray-600">
        You have successfully completed this course
      </p>

      <a
        href={certificate.downloadUrl}
        target="_blank"
        className="inline-block bg-teal-500 text-white px-6 py-3 rounded cursor-pointer"
        rel="noreferrer"
      >
        Download Certificate
      </a>
    </div>
  );
}
