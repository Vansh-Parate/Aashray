"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useListingContext } from "@/contexts/ListingContext";
import { ListingForm } from "@/components/warden/ListingForm";

export default function AddListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { refresh } = useListingContext();

  if (!user || user.role !== "warden") {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-text-muted">Only wardens can add listings.</p>
      </div>
    );
  }

  const onSuccess = () => {
    refresh();
    router.push("/warden/dashboard");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-accent text-2xl font-bold text-text-primary mb-8">Add listing</h1>
      <ListingForm wardenId={user.id} onSuccess={onSuccess} />
    </div>
  );
}
