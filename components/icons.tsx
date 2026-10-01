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
  CheckCircle as CheckCircleIcon,
  Play as PlayIcon,
  BookOpen as BookOpenIcon,
  AlertCircle as AlertCircleIcon,
  Zap as ZapIcon,
  Users as UsersIcon,
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
export const CheckCircle = createIcon(CheckCircleIcon);
export const Play = createIcon(PlayIcon);
export const BookOpen = createIcon(BookOpenIcon);
export const AlertCircle = createIcon(AlertCircleIcon);
export const Zap = createIcon(ZapIcon);
export const Users = createIcon(UsersIcon);
