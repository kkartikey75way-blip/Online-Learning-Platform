import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../services/api";
import { courseSchema, CourseFormValues } from "../schemas/course.schema";

export default function CreateCourse() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 0,
      capacity: 50,
      dripEnabled: false,
    },
  });

  const onSubmit: SubmitHandler<CourseFormValues> = async (data) => {
    try {
      const res = await api.post("/courses", data);
      const courseId = res.data._id;

      await Swal.fire({
        icon: "success",
        title: "Course created 🎉",
        text: "Now add modules and lessons",
        confirmButtonColor: "#14b8a6",
      });

      navigate(`/instructor/course/${courseId}/builder`);
    } catch (error: unknown) {
      const message = error instanceof Error && (error as any).response?.data?.message
        ? (error as any).response.data.message
        : "Course creation failed";
      Swal.fire("Failed", message, "error");
    }
  };

  return (
    <section className="min-h-screen bg-[#f9f7f2]">
      <div className="max-w-3xl mx-auto px-8 py-14">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Create New Course</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-8 space-y-4">
          <div>
            <input
              placeholder="Course title"
              className={`w-full p-3 border rounded ${errors.title ? "border-red-500" : ""}`}
              {...register("title")}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <textarea
              placeholder="Course description"
              className={`w-full p-3 border rounded ${errors.description ? "border-red-500" : ""}`}
              rows={4}
              {...register("description")}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <input
              placeholder="Category (e.g. Web Development)"
              className={`w-full p-3 border rounded ${errors.category ? "border-red-500" : ""}`}
              {...register("category")}
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Price"
                className={`w-full p-3 border rounded ${errors.price ? "border-red-500" : ""}`}
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>

            <div className="flex-1">
              <input
                type="number"
                placeholder="Capacity"
                className={`w-full p-3 border rounded ${errors.capacity ? "border-red-500" : ""}`}
                {...register("capacity", { valueAsNumber: true })}
              />
              {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" {...register("dripEnabled")} />
            Enable drip content
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg cursor-pointer transition disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
    </section>
  );
}
