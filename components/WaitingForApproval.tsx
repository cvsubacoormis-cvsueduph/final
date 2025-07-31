"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, LogOut, Mail, CheckCircle } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  status: string;
  hasPassword: boolean;
}

interface WaitingApprovalProps {
  user: User;
  onLogout: () => void;
}

export function WaitingApproval({ user, onLogout }: WaitingApprovalProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Waiting for Approval
          </CardTitle>
          <CardDescription>
            Your account is pending admin approval
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">
                Password created successfully
              </span>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-yellow-700 mb-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Pending Admin Review</span>
              </div>
              <p className="text-sm text-yellow-600">
                An administrator needs to approve your account before you can
                access the student portal.
              </p>
            </div>

            <div className="text-left bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Account Details:
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Status:</span> Pending Approval
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Mail className="h-4 w-4" />
                <span>
                  You will receive an email notification once approved
                </span>
              </div>
              <p>
                Please check back later or contact your administrator if you
                have questions.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={onLogout}
              className="w-full bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
