import { SvgXml } from 'react-native-svg';
import { getIconXml, type IconName } from '../illustrations/icons';

type Props = {
  name: IconName;
  color: string;
  size?: number;
  filled?: boolean;
};

export function Icon({ name, color, size = 22, filled = false }: Props) {
  return <SvgXml xml={getIconXml(name, color, filled)} width={size} height={size} />;
}
