import TextField from "@mui/material/TextField";
import * as yup from "yup";
import { useFormik } from "formik";
import { VARIANT } from "@/global/Snackbar";
import { useSnackbar } from "notistack";
import produce from "immer";
import UserAPI from "@/api/userAPI";

const Register = ({ flip, setFlipped }) => {

    const validationSchema = yup.object({
        name: yup.string().required("You must enter your name"),
        register_email: yup.string().email().required("you must enter your email"),
        register_password: yup.string()
            .required("You must enter a password")
            .min(8, "Your Password must be at least 8 characters"),
        confirm_password: yup.string()
            .oneOf([yup.ref("register_password"), null], "Passwords must match"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            register_email: "",
            register_password: "",
            confirm_password: "",
        },
        onSubmit: async (values) => {
            const api = new UserAPI();
            const payload = produce(values, draft => {
                draft.email = values["register_email"];
                draft.password = values["register_password"];
                delete draft.register_email;
                delete draft.register_password;
            });
            const response = await api.userAuth("/register", payload);
            if (response) return handlePopup("Successfully Registered!", VARIANT.SUCCESS);
            else return handlePopup("Error! Registration failed! Check your credentials", VARIANT.ERROR);
        },
        validationSchema: validationSchema,
    });

    const { enqueueSnackbar } = useSnackbar();

    const handlePopup = (message, variant) => {
        enqueueSnackbar(message, {
            variant: variant,
        });
    };

    return (
        <>
            <form className="container mx-auto py-8 absolute [-webkit-backface-visibility:hidden] [backface-visibility:hidden] w-full rounded bg-zinc-100 -top-16"
                onSubmit={formik.handleSubmit} autoComplete="on">
                <div className="w-full px-8 py-4 text-xl text-center text-black border-b border-grey-lighter">Register for a free account</div>
                <div className="px-8 py-4">
                    <div className="flex flex-col mb-4 space-y-5 md:flex-row md:space-x-5 md:space-y-0">
                        <div className="w-full">
                            <TextField
                                label="Register Name"
                                id="name"
                                name="name"
                                size="large"
                                variant="outlined"
                                placeholder="Enter Name"
                                fullWidth
                                type="text"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onKeyPress={e => { e.which === 13 && e.preventDefault(); }}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                onBlur={formik.handleBlur}
                                autoComplete="on"
                            />
                        </div>
                        <div className="w-full">
                            <TextField
                                label="Register Email"
                                id="register_email"
                                name="register_email"
                                size="large"
                                variant="outlined"
                                placeholder="Enter Email"
                                fullWidth
                                type="email"
                                value={formik.values.register_email}
                                onChange={formik.handleChange}
                                onKeyPress={e => { e.which === 13 && e.preventDefault(); }}
                                error={formik.touched.register_email && Boolean(formik.errors.register_email)}
                                helperText={formik.touched.register_email && formik.errors.register_email}
                                onBlur={formik.handleBlur}
                                autoComplete="on"
                            />
                        </div>
                    </div>
                    <div className="w-full mb-4">
                        <TextField
                            label="Register Password"
                            id="register_password"
                            name="register_password"
                            size="large"
                            variant="outlined"
                            placeholder="Enter Password"
                            fullWidth
                            type="password"
                            value={formik.values.register_password}
                            onChange={formik.handleChange}
                            onKeyPress={e => { e.which === 13 && e.preventDefault(); }}
                            error={formik.touched.register_password && Boolean(formik.errors.register_password)}
                            helperText={formik.touched.register_password && formik.errors.register_password}
                            onBlur={formik.handleBlur}
                            autoComplete="on"
                        />
                    </div>
                    <div className="w-full mb-4">
                        <TextField
                            label="Confirm Password"
                            id="confirm_password"
                            name="confirm_password"
                            size="large"
                            variant="outlined"
                            placeholder="Confirm Password"
                            fullWidth
                            type="password"
                            value={formik.values.confirm_password}
                            onChange={formik.handleChange}
                            onKeyPress={e => { e.which === 13 && e.preventDefault(); }}
                            error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
                            helperText={formik.touched.confirm_password && formik.errors.confirm_password}
                            onBlur={formik.handleBlur}
                            autoComplete="on"
                        />
                    </div>
                    <div className="grid text-center place-items-center">
                        <button className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white transition duration-300 bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-roboto" type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Sign Up
                        </button>
                    </div>
                </div>
                <p className="p-4 my-4 text-center">
                    <button className="text-sm no-underline transition duration-200 text-grey-dark text-slate-800 hover:text-indigo-600"
                        onClick={() => setFlipped(!flip)} type="button">
                    I already have an account
                    </button>
                </p>
            </form>
        </>
    );
};

export default Register;
