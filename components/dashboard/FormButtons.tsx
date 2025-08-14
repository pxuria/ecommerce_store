interface Props {
    loading: boolean;
    submitTitle: string;
    onClose?: () => void;
}

const FormButtons = ({ loading, onClose, submitTitle }: Props) => {
    return (
        <div className="flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap flex-1">
            <button
                type="submit"
                disabled={loading}
                className="bg-secondary-500 text-white py-2 rounded-md w-full lg:w-[calc(50%-16px)] disabled:bg-secondary-400 disabled:cursor-not-allowed"
            >
                {loading ? "در حال ارسال ..." : submitTitle}
            </button>
            <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="bg-red-700 text-white py-2 rounded-md w-full lg:w-[calc(50%-16px)] disabled:bg-red-400 disabled:cursor-not-allowed"
            >
                انصراف
            </button>
        </div>
    )
}

export default FormButtons