// Import the disabled versions instead of the actual skeletons
// This prevents DOM manipulation issues and helps with Fundi positioning
import { 
  DisabledCardSkeleton,
  DisabledVideoThumbnailSkeleton,
  DisabledGridSkeleton,
  DisabledFormSkeleton,
  DisabledListSkeleton
} from './disabled-skeleton-wrapper';

// Export the disabled versions with the original names
// This ensures all components using skeletons will get the safer versions
export const CardSkeleton = DisabledCardSkeleton;
export const VideoThumbnailSkeleton = DisabledVideoThumbnailSkeleton;
export const GridSkeleton = DisabledGridSkeleton;
export const FormSkeleton = DisabledFormSkeleton;
export const ListSkeleton = DisabledListSkeleton;