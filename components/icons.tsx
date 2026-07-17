import type { LucideIcon } from "lucide-react";
import {
  ArrowRight as ArrowRightIcon,
  BadgeCheck as BadgeCheckIcon,
  MessageCircle as MessageCircleIcon,
  Phone as PhoneIcon,
  Sparkles as SparklesIcon,
  ShieldCheck as ShieldCheckIcon,
  Mail as MailIcon,
  MapPin as MapPinIcon,
} from "lucide-react";

type IconProps = {
  size?: number;
  className?: string;
};

function createIcon(Icon: LucideIcon) {
  const Component = ({ size = 18, className }: IconProps) => <Icon size={size} className={className} aria-hidden="true" />;
  Component.displayName = Icon.name || "Icon";
  return Component;
}

export const ArrowRight = createIcon(ArrowRightIcon);
export const BadgeCheck = createIcon(BadgeCheckIcon);
export const MessageCircle = createIcon(MessageCircleIcon);
export const Phone = createIcon(PhoneIcon);
export const Sparkles = createIcon(SparklesIcon);
export const ShieldCheck = createIcon(ShieldCheckIcon);
export const Mail = createIcon(MailIcon);
export const MapPin = createIcon(MapPinIcon);
