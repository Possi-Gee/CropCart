
"use client";

import { CropForm } from "@/components/farmer/CropForm";
import { useRouter } from "next/navigation";

export default function AddListingPage() {
    const router = useRouter();

    const handleFinished = () => {
        router.push("/farmer/listings");
    }

    return (
        <div>
             <h1 className="text-3xl font-bold font-headline mb-6">Create a New Listing</h1>
             <CropForm crop={null} onFinished={handleFinished} />
        </div>
    )
}
