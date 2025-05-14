import { useQuery } from "@tanstack/react-query";

// Types for the assignments
export interface Connection {
  id: number;
  type: string;
  status: string;
  accessLevel: string;
  targetUser: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface Module {
  id: number;
  pathwayId: number;
  title: string;
  description: string | null;
  content: any;
  order: number;
  estimatedDuration: number | null;
  skillLevel: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pathway {
  id: number;
  creatorId: number;
  title: string;
  description: string | null;
  category: string;
  isTemplate: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  modules: Module[];
}

export interface Student {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Assignment {
  id: number;
  pathwayId: number;
  studentId: number;
  assignedBy: number;
  dueDate: string | null;
  status: string; // "assigned", "in_progress", "completed", "revoked"
  progress: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  pathway: Pathway;
  student: Student;
  connection: Connection;
}

/**
 * Custom hook to fetch all assignments created by the current user
 */
export function useAssignments() {
  return useQuery<Assignment[]>({
    queryKey: ["/api/assignments"],
    // The default queryFn will handle this request using the queryKey
  });
}

/**
 * Custom hook to fetch a specific assignment by ID
 */
export function useAssignment(id: number | null) {
  return useQuery<Assignment>({
    queryKey: ["/api/assignments", id],
    queryFn: async ({ queryKey }) => {
      if (!id) throw new Error("Assignment ID is required");
      const response = await fetch(`${queryKey[0]}/${queryKey[1]}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Error fetching assignment: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: id !== null,
  });
}

/**
 * Custom hook to fetch assignment metrics
 */
export interface AssignmentMetrics {
  totalAssignments: number;
  activeAssignments: number;
  completedAssignments: number;
  studentMetrics: {
    connectionId: number;
    student: Student;
    totalAssignments: number;
    activeAssignments: number;
    completedAssignments: number;
  }[];
}

export function useAssignmentMetrics() {
  return useQuery<AssignmentMetrics>({
    queryKey: ["/api/assignments/metrics"],
    // The default queryFn will handle this request using the queryKey
  });
}