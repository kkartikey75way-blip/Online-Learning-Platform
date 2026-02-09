import * as z from "zod";

export const courseSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    category: z.string().min(1, "Category is required"),
    price: z.number().min(0, "Price cannot be negative"),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    dripEnabled: z.boolean(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
