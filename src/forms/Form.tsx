import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


//schema
const formSchema = z.object({
  title: z.string().min(1,"Title is required"),
  name: z.string().min(1,"Name is required"),
  age: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Age must be a valid positive number",
    }),
  email: z.string().email("Email must be a valid email"),
  phone: z
    .string()
    .regex(/^[0-9]+$/, "Correct phone number is required")
    .min(11, "Phone number must be at least 11 digits"),
});

// Define the TypeScript type from the Zod schema
type FormData = z.infer<typeof formSchema>;

function Form({onSubmit}: {onSubmit: (data: FormData) => void}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors  },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="flex flex-col gap-4 m-8">
      <b>Form</b>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-2">Title:</label>
          <input
            type="text"
            id="title"
            {...register("title")}
            className="p-1 border rounded-md text-black mb-2"
            placeholder="ex. (Mr.,Ms.)"
          />
          {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 mt-2">Name:</label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="p-1 border rounded-md text-black"
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="age" className="mb-2 mt-2">Age:</label>
          <input
            type="text"
            id="age"
            {...register("age")}
            className="p-1 border rounded-md text-black"
            placeholder="Enter your age"
          />
          {errors.age && <p className="text-red-500 text-xs">{errors.age.message}</p>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 mt-2">Email:</label>
          <input
            type="text"
            id="email"
            {...register("email")}
            className="p-1 border rounded-md text-black"
            placeholder="Enter your email"
          />

          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone" className="mb-2 mt-2">Phone:</label>
          <input
            type="text"
            id="phone"
            {...register("phone")}
            className="p-1 border rounded-md text-black"
            placeholder="(20)1234567891"
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
        </div>
        <button 
  type="submit" 
  className="bg-cyan-400 hover:bg-gray-400 text-white p-2 rounded-xl mt-4 duration-100 transform hover:scale-95">
  Submit
</button>


        
      </form>
    </div>
  );
}

export default Form