"use client";

import { ReactNode } from "react";
import { Button } from "./button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./dialog";

interface Props {
    title: string;
    onOkText: string;
    loadingText?: string;
    loading?: boolean;
    onOkClass?: string;
    onCancelClass?: string;
    onCancelText?: string;
    content: ReactNode;
    onOk: () => void;
    onCancel: () => void;
    isDialogOpen: boolean;
    setIsDialogOpen: (val: boolean) => void;

}

const ConfirmBox = ({ title, content, loading = false, loadingText = "در حال بارگذاری...", onOk, onCancel, onOkClass, onCancelClass, onOkText, onCancelText = "انصراف", isDialogOpen, setIsDialogOpen }: Props) => {
    return <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-white text-right text-base md:text-xl">{title}</DialogTitle>
            </DialogHeader>
            {content}
            <DialogFooter className="mt-4 flex items-center gap-4 w-full">
                <Button
                    onClick={onOk}
                    disabled={loading}
                    variant="destructive"
                    className={`w-[calc(50%-16px)] text-sm md:text-base bg-red ${onOkClass}`}
                >
                    {loading ? loadingText : onOkText}
                </Button>

                <DialogClose asChild>
                    <Button
                        onClick={onCancel}
                        className={`w-[calc(50%-16px)] text-sm md:text-base bg-lightPurple text-white hover:bg-purple_800 ${onCancelClass}`}>{onCancelText}</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}

export default ConfirmBox