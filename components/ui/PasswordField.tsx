"use client";

import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"
import { Input } from "./input"

interface Props<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    itemClass?: string;
    loading?: boolean;
}

const PasswordField = <T extends FieldValues>({ control, loading, name, itemClass, label = "رمز عبور" }: Props<T>) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPass = () => setShowPassword(!showPassword)

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={`${itemClass} w-full`}>
                    <FormLabel htmlFor={name} className="form_label">{label}</FormLabel>
                    <FormControl>
                        <div className="relative w-full">
                            <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                autoComplete="false"
                                placeholder="*****"
                                className="form_input"
                                disabled={loading}
                            />

                            <span
                                className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                onClick={toggleShowPass}
                            >
                                {showPassword ? <IoEyeOutline className="w-5 h-5 text-primary" /> : <IoEyeOffOutline className="w-5 h-5 text-primary" />}
                            </span>
                        </div>
                    </FormControl>
                    <FormMessage className="form_item_error" dir="rtl" />
                </FormItem>
            )}
        />
    )
}

export default PasswordField