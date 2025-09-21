'use client';
import Lottie from "lottie-react";

interface Props {
    text: string;
    itemClass?: string;
    file: unknown;
}

const LottieText = ({ text, file, itemClass = "w-44 h-44" }: Props) => {
    return (
        <div className="flex_center flex-col w-full">
            <Lottie animationData={file} loop={true} className={itemClass} />
            <p className="text-xl font-medium text-center">{text}</p>
        </div>
    )
}

export default LottieText