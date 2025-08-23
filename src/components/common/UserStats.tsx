import React from "react";
import { Calendar, Clock, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { UserStats as UserStatsType } from "@/types/user.types";

interface UserStatsProps {
  stats: UserStatsType;
  isLoading?: boolean;
}

export const UserStats: React.FC<UserStatsProps> = ({
  stats,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Account Age</p>
            <p className="text-xs text-muted-foreground">
              {stats.accountAge} {stats.accountAge === 1 ? "day" : "days"} old
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Last Login</p>
            <p className="text-xs text-muted-foreground">
              {stats.lastLogin ? formatDate(stats.lastLogin) : "Never"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Email Status</p>
            <Badge variant={stats.isVerified ? "default" : "destructive"}>
              {stats.isVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
