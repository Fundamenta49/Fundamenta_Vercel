// This component now forwards to the fixed position version
import RobotFundiFixedPosition from './robot-fundi-fixed-position';

interface RobotFundiProps {
  speaking?: boolean;
  thinking?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  category?: string;
  interactive?: boolean;
  emotion?: string;
  onOpen?: () => void;
}

// This component now just forwards to the fixed position component
export default function RobotFundi(props: RobotFundiProps) {
  // Simply forward all props to the fixed position component
  return <RobotFundiFixedPosition {...props} />;
}