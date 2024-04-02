import * as z from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    username: z.string().min(1, {
      message: "Username is required",
    }),
    password: z
      .string()
      .nonempty({
        message: "Password is required",
      })
      .min(6, {
        message: "Password should be longer than 6 letters",
      })
      .refine((password) => /%.*\$|\$.*%/.test(password), {
        message: "Password has to contain % and $",
      }),
    confirm: z.string().min(1, {
      message: "Password confirm is required",
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Password confirm doesn't match",
    path: ["confirm"],
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
