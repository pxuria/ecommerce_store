import { motion } from "framer-motion";

interface Props {
  size?: "small" | "medium" | "large";
  color?: "primary" | "white" | "black";
}

const LoadingSpinner = ({ size = "medium", color = "primary" }: Props) => {
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const colorClasses = {
    primary: "border-primary",
    white: "border-white",
    black: "border-black",
  };

  return (
    <div className="relative">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full ${colorClasses[color]} border-t-transparent`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <span className="sr-only">در حال بارگذاری...</span>
    </div>
  );
};

export default LoadingSpinner;
