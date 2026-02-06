import LessonVideoRecommendations from "../components/LessonVideoRecommendations";

const LessonDetails = ({ lesson }: { lesson: any }) => {
    return (
        <div>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            <p className="mt-2">{lesson.description}</p>

            <div className="mt-4 mb-6">
                {lesson.videoUrl ? (
                    <>
                        {lesson.videoUrl.includes("youtube.com") || lesson.videoUrl.includes("youtu.be") ? (
                            <div className="aspect-w-16 aspect-h-9">
                                <iframe
                                    src={lesson.videoUrl.replace("watch?v=", "embed/")}
                                    title="Lesson Video"
                                    className="w-full h-[400px] rounded shadow-lg"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="p-6 bg-gray-100 rounded-lg text-center">
                                <a
                                    href={lesson.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-lg font-medium"
                                >
                                    Watch Lesson Video ↗
                                </a>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                            No video provided.
                        </h3>
                        <p className="text-blue-600 mb-4">Here are some recommended videos for this topic:</p>
                        <LessonVideoRecommendations lessonTitle={lesson.title} />
                    </div>
                )}
            </div>

            {lesson.videoUrl && <LessonVideoRecommendations lessonTitle={lesson.title} />}
        </div>
    );
};

export default LessonDetails;
