import { WaitingApproval } from "@/components/WaitingForApproval";
import React from "react";

export default function PendingApprovalPage() {
  return (
    <div>
      <WaitingApproval
        user={{ id: "", email: "", name: "", status: "", hasPassword: false }}
        onLogout={() => {}}
      />
    </div>
  );
}
