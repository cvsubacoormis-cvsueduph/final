"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { setStudentPassword } from "@/actions/student/setPassword";

export default function FirstTimeSignedInPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 8) return toast.error("Password too short.");
    if (password !== confirmPassword)
      return toast.error("Passwords don't match.");

    try {
      setLoading(true);
      await setStudentPassword(password);
      toast.success("Password set successfully!");
      router.push("/dashboard"); // or wherever you want to redirect
    } catch (err: any) {
      toast.error("Failed to set password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="input"
      />
      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Setting..." : "Set Password"}
      </button>
    </form>
  );
}
