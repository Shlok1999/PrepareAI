import React from "react";
import { TestHistory } from "../Component/DashboardComponent/Performance/TestHistory";
import { SubjectPerformance } from "../Component/DashboardComponent/Performance/SubjectPerformance";
import { RecentTests } from "../Component/DashboardComponent/Performance/RecentTests";
import {PerformanceOverview} from "../Component/DashboardComponent/Performance/PerformanceOverview";

export default function PerformancePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Performance Analytics</h1>

      <PerformanceOverview />

      <div className="grid lg:grid-cols-2 gap-6">
        <SubjectPerformance />
        <TestHistory />
      </div>

      <RecentTests />
    </div>
  );
}
