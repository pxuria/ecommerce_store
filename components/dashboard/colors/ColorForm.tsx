import { useState } from "react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import axiosInstance from "@/lib/axiosInstance";
import { ColorSchema, colorValues } from "@/utils/validations/color.schema";
import { IColor } from "@/types/model";

interface Props {
    item?: IColor;
    onClose: () => void;
    onUpdated?: () => void;
}

const ColorForm = ({ item, onClose, onUpdated }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<colorValues>({
        resolver: zodResolver(ColorSchema),
        defaultValues: {
            name: "",
            hex: ""
        },
    });

    const submitHandler = async (values: colorValues) => {
        if (!(await form.trigger())) {
            console.error("Validation failed:", form.formState.errors);
            return;
        }
        setLoading(true);
        try {
            const { data } = await axiosInstance.post("color", {
                name: values.name,
                hex: values.hex
            });
            console.log(data);
        } catch (error) {
            console.log(error);
        } finally {
            // form.reset();
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                className="flex items-start justify-center flex-wrap gap-4"
                onSubmit={form.handleSubmit(submitHandler)}
            >
                {/* color name Field */}
                <InputField
                    name="name"
                    label="نام رنگ"
                    control={form.control}
                    loading={loading}
                />

                {/* color hex Field */}
                <InputField
                    name="hex"
                    label="کد رنگی"
                    control={form.control}
                    loading={loading}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-secondary-500 text-white py-2 rounded-md w-full disabled:bg-secondary-400 disabled:cursor-not-allowed"
                >
                    {loading ? "در حال ارسال ..." : "افزودن رنگ"}
                </button>
            </form>
        </Form>
    );
};

export default ColorForm;
