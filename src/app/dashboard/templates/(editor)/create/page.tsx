
"use client";

import React, {
  useState,
  useTransition,
  useEffect,
  useRef,
  useCallback,
  Suspense,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toggle } from "@/components/ui/toggle";

import {
  Square,
  Type,
  ImageIcon,
  Columns,
  Minus,
  ArrowLeft,
  ChevronsUpDown,
  Laptop,
  Smartphone,
  Undo,
  Redo,
  Rocket,
  Palette,
  Bold,
  Italic,
  Underline,
  Heading1,
  Pencil,
  Youtube,
  Timer,
  Smile,
  Shapes,
  LayoutGrid,
  Box,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Trash2,
  AlertTriangle,
  Tablet,
  Droplets,
  Paintbrush,
  XIcon,
  ArrowRight,
  Sun,
  Circle,
  X,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCw,
  Move,
  Scale,
  ArrowLeftRight,
  ArrowUpDown,
  Moon,
  Edit,
  Expand,
  Upload,
  View,
  Strikethrough,
  Highlighter,
  Link2Off,
  Palette as PaletteIcon,
  Sparkles,
  CaseSensitive,
  Eraser,
  Waves,
  Dot,
  Cloud,
  Leaf,
  Droplet,
  Layers,
  PlayCircle,
  Clock,
  Globe,
  RefreshCw,
  MessageSquare,
  CalendarIcon,
  CheckIcon,
  Search as SearchIcon,
  XCircle,
  ClipboardCheck,
  Code,
  ChevronUp,
  ChevronDown,
  LayoutDashboard,
  FileSignature,
  ImagePlay,
  FileImage,
  UploadCloud,
  Grip,
  ListFilter,
  File as FileIcon,
  PackageCheck,
  Info,
  GalleryVertical,
  Star,
  CheckCircle as CheckCircleIcon,
  FolderOpen,
  Image as LucideImage,
  Film,
  StarHalf,
  ToggleLeft,
  Pentagon,
  Heart,
  Hexagon,
  Octagon,
  Diamond,
  Triangle,
  Wind,
  GitCommit,
  Image as ImageIconType,
  Eye,
  Settings2,
  Crop,
  Gift,
  Tags,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ColorPickerAdvanced } from "@/components/dashboard/color-picker-advanced";
import { useToast } from "@/hooks/use-toast";
import { HexColorPicker } from "react-colorful";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Link from "next/link";
import { saveTemplateAction, revalidatePath } from "./actions";
import {
  getTemplateById,
  getAllCategories,
} from "@/app/dashboard/templates/actions";
import {
  listFiles,
  renameFile,
  deleteFiles,
  uploadFile,
  type StorageFile,
} from "./gallery-actions";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Preloader } from "@/components/common/preloader";
import { LoadingModal } from "@/components/common/loading-modal";
import { FileManagerModal } from "@/components/dashboard/file-manager-modal";
import { BackgroundManagerModal } from "./background-manager-modal";

// 🔹 Constantes de bloques
const mainContentBlocks = [
  { name: "Columns", icon: Columns, id: "columns" },
  { name: "Contenedor Flexible", icon: Shapes, id: "wrapper" },
];

const columnContentBlocks = [
  { name: "Titulo", icon: Heading1, id: "heading" },
  { name: "Texto", icon: Type, id: "text" },
  { name: "Imagen", icon: ImageIconType, id: "image" },
  { name: "Botón", icon: Square, id: "button" },
  { name: "Separador", icon: Minus, id: "separator" },
  { name: "Video Youtube", icon: Youtube, id: "youtube" },
  { name: "Contador", icon: Timer, id: "timer" },
  { name: "Emoji", icon: Smile, id: "emoji-static" },
  { name: "Estrellas", icon: Star, id: "rating" },
  { name: "Interruptor", icon: ToggleLeft, id: "switch" },
  { name: "Formas", icon: Pentagon, id: "shapes" },
  { name: "GIF", icon: Film, id: "gif" },
];

const wrapperContentBlocks = [
  { name: "Titulo", icon: Heading1, id: "heading-interactive" },
  { name: "Emoji Interactivo", icon: Smile, id: "emoji-interactive" },
];

const columnOptions = [
  {
    num: 1,
    icon: () => (
      <div className="w-full h-8 bg-muted rounded-sm border border-border"></div>
    ),
  },
  {
    num: 2,
    icon: () => (
      <div className="flex w-full h-8 gap-1">
        <div className="w-1/2 h-full bg-muted rounded-sm border border-border"></div>
        <div className="w-1/2 h-full bg-muted rounded-sm border border-border"></div>
      </div>
    ),
  },
  {
    num: 3,
    icon: () => (
      <div className="flex w-full h-8 gap-1">
        <div className="w-1/3 h-full bg-muted rounded-sm border border-border"></div>
        <div className="w-1/3 h-full bg-muted rounded-sm border border-border"></div>
        <div className="w-1/3 h-full bg-muted rounded-sm border border-border"></div>
      </div>
    ),
  },
  {
    num: 4,
    icon: () => (
      <div className="flex w-full h-8 gap-1">
        <div className="w-1/4 h-full bg-muted rounded-sm border border-border"></div>
        <div className="w-1/4 h-full bg-muted rounded-sm border border-border"></div>
        <div className="w-1/4 h-full bg-muted rounded-sm border border-border"></div>
      </div>
    ),
  },
];

const popularEmojis = Array.from(new Set([
    '😀', '😂', '😍', '🤔', '👍', '🎉', '🚀', '❤️', '🔥', '💰',
    '✅', '✉️', '🔗', '💡', '💯', '👋', '👇', '👉', '🎁', '📈',
    '📅', '🧠', '⭐', '✨', '🙌', '👀', '💼', '⏰', '💸', '📊',
    '💻', '📱', '🎯', '📣', '✍️', '😎', '😮', '🤯', '🙏', '💪',
    '🎊', '🎈', '▶️', '➡️', '⬅️', '⬆️', '⬇️', '⚠️', '❌', '⭕️',
    '🔴', '🔵', '⚫️', '⚪️', '🔶', '🔷', '▪️', '▫️', '▲', '▼',
    '←', '↑', '→', '↓', '↔️', '↕️', '↩️', '↪️', '➕', '➖',
    '➗', '✖️', '💲', '💶', '💷', '💴', '🔒', '🔓', '🔑', '🔔',
    '🕕', '🔎', '💡', '💤', '🌍', '🌎', '🌏'
]));
  
const googleFonts = [
  "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Source Sans Pro",
  "Slabo 27px", "Raleway", "PT Sans", "Merriweather", "Noto Sans", "Poppins",
  "Ubuntu", "Playfair Display", "Lora", "Fira Sans", "Nunito Sans",
  "Quicksand", "Days One", "Russo One", "Inter", "Work Sans", "Rubik",
  "Karla", "Inconsolata", "Libre Baskerville", "Arvo", "Zilla Slab", "Pacifico",
  "Caveat", "Satisfy", "Dancing Script", "Permanent Marker", "Bangers", "Righteous",
  "Lobster", "Anton", "Passion One", "Josefin Sans", "Exo 2", "Cabin"
];

const timezones = [
    { value: "Etc/UTC", label: "UTC - Coordinated Universal Time" },
    { value: "Etc/GMT", label: "GMT - Greenwich Mean Time" },
    { value: "America/New_York", label: "USA (East) - America/New_York" },
    { value: "America/Chicago", label: "USA (Central) - America/Chicago" },
    { value: "America/Denver", label: "USA (Mountain) - America/Denver" },
    { value: "America/Los_Angeles", label: "USA (Pacific) - America/Los_Angeles" },
    { value: "America/Toronto", label: "Canada - America/Toronto" },
    { value: "America/Vancouver", label: "Canada - America/Vancouver" },
    { value: "America/Mexico_City", label: "Mexico - America/Mexico_City" },
    { value: "America/Cancun", label: "Mexico - America/Cancun" },
    { value: "America/Chihuahua", label: "Mexico - America/Chihuahua" },
    { value: "America/Tijuana", label: "Mexico (Baja California) - America/Tijuana" },
    { value: "America/Bogota", label: "Colombia - America/Bogota" },
    { value: "America/Caracas", label: "Venezuela - America/Caracas" },
    { value: "America/Lima", label: "Peru - America/Lima" },
    { value: "America/La_Paz", label: "Bolivia - America/La_Paz" },
    { value: "America/El_Salvador", label: "El Salvador - America/El_Salvador" },
    { value: "America/Guatemala", label: "Guatemala - America/Guatemala" },
    { value: "America/Sao_Paulo", label: "Brazil - America/Sao_Paulo" },
    { value: "America/Bahia", label: "Brazil - America/Bahia" },
    { value: "America/Argentina/Buenos_Aires", label: "Argentina - America/Argentina/Buenos_Aires" },
    { value: "America/Santiago", label: "Chile - America/Santiago" },
    { value: "America/Asuncion", label: "Paraguay - America/Asuncion" },
    { value: "America/Montevideo", label: "Uruguay - America/Montevideo" },
    { value: "America/Godthab", label: "Greenland - America/Godthab" },
    { value: "Europe/London", label: "United Kingdom - Europe/London" },
    { value: "Europe/Madrid", label: "Spain - Europe/Madrid" },
    { value: "Europe/Barcelona", label: "Spain - Europe/Barcelona" },
    { value: "Europe/Berlin", label: "Germany - Europe/Berlin" },
    { value: "Europe/Paris", label: "France - Europe/Paris" },
    { value: "Europe/Rome", label: "Italy - Europe/Rome" },
    { value: "Europe/Moscow", label: "Russia - Europe/Moscow" },
    { value: "Europe/Oslo", label: "Norway - Europe/Oslo" },
    { value: "Europe/Stockholm", label: "Sweden - Europe/Stockholm" },
    { value: "Europe/Zurich", label: "Switzerland - Europe/Zurich" },
    { value: "Africa/Johannesburg", label: "South Africa - Africa/Johannesburg" },
    { value: "Africa/Cairo", label: "Egypt - Africa/Cairo" },
    { value: "Africa/Nairobi", label: "Kenya - Africa/Nairobi" },
    { value: "Africa/Lagos", label: "Nigeria - Africa/Lagos" },
    { value: "Asia/Shanghai", label: "China - Asia/Shanghai" },
    { value: "Asia/Tokyo", label: "Japan - Asia/Tokyo" },
    { value: "Asia/Dubai", label: "UAE - Asia/Dubai" },
    { value: "Australia/Sydney", label: "Australia (East) - Australia/Sydney" },
    { value: "Asia/Singapore", label: "Singapore - Asia/Singapore" },
    { value: "Asia/Kamchatka", label: "Russia - Asia/Kamchatka" },
    { value: "Asia/Omsk", label: "Russia - Asia/Omsk" },
    { value: "Asia/Kolkata", label: "India - Asia/Kolkata" },
    { value: "Pacific/Auckland", label: "New Zealand - Pacific/Auckland" },
    { value: "Asia/Jakarta", label: "Indonesia - Asia/Jakarta" },
    { value: "Asia/Manila", label: "Philippines - Asia/Manila" },
    { value: "Asia/Kuala_Lumpur", label: "Malaysia - Asia/Kuala_Lumpur" },
    { value: "Asia/Hong_Kong", label: "Hong Kong - Asia/Hong_Kong" },
];

// --- STATE MANAGEMENT TYPES ---
type BackgroundSource = 'upload' | 'url' | 'gallery';
type StaticPrimitiveBlockType = 'heading' | 'text' | 'image' | 'button' | 'separator' | 'youtube' | 'timer' | 'emoji-static' | 'rating' | 'switch' | 'shapes' | 'gif';
type InteractiveBlockType = 'emoji-interactive' | 'heading-interactive';

type BlockType = StaticPrimitiveBlockType | InteractiveBlockType | 'columns' | 'wrapper';
type Viewport = 'desktop' | 'tablet' | 'mobile';
type TextAlign = 'left' | 'center' | 'right';
type BackgroundFit = 'cover' | 'contain' | 'auto';
type GradientDirection = 'vertical' | 'horizontal' | 'radial';
type SeparatorLineStyle = 'solid' | 'dotted' | 'dashed';
type SeparatorShapeType = 'waves' | 'drops' | 'zigzag' | 'leaves' | 'scallops';
type StarStyle = 'pointed' | 'universo' | 'moderno';
type SwitchDesign = 'classic' | 'futuristic' | 'minimalist';
type ShapeType = 'square' | 'circle' | 'triangle' | 'rhombus' | 'pentagon' | 'hexagon' | 'octagon' | 'heart' | 'diamond' | 'star';
type ShadowPosition = 'around' | 'bottom' | 'top' | 'right' | 'left';


interface BaseBlock {
  id: string;
  type: StaticPrimitiveBlockType | InteractiveBlockType;
  payload: { [key: string]: any };
}

interface HeadingBlock extends BaseBlock {
    type: 'heading';
    payload: {
        text: string;
        styles: {
            color: string;
            fontFamily: string;
            fontSize: number;
            textAlign: TextAlign;
            fontWeight: 'normal' | 'bold';
            fontStyle: 'normal' | 'italic';
            textDecoration: 'none' | 'underline' | 'line-through';
            highlight?: string;
        }
    }
}

interface TextFragment {
    id: string;
    text: string;
    link?: {
        url: string;
        openInNewTab: boolean;
    };
    styles: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        strikethrough?: boolean;
        color?: string;
        highlight?: string;
        fontFamily?: string;
    };
}

interface TextBlock extends BaseBlock {
    type: 'text';
    payload: {
        fragments: TextFragment[];
        globalStyles: {
            textAlign: TextAlign;
            fontSize: number;
        }
    }
}


interface ButtonBlock extends BaseBlock {
    type: 'button';
    payload: {
        text: string;
        link: {
            url: string;
            openInNewTab: boolean;
        };
        textAlign: TextAlign;
        styles: {
            color: string;
            backgroundColor: string;
            borderRadius: number;
            background?: {
                type: 'solid' | 'gradient';
                color1: string;
                color2?: string;
                direction?: GradientDirection;
            }
        }
    }
}

interface SeparatorBlock extends BaseBlock {
    type: 'separator';
    payload: {
        height: number;
        style: 'invisible' | 'line' | 'shapes' | 'dots';
        line: {
            thickness: number;
            color: string;
            style: SeparatorLineStyle;
            borderRadius: number;
        };
        shapes: {
            type: SeparatorShapeType;
            background: {
              type: 'solid' | 'gradient';
              color1: string;
              color2?: string;
              direction?: GradientDirection;
            };
            frequency: number;
        };
        dots: {
            size: number;
            count: number;
            color: string;
        }
    }
}

interface StaticEmojiBlock extends BaseBlock {
    type: 'emoji-static';
    payload: {
        emoji: string;
        styles: {
            fontSize: number;
            textAlign: TextAlign;
            rotate: number;
        }
    }
}

interface YouTubeBlock extends BaseBlock {
    type: 'youtube';
    payload: {
        url: string;
        videoId: string | null;
        title: string;
        showTitle: boolean;
        duration: {
            hours: string;
            minutes: string;
            seconds: string;
        },
        showDuration: boolean;
        link: {
            url: string,
            openInNewTab: boolean;
        };
        styles: {
            playButtonType: 'default' | 'classic';
            borderRadius: number;
            border: {
                type: 'solid' | 'gradient';
                color1: string;
                color2?: string;
                direction?: GradientDirection;
            };
            borderWidth: number;
        }
    }
}

interface TimerBlock extends BaseBlock {
  type: 'timer';
  payload: {
    values: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
    design: 'digital' | 'analog' | 'minimalist';
    styles: {
      fontFamily: string;
      numberColor: string;
      labelColor: string;
      borderRadius: number;
      background: {
        type: 'solid' | 'gradient';
        color1: string;
        color2: string;
        direction: GradientDirection;
      };
      strokeWidth: number;
      scale: number;
      minimalistLabelSize: number;
    };
  };
}

interface ImageBlock extends BaseBlock {
  type: 'image';
  payload: {
    url: string;
    alt: string;
    link: {
      url: string;
      openInNewTab: boolean;
    };
    styles: {
      size: number;
      positionX: number;
      positionY: number;
      zoom: number;
      borderRadius: number;
      border: {
        width: number;
        type: 'solid' | 'gradient';
        color1: string;
        color2?: string;
        direction?: GradientDirection;
      };
    };
  };
}

interface RatingBlock extends BaseBlock {
  type: 'rating';
  payload: {
    rating: number; // 0 to 5
    styles: {
      starStyle: StarStyle;
      starSize: number;
      alignment: TextAlign;
      paddingY: number;
      spacing: number;
      filled: {
        type: 'solid' | 'gradient';
        color1: string;
        color2?: string;
        direction?: GradientDirection;
      };
      unfilled: {
        type: 'solid' | 'gradient';
        color1: string;
        color2?: string;
        direction?: GradientDirection;
      };
      border: {
        width: number;
        type: 'solid' | 'gradient';
        color1: string;
        color2?: string;
        direction?: GradientDirection;
      }
    }
  }
}

interface SwitchBlock extends BaseBlock {
  type: 'switch';
  payload: {
    design: SwitchDesign;
    isOn: boolean;
    scale: number;
    alignment: TextAlign;
    paddingY: number;
    hookText: string;
    styles: {
      on: {
        type: 'solid' | 'gradient';
        color1: string;
        color2?: string;
        direction?: GradientDirection;
      },
      off: {
        type: 'solid' | 'gradient';
        color1: string;
        color2?: string;
        direction?: GradientDirection;
      },
      hookTextColor: string;
    }
  }
}

interface ShapesBlock extends BaseBlock {
  type: 'shapes';
  payload: {
    shape: ShapeType;
    styles: {
      size: number;
      background: {
        type: 'solid' | 'gradient';
        color1: string;
        color2?: string;
        direction?: GradientDirection;
      },
      blur: number;
      shadow: {
        color: string;
        opacity: number;
        position: ShadowPosition;
      }
    }
  }
}

interface GifBlock extends BaseBlock {
  type: 'gif';
  payload: {
    url: string;
    alt: string;
    styles: { 
        size: number; 
        scale: number; 
        positionX: number; 
        positionY: number;
        borderRadius: number;
        border: {
            width: number;
            type: 'solid' | 'gradient';
            color1: string;
            color2?: string;
            direction?: GradientDirection;
        }
    }
  }
}

interface InteractiveEmojiBlock extends BaseBlock {
    type: 'emoji-interactive';
    payload: {
        name: string;
        emoji: string;
        x: number;
        y: number;
        scale: number;
        rotate: number;
    }
}

interface InteractiveHeadingBlock extends BaseBlock {
    type: 'heading-interactive';
    payload: {
        name: string;
        text: string;
        x: number;
        y: number;
        scale: number;
        rotate: number;
        styles: {
            color: string;
            fontFamily: string;
            fontWeight: 'normal' | 'bold';
            fontStyle: 'normal' | 'italic';
            textDecoration: 'none' | 'underline' | 'line-through';
            highlight?: string;
        }
    }
}

type PrimitiveBlock = BaseBlock | ButtonBlock | HeadingBlock | TextBlock | StaticEmojiBlock | SeparatorBlock | YouTubeBlock | TimerBlock | ImageBlock | RatingBlock | SwitchBlock | ShapesBlock | GifBlock;
type InteractivePrimitiveBlock = InteractiveEmojiBlock | InteractiveHeadingBlock;


interface Column {
  id: string;
  blocks: PrimitiveBlock[];
  width: number;
  styles: {
    borderRadius?: number;
    background?: {
      type: 'solid' | 'gradient';
      color1: string;
      color2?: string;
      direction?: GradientDirection;
    }
  }
}

interface ColumnsBlock {
  id: string;
  type: 'columns';
  payload: {
    columns: Column[];
    alignment: number; // 0-100, for single column positioning
  };
}

interface WrapperStyles {
    borderRadius?: number;
    background?: {
      type: 'solid' | 'gradient';
      color1: string;
      color2?: string;
      direction?: GradientDirection;
    };
    backgroundImage?: {
        url: string;
        fit: BackgroundFit;
        positionX: number;
        positionY: number;
        zoom: number;
    }
}

interface WrapperBlock {
  id: string;
  type: 'wrapper';
  payload: {
    blocks: InteractivePrimitiveBlock[];
    height: number;
    styles: WrapperStyles;
  };
}


type CanvasBlock = ColumnsBlock | WrapperBlock;
type SelectedElement = 
  | { type: 'column', columnId: string, rowId: string } 
  | { type: 'primitive', primitiveId: string, columnId: string, rowId: string } 
  | { type: 'wrapper', wrapperId: string } 
  | { type: 'wrapper-primitive', primitiveId: string, wrapperId: string } 
  | null;

const getSelectedBlockType = (element: SelectedElement, content: CanvasBlock[]): BlockType | null => {
    if (!element) return null;

    if (element.type === 'column') {
        return 'columns';
    }
    if (element.type === 'wrapper') {
        return 'wrapper';
    }
    if (element.type === 'primitive') {
        const row = content.find(r => r.id === element.rowId);
        if (row?.type !== 'columns') return null;
        const col = row.payload.columns.find(c => c.id === element.columnId);
        const block = col?.blocks.find(b => b.id === element.primitiveId);
        return block?.type || null;
    }
     if (element.type === 'wrapper-primitive') {
        const row = content.find(r => r.id === element.wrapperId);
        if (row?.type !== 'wrapper') return null;
        const block = row.payload.blocks.find(b => b.id === element.primitiveId);
        return block?.type || null;
    }

    return null;
};

function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [canvasContent, _setCanvasContent] = useState<CanvasBlock[]>([]);
  const [selectedElement, setSelectedElement] = useState<SelectedElement>(null);
  const [templateName, setTemplateName] = useState('Mi Plantilla Increíble');
  const [tempTemplateName, setTempTemplateName] = useState(templateName);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode for editor
  const [itemToDelete, setItemToDelete] = useState<{ rowId: string, colId?: string, primId?: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // State for block selectors
  const [activeContainer, setActiveContainer] = useState<{ id: string; type: 'column' | 'wrapper' } | null>(null);
  const [isColumnBlockSelectorOpen, setIsColumnBlockSelectorOpen] = useState(false);
  const [isWrapperBlockSelectorOpen, setIsWrapperBlockSelectorOpen] = useState(false);

  // State for wrapper actions
  const [isActionSelectorModalOpen, setIsActionSelectorModalOpen] = useState(false);
  const [actionTargetWrapperId, setActionTargetWrapperId] = useState<string | null>(null);
  const [clickPosition, setClickPosition] = useState<{x: number, y: number} | null>(null);
  const [isEmojiSelectorOpen, setIsEmojiSelectorOpen] = useState(false);

  // States for resizing
  const [isResizing, setIsResizing] = useState(false);
  const [resizingWrapperId, setResizingWrapperId] = useState<string | null>(null);

  // State for background image modal
  const [isBgImageModalOpen, setIsBgImageModalOpen] = useState(false);
  
  const [isCopySuccessModalOpen, setIsCopySuccessModalOpen] = useState(false);

  // New states for the modals
  const [isInitialNameModalOpen, setIsInitialNameModalOpen] = useState(false);
  const [isConfirmExitModalOpen, setIsConfirmExitModalOpen] = useState(false);
  
  // Gallery Modal State
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  
  const [userId, setUserId] = useState<string | null>(null);

  // New states for initial modal category management
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');


  const [templateId, setTemplateId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, startSaving] = useTransition();
  
  // Undo/Redo states
  const [history, setHistory] = useState<CanvasBlock[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [isLoading, setIsLoading] = useState(true); // For preloader
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  const wrapperRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { toast } = useToast();
  
  const setCanvasContent = useCallback((newContent: CanvasBlock[] | ((prev: CanvasBlock[]) => CanvasBlock[]), recordHistory: boolean = true) => {
    _setCanvasContent(prev => {
        const newContentValue = typeof newContent === 'function' ? newContent(prev) : newContent;
        if(recordHistory) {
            const newHistory = history.slice(0, historyIndex + 1);
            setHistory([...newHistory, newContentValue]);
            setHistoryIndex(newHistory.length);
        }
        return newContentValue;
    });
  }, [history, historyIndex]);

  const handleUndo = () => {
      if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          _setCanvasContent(history[newIndex]);
          setSelectedElement(null);
      }
  };

  const handleRedo = () => {
      if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          _setCanvasContent(history[newIndex]);
          setSelectedElement(null);
      }
  };


  const handlePublish = (categoriesToSave?: string[]) => {
    setLoadingAction('save');
    startSaving(async () => {
      const result = await saveTemplateAction({
        name: templateName,
        content: canvasContent,
        categories: categoriesToSave ?? selectedCategories,
        templateId: templateId ?? undefined,
      });

      if (result.success && result.data) {
        if (!templateId) {
          setTemplateId(result.data.id);
        }
        setLastSaved(new Date(result.data.updated_at));
        toast({
          title: "¡Plantilla Guardada!",
          description: "Tu obra maestra está a salvo en nuestra base de datos.",
          className: 'bg-gradient-to-r from-[#AD00EC] to-[#1700E6] border-none text-white',
        });
      } else {
        toast({
          title: "Error al Guardar",
          description: result.error || "No se pudo guardar la plantilla. Intenta de nuevo.",
          variant: "destructive",
        });
      }
      setLoadingAction(null);
    });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  useEffect(() => {
    const templateIdFromUrl = searchParams.get('id');

    const loadTemplate = async (id: string) => {
        setLoadingAction('Cargando plantilla...');
        const result = await getTemplateById(id);
        if (result.success && result.data) {
            setTemplateName(result.data.name);
            _setCanvasContent(result.data.content || []);
            setTemplateId(result.data.id);
            setLastSaved(new Date(result.data.updated_at));
            setSelectedCategories(result.data.categories || []);
            // Reset history for the loaded template
            setHistory([result.data.content || []]);
            setHistoryIndex(0);
        } else {
            toast({
                title: 'Error al Cargar',
                description: result.error || 'No se pudo encontrar la plantilla.',
                variant: 'destructive',
            });
            // Keep editor empty for new template creation
            setIsInitialNameModalOpen(true);
        }
        setIsLoading(false);
        setLoadingAction(null);
    };
    
    const fetchInitialData = async () => {
        const categoriesResult = await getAllCategories();
        if (categoriesResult.success && categoriesResult.data) {
            setAllCategories(categoriesResult.data);
        }
    
        if (templateIdFromUrl) {
            loadTemplate(templateIdFromUrl);
        } else {
            const timer = setTimeout(() => setIsLoading(false), 1500);
             if (!isLoading) {
                setIsInitialNameModalOpen(true);
            }
            return () => clearTimeout(timer);
        }
    };
    
    fetchInitialData();
  }, [searchParams, toast, isLoading]);
  
  useEffect(() => {
    const getUserId = async () => {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if(session?.user) {
            setUserId(session.user.id);
        }
    };
    getUserId();
  }, []);
  
  const ThemeToggle = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun /> : <Moon />}
          </Button></TooltipTrigger>
        <TooltipContent>
          <p>Cambiar a modo {isDarkMode ? 'claro' : 'oscuro'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  
  const handleBlockClick = (type: BlockType) => {
      if (type === 'columns') {
          setIsColumnModalOpen(true);
      } else if (type === 'wrapper') {
        const newWrapper: WrapperBlock = {
            id: `wrap_${Date.now()}`,
            type: 'wrapper',
            payload: {
                blocks: [],
                height: 300,
                styles: {
                    background: {
                        type: 'solid',
                        color1: 'rgba(255,255,255,0.05)',
                    }
                }
            }
        };
        setCanvasContent(prev => [...prev, newWrapper]);
      }
  }

  const handleAddColumns = (numColumns: number) => {
    const newColumnsBlock: ColumnsBlock = {
      id: `row_${Date.now()}`,
      type: 'columns',
      payload: {
        columns: Array.from({ length: numColumns }, (_, i) => ({
          id: `col_${Date.now()}_${i}`,
          blocks: [],
          width: 100 / numColumns,
           styles: {}
        })),
        alignment: 50,
      }
    };
    setCanvasContent(prev => [...prev, newColumnsBlock]);
    setIsColumnModalOpen(false);
  };
  
  const handleOpenBlockSelector = (containerId: string, containerType: 'column' | 'wrapper', e: React.MouseEvent) => {
      e.stopPropagation();
      setActiveContainer({ id: containerId, type: containerType });
      if (containerType === 'column') {
        setIsColumnBlockSelectorOpen(true);
      } else {
        setIsWrapperBlockSelectorOpen(true);
      }
  };
  
  const handleAddBlockToColumn = (type: StaticPrimitiveBlockType) => {
      if (!activeContainer || activeContainer.type !== 'column') return;

      let newBlock: PrimitiveBlock;
      const basePayload = { id: `${type}_${Date.now()}` };
      const defaultTextColor = isDarkMode ? '#FFFFFF' : '#000000';

      switch(type) {
         case 'heading':
            newBlock = {
                ...basePayload,
                type: 'heading',
                payload: {
                    text: 'Escribe tu título aquí',
                    styles: {
                        color: defaultTextColor,
                        fontFamily: 'Roboto',
                        fontSize: 32,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontStyle: 'normal',
                        textDecoration: 'none'
                    }
                }
            };
            break;
        case 'text':
            newBlock = {
                ...basePayload,
                type: 'text',
                payload: {
                    fragments: [
                        { id: `frag_${Date.now()}`, text: 'Este es un bloque de texto editable. ¡Haz clic para personalizarlo! ', styles: { color: isDarkMode ? '#CCCCCC' : '#333333' } }
                    ],
                    globalStyles: {
                        textAlign: 'left',
                        fontSize: 16
                    }
                }
            };
            break;
        case 'image':
          newBlock = {
            ...basePayload,
            type: 'image',
            payload: {
              url: 'https://placehold.co/600x400.png?text=Nueva+Imagen',
              alt: 'Placeholder image',
              link: { url: '#', openInNewTab: false },
              styles: {
                size: 100,
                positionX: 50,
                positionY: 50,
                zoom: 100,
                borderRadius: 8,
                border: {
                  width: 0,
                  type: 'solid',
                  color1: '#A020F0',
                  color2: '#3357FF',
                  direction: 'vertical'
                }
              }
            }
          };
          break;
         case 'button':
            newBlock = {
                ...basePayload,
                type: 'button',
                payload: {
                    text: 'Haz Clic Aquí',
                    link: { url: '#', openInNewTab: false },
                    textAlign: 'center',
                    styles: {
                        color: '#FFFFFF',
                        backgroundColor: '#A020F0',
                        borderRadius: 8,
                         background: { type: 'solid', color1: '#A020F0' }
                    }
                }
            };
            break;
        case 'emoji-static':
             newBlock = {
                ...basePayload,
                type: 'emoji-static',
                payload: {
                    emoji: '🚀',
                    styles: {
                        fontSize: 64,
                        textAlign: 'center',
                        rotate: 0,
                    }
                }
            };
            break;
        case 'separator':
            newBlock = {
                ...basePayload,
                type: 'separator',
                payload: {
                    height: 20,
                    style: 'dots',
                    line: { thickness: 1, color: '#CCCCCC', style: 'solid', borderRadius: 0 },
                    shapes: { type: 'waves', background: { type: 'solid', color1: '#A020F0' }, frequency: 20 },
                    dots: { size: 4, count: 10, color: '#CCCCCC' }
                }
            };
            break;
        case 'youtube':
            newBlock = {
                ...basePayload,
                type: 'youtube',
                payload: {
                    url: '', videoId: null, title: 'Título de tu video', showTitle: true,
                    duration: { hours: '', minutes: '', seconds: '' }, showDuration: false,
                    link: { url: '', openInNewTab: false },
                    styles: { playButtonType: 'default', borderRadius: 12, borderWidth: 0, border: { type: 'solid', color1: '#FF0000' } }
                }
            };
            break;
        case 'timer':
            newBlock = {
                ...basePayload,
                type: 'timer',
                payload: {
                    values: { days: '07', hours: '00', minutes: '00', seconds: '00' },
                    design: 'minimalist',
                    styles: {
                        fontFamily: 'Roboto', numberColor: defaultTextColor, labelColor: isDarkMode ? '#999999' : '#666666',
                        borderRadius: 15, background: { type: 'gradient', color1: '#AD00EC', color2: '#0018EC', direction: 'vertical' },
                        strokeWidth: 4, scale: 1, minimalistLabelSize: 1
                    }
                }
            };
            break;
        case 'rating':
            newBlock = {
                ...basePayload,
                type: 'rating',
                payload: {
                    rating: 4.5,
                    styles: {
                        starStyle: 'pointed',
                        starSize: 40,
                        alignment: 'center',
                        paddingY: 10,
                        spacing: 4,
                        filled: { type: 'solid', color1: '#FFD700', color2: '#FFA500', direction: 'horizontal' },
                        unfilled: { type: 'solid', color1: '#444444' },
                        border: { width: 1, type: 'solid', color1: '#666666' },
                    }
                }
            };
            break;
          case 'switch':
            newBlock = {
                ...basePayload,
                type: 'switch',
                payload: {
                    design: 'classic',
                    isOn: true,
                    scale: 1,
                    alignment: 'center',
                    paddingY: 10,
                    hookText: 'Texto del interruptor',
                    styles: {
                        on: { type: 'gradient', color1: '#00F260', color2: '#0575E6', direction: 'horizontal' },
                        off: { type: 'solid', color1: '#555555' },
                        hookTextColor: defaultTextColor,
                    }
                }
            };
            break;
        case 'shapes':
            newBlock = {
                ...basePayload,
                type: 'shapes',
                payload: {
                    shape: 'circle',
                    styles: {
                        size: 100,
                        background: { type: 'gradient', color1: '#DA4453', color2: '#89216B', direction: 'radial' },
                        blur: 0,
                        shadow: { color: 'rgba(0,0,0,0.5)', opacity: 50, position: 'around' }
                    }
                }
            };
            break;
        case 'gif':
            newBlock = {
                ...basePayload,
                type: 'gif',
                payload: {
                    url: 'https://placehold.co/300x200.gif?text=Añadir+GIF',
                    alt: 'Placeholder GIF',
                    styles: { 
                        size: 100, 
                        scale: 1, 
                        positionX: 50, 
                        positionY: 50,
                        borderRadius: 8,
                        border: {
                            width: 0,
                            type: 'solid',
                            color1: '#A020F0',
                            color2: '#3357FF',
                            direction: 'vertical'
                        }
                    }
                }
            };
            break;
        default:
            newBlock = { ...basePayload, type: 'text', payload: { fragments: [] } }; // Fallback
      }

      setCanvasContent(prev =>
  prev.map(row => {
    if (row.type !== "columns") return row;
    const newColumns = row.payload.columns.map(col => {
      if (col.id === activeContainer?.id) {
        return { ...col, blocks: [...col.blocks, newBlock] };
      }
      return col;
    });
    return { ...row, payload: { ...row.payload, columns: newColumns } };
  })
);
setIsColumnBlockSelectorOpen(false);
};

const handleAddBlockToWrapper = (type: InteractiveBlockType) => {
  if (!activeContainer || activeContainer.type !== "wrapper" || !clickPosition) return;

  setIsActionSelectorModalOpen(false);
  setIsWrapperBlockSelectorOpen(false);

  if (type === "emoji-interactive") {
    setIsEmojiSelectorOpen(true);
  } else if (type === "heading-interactive") {
    const wrapperElement = wrapperRefs.current[activeContainer.id];
    if (!wrapperElement) return;

    const rect = wrapperElement.getBoundingClientRect();
    const xPercent = (clickPosition.x / rect.width) * 100;
    const yPercent = (clickPosition.y / rect.height) * 100;

    const newBlock: InteractiveHeadingBlock = {
      id: `iheading_${Date.now()}`,
      type: "heading-interactive",
      payload: {
        name: `Titulo-${Math.floor(Math.random() * 1000)}`,
        text: "Título Interactivo",
        x: xPercent,
        y: yPercent,
        scale: 1,
        rotate: 0,
        styles: {
          color: isDarkMode ? "#FFFFFF" : "#000000",
          fontFamily: "Roboto",
          fontWeight: "bold",
          fontStyle: "normal",
          textDecoration: "none",
        },
      },
    };

    setCanvasContent(prev =>
      prev.map(row => {
        if (row.id === activeContainer.id && row.type === "wrapper") {
          return {
            ...row,
            payload: { ...row.payload, blocks: [...row.payload.blocks, newBlock] },
          };
        }
        return row;
      })
    );
    setClickPosition(null);
    setActiveContainer(null);
  }
};

const handleSelectEmojiForWrapper = (emoji: string) => {
  if (!activeContainer || activeContainer.type !== "wrapper" || !clickPosition) return;

  const wrapperElement = wrapperRefs.current[activeContainer.id];
  if (!wrapperElement) return;

  const rect = wrapperElement.getBoundingClientRect();
  const xPercent = (clickPosition.x / rect.width) * 100;
  const yPercent = (clickPosition.y / rect.height) * 100;

  const newBlock: InteractiveEmojiBlock = {
    id: `emoji_${Date.now()}`,
    type: "emoji-interactive",
    payload: {
      name: `Emoji-${Math.floor(Math.random() * 1000)}`,
      emoji,
      x: xPercent,
      y: yPercent,
      scale: 1,
      rotate: 0,
    },
  };

  setCanvasContent(prev =>
    prev.map(row => {
      if (row.id === activeContainer.id && row.type === "wrapper") {
        return {
          ...row,
          payload: { ...row.payload, blocks: [...row.payload.blocks, newBlock] },
        };
      }
      return row;
    })
  );
  setIsEmojiSelectorOpen(false);
  setClickPosition(null);
  setActiveContainer(null);
};

const promptDeleteItem = (rowId: string, colId?: string, primId?: string) => {
  setItemToDelete({ rowId, colId, primId });
  setIsDeleteModalOpen(true);
};

const handleDeleteItem = () => {
  if (!itemToDelete) return;
  const { rowId, colId, primId } = itemToDelete;

  setCanvasContent(prev => {
    let newCanvasContent = [...prev];

    if (primId && colId) {
      // borrar de columna
      newCanvasContent = newCanvasContent.map(row => {
        if (row.id === rowId && row.type === "columns") {
          const newCols = row.payload.columns.map(col => {
            if (col.id === colId) {
              return { ...col, blocks: col.blocks.filter(b => b.id !== primId) };
            }
            return col;
          });
          return { ...row, payload: { ...row.payload, columns: newCols } };
        }
        return row;
      });
    } else if (primId && !colId) {
      // borrar de wrapper
      newCanvasContent = newCanvasContent.map(row => {
        if (row.id === rowId && row.type === "wrapper") {
          const newBlocks = row.payload.blocks.filter(b => b.id !== primId);
          return { ...row, payload: { ...row.payload, blocks: newBlocks } };
        }
        return row;
      });
    } else if (colId) {
      // borrar columna completa (no implementado, elimina toda la fila)
      newCanvasContent = newCanvasContent.filter(row => row.id !== rowId);
    } else {
      // borrar fila completa (ColumnsBlock o WrapperBlock)
      newCanvasContent = newCanvasContent.filter(row => row.id !== rowId);
    }

    return newCanvasContent;
  }, true);

  setSelectedElement(null);
  setIsDeleteModalOpen(false);
  setItemToDelete(null);
};
  
  const getFragmentStyle = (fragment: TextFragment): React.CSSProperties => {
    const style: React.CSSProperties = {};
    if (fragment.styles.bold) style.fontWeight = 'bold';
    if (fragment.styles.italic) style.fontStyle = 'italic';
    if (fragment.styles.color) style.color = fragment.styles.color;
    if (fragment.styles.highlight) style.backgroundColor = fragment.styles.highlight;
    if (fragment.styles.fontFamily) style.fontFamily = fragment.styles.fontFamily;
    
    let textDecoration = '';
    if (fragment.styles.underline) textDecoration += ' underline';
    if (fragment.styles.strikethrough) textDecoration += ' line-through';
    if(textDecoration) style.textDecoration = textDecoration.trim();

    return style;
  };
  
  const getButtonStyle = (block: ButtonBlock): React.CSSProperties => {
    const { styles } = block.payload;
    const style: React.CSSProperties = {
      color: styles.color,
      borderRadius: `${styles.borderRadius}px`,
      padding: '10px 20px',
      border: 'none',
      cursor: 'pointer',
      display: 'inline-block',
      fontWeight: 'bold',
    };
    if(styles.background?.type === 'solid') {
      style.backgroundColor = styles.background.color1;
    } else if (styles.background?.type === 'gradient') {
        const { direction, color1, color2 } = styles.background;
        if (direction === 'radial') {
          style.backgroundImage = `radial-gradient(circle, ${color1}, ${color2})`;
        } else {
          const angle = direction === 'horizontal' ? 'to right' : 'to bottom';
          style.backgroundImage = `linear-gradient(${angle}, ${color1}, ${color2})`;
        }
    }
    return style;
  };
  
  const getButtonContainerStyle = (block: ButtonBlock): React.CSSProperties => {
    return {
      textAlign: block.payload.textAlign,
      padding: '8px',
    }
  }

  const getHeadingStyle = (block: HeadingBlock | InteractiveHeadingBlock): React.CSSProperties => {
      const { styles } = block.payload;
      const interactiveStyles: React.CSSProperties = 'scale' in block.payload 
      ? { transform: `scale(${block.payload.scale})` } 
      : { fontSize: `${(block.payload as HeadingBlock['payload']).styles.fontSize}px`, textAlign: (block.payload as HeadingBlock['payload']).styles.textAlign as TextAlign};

      const style: React.CSSProperties = {
          color: styles.color,
          fontFamily: styles.fontFamily,
          fontWeight: styles.fontWeight,
          fontStyle: styles.fontStyle,
          padding: '8px',
          wordBreak: 'break-word',
          whiteSpace: 'nowrap',
          ...interactiveStyles,
      };
      
      if (styles.highlight) {
          style.backgroundColor = styles.highlight;
      }
      
      let textDecoration = '';
      if (styles.textDecoration === 'underline') textDecoration = 'underline';
      if (styles.textDecoration === 'line-through') textDecoration = 'line-through';
      if (textDecoration) style.textDecoration = textDecoration;
      
      return style;
  };

  const getStaticEmojiStyle = (block: StaticEmojiBlock): React.CSSProperties => {
    return {
        fontSize: `${block.payload.styles.fontSize}px`,
        transform: `rotate(${block.payload.styles.rotate}deg)`,
        display: 'inline-block',
        padding: '8px',
    }
  };
  
  const LineSeparator = ({ block }: { block: SeparatorBlock }) => {
    const { height, line } = block.payload;
    return (
        <div style={{ height: `${height}px`, width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{
                height: `${line.thickness}px`,
                width: '100%',
                backgroundColor: line.color,
                borderStyle: line.style,
                borderRadius: `${line.borderRadius}px`,
            }} />
        </div>
    );
  };
  
  const ShapesSeparator = ({ block }: { block: SeparatorBlock }) => {
    const { height, shapes } = block.payload;
    const { type, background, frequency } = shapes;
    
    const bgStyle: React.CSSProperties = {};
    if (background.type === 'solid') {
      bgStyle.backgroundColor = background.color1;
    } else if (background.type === 'gradient') {
      const { direction, color1, color2 } = background;
      if (direction === 'radial') {
        bgStyle.backgroundImage = `radial-gradient(circle, ${color1}, ${color2})`;
      } else {
        const angle = direction === 'horizontal' ? 'to right' : 'to bottom';
        bgStyle.backgroundImage = `linear-gradient(${angle}, ${color1}, ${color2})`;
      }
    }

    const getPathForShape = () => {
        let path = '';
        const numRepeats = frequency || 20;

        switch(type) {
            case 'waves':
                path = `M0,50 Q${50/numRepeats},0 ${100/numRepeats},50 T${200/numRepeats},50`;
                return <path d={path} strokeWidth="0" className="fill-current" style={{ transform: `scale(${numRepeats}, 1)` }} />;
            case 'zigzag':
                 path = `M0,50 L${50/numRepeats},0 L${100/numRepeats},50`;
                 return <path d={path} strokeWidth="0" className="fill-current" style={{ transform: `scale(${numRepeats}, 1)` }}/>;
            case 'drops':
                path = `M0,0 A50,50 0 0 1 100,0 L100,100 L0,100 Z`; // Simplified path
                return <path d={path} strokeWidth="0" className="fill-current" style={{ transform: `scale(1, ${height/100})` }} />;
            case 'leaves':
            case 'scallops':
            default:
                return null;
        }
    }

    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" style={{color: bgStyle.backgroundColor, backgroundImage: bgStyle.backgroundImage}}>
           {getPathForShape()}
        </svg>
    )
  };

  const SwitchComponent = ({ block }: { block: SwitchBlock }) => {
    const { design, scale, alignment, paddingY, styles, isOn, hookText } = block.payload;

    const onBg = styles.on.type === 'gradient'
      ? (styles.on.direction === 'radial'
          ? `radial-gradient(circle, ${styles.on.color1}, ${styles.on.color2})`
          : `linear-gradient(${styles.on.direction === 'horizontal' ? 'to right' : 'to bottom'}, ${styles.on.color1}, ${styles.on.color2})`)
      : styles.on.color1;

    const offBg = styles.off.type === 'gradient'
      ? (styles.off.direction === 'radial'
          ? `radial-gradient(circle, ${styles.off.color1}, ${styles.off.color2})`
          : `linear-gradient(${styles.off.direction === 'horizontal' ? 'to right' : 'to bottom'}, ${styles.off.color1}, ${styles.off.color2})`)
      : styles.off.color1;

    const alignClass = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end'
    };
    
    const scaledFontSize = (baseSize: number) => `${baseSize * scale}px`;
    const scaledGap = `${8 * scale}px`;
    
    const renderSwitch = () => {
      const wrapperStyle = { transform: `scale(${scale})`, transformOrigin: alignment };
      if (design === 'classic') {
          return (
              <div style={wrapperStyle} className="inline-block">
                  <div className={cn("relative w-16 h-8 rounded-full transition-all duration-300")} style={{ background: isOn ? onBg : offBg }}>
                      <div className={cn("absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300", isOn && "translate-x-8")} />
                  </div>
              </div>
          );
      }
  
      if (design === 'futuristic') {
          return (
              <div style={wrapperStyle} className="inline-block">
                  <div className={cn("relative w-20 h-6 rounded-full p-1")}>
                       <div className="absolute inset-0 rounded-full" style={{background: isOn ? onBg : offBg, filter: `blur(${isOn ? '10px' : '0px'})`, transition: 'all 0.5s' }} />
                       <div className={cn("relative z-10 w-full h-full rounded-full transition-all")} style={{ background: isOn ? onBg : offBg }} />
                       <div className={cn("absolute z-20 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full transition-all duration-300 flex items-center justify-center", isOn ? "left-[calc(100%-2.25rem)]" : "left-0.5")}>
                          <div className={cn("w-2 h-2 rounded-full transition-all", isOn ? "bg-green-400 shadow-[0_0_5px_#39ff14]" : "bg-red-500")} />
                      </div>
                  </div>
              </div>
         )
      }
  
      if (design === 'minimalist') {
         return (
              <div style={wrapperStyle} className="inline-block">
                  <div className="w-24 h-10 flex items-center justify-center">
                      <div className={cn("relative w-16 h-2 rounded-full")} style={{background: offBg}}>
                          <div className="absolute top-1/2 -translate-y-1/2 w-full h-full rounded-full transition-all duration-300" style={{background: onBg, width: isOn ? '100%' : '0%'}}/>
                          <div className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 border-2 rounded-full transition-all duration-300", isOn ? "left-full -translate-x-full border-white" : "left-0 border-gray-500")} style={{background: isOn ? onBg : 'white'}}/>
                      </div>
                  </div>
              </div>
         )
      }
      return null;
    }
    
    return (
      <div className={cn("w-full flex", alignClass[alignment])} style={{ paddingTop: `${paddingY}px`, paddingBottom: `${paddingY}px` }}>
        <div className="flex flex-col items-center" style={{ gap: scaledGap }}>
            {renderSwitch()}
            <p style={{ fontSize: scaledFontSize(14), color: styles.hookTextColor }}>{hookText}</p>
        </div>
      </div>
    );
  }
  SwitchComponent.displayName = 'SwitchComponent';

  const ShapesComponent = ({ block }: { block: ShapesBlock }) => {
    const { shape, styles } = block.payload;
    const { background, blur, shadow, size } = styles;

    const shapePaths = {
        square: "M10,10 H90 V90 H10 Z",
        circle: "M50,10 a40,40 0 1,1 0,80 a40,40 0 1,1 0,-80",
        triangle: "M10,90 L50,10 L90,90 Z",
        rhombus: "M50,5 L95,50 L50,95 L5,50 Z",
        pentagon: "M50,5 L95,38 L78,95 L22,95 L5,38 Z",
        hexagon: "M25,10 L75,10 L95,50 L75,90 L25,90 L5,50 Z",
        octagon: "M30,10 L70,10 L90,30 L90,70 L70,90 L30,90 L10,70 L10,30 Z",
        heart: "M50,30 A20,20 0 0,1 90,30 Q90,60 50,90 Q10,60 10,30 A20,20 0 0,1 50,30 Z",
        diamond: "M50,5 L95,50 L50,95 L5,50 Z",
        star: "M50,5 L61,35 L95,35 L68,55 L78,90 L50,70 L22,90 L32,55 L5,35 L39,35 Z"
    };

    const bgFillId = `shape-bg-${block.id}`;
    let bgProps = {};
    if (background.type === 'solid') {
      bgProps = { fill: background.color1 };
    } else {
      bgProps = { fill: `url(#${bgFillId})` };
    }

    function hexToRgba(hex: string, opacity: number) {
        if (!hex) return `rgba(0,0,0, ${opacity / 100})`;
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity / 100})` : `rgba(0,0,0, ${opacity / 100})`;
    }
    
    function getShadowFilter() {
        const color = hexToRgba(shadow.color, shadow.opacity);
        const shadowBlur = 6;
        let finalFilter = ``;

        if (shadow.position === 'around') {
            finalFilter = `drop-shadow(0 4px ${shadowBlur}px ${color}) drop-shadow(0 -4px ${shadowBlur}px ${color}) drop-shadow(4px 0 ${shadowBlur}px ${color}) drop-shadow(-4px 0 ${shadowBlur}px ${color})`;
        } else {
             let offsets = { x: 0, y: 0 };
             switch (shadow.position) {
                case 'bottom': offsets = { x: 0, y: 4 }; break;
                case 'top': offsets = { x: 0, y: -4 }; break;
                case 'right': offsets = { x: 4, y: 0 }; break;
                case 'left': offsets = { x: -4, y: 0 }; break;
            }
            finalFilter = `drop-shadow(${offsets.x}px ${offsets.y}px ${shadowBlur}px ${color})`;
        }
        
        return finalFilter;
    }
    
    const wrapperStyle: React.CSSProperties = {
        width: `${size}%`,
        margin: 'auto',
        filter: blur > 0 ? `blur(${blur}px)`: 'none',
    };
    
    const svgStyle: React.CSSProperties = {
      filter: getShadowFilter(),
      overflow: 'visible', // To prevent clipping shadows
    }

    return (
      <div style={wrapperStyle}>
        <svg viewBox="0 0 100 100" className="w-full h-full" style={svgStyle}>
          <defs>
              {background.type === 'gradient' && background.direction === 'radial' ? (
                  <radialGradient id={bgFillId}>
                      <stop offset="0%" stopColor={background.color1} />
                      <stop offset="100%" stopColor={background.color2} />
                  </radialGradient>
              ) : background.type === 'gradient' ? (
                  <linearGradient id={bgFillId} gradientTransform={background.direction === 'horizontal' ? 'rotate(90)' : 'rotate(0)'}>
                      <stop offset="0%" stopColor={background.color1} />
                      <stop offset="100%" stopColor={background.color2} />
                  </linearGradient>
              ) : null}
          </defs>
          <path d={shapePaths[shape]} {...bgProps} />
        </svg>
      </div>
    );
  };
  ShapesComponent.displayName = 'ShapesComponent';

  const GifComponent = ({ block }: { block: GifBlock }) => {
    const { url, alt, styles } = block.payload;
    const { size, scale, positionX, positionY, borderRadius, border } = styles;

    const outerWrapperStyle: React.CSSProperties = {
        width: `${size}%`,
        margin: 'auto',
        padding: '8px',
    };
    
    const borderWrapperStyle: React.CSSProperties = {
        padding: `${border.width}px`,
        borderRadius: `${borderRadius}px`,
    };

    if (border.width > 0) {
        if (border.type === 'solid') {
            borderWrapperStyle.backgroundColor = border.color1;
        } else if (border.type === 'gradient') {
            const { direction, color1, color2 } = border;
            const angle = direction === 'horizontal' ? 'to right' : 'to bottom';
            borderWrapperStyle.background = direction === 'radial'
                ? `radial-gradient(circle, ${color1}, ${color2})`
                : `linear-gradient(${angle}, ${color1}, ${color2})`;
        }
    }

    const innerWrapperStyle: React.CSSProperties = {
        width: '100%',
        paddingBottom: '75%', // 4:3 Aspect Ratio
        position: 'relative',
        overflow: 'hidden',
        borderRadius: `${Math.max(0, borderRadius - border.width)}px`,
        backgroundColor: 'hsl(var(--muted))'
    };

    const imageStyle: React.CSSProperties = {
      position: "absolute",
      width: `${scale * 100}%`,
      height: "auto",
      maxWidth: "none",
      top: `${positionY}%`,
      left: `${positionX}%`,
      transform: `translate(-${positionX}%, -${positionY}%)`,
    };

    return (
      <div style={outerWrapperStyle}>
        <div style={borderWrapperStyle}>
          <div style={innerWrapperStyle}>
            <img src={url} alt={alt} style={imageStyle} />
          </div>
        </div>
      </div>
    );
  };
  GifComponent.displayName = "GifComponent";

  const renderPrimitiveBlock = (
    block: PrimitiveBlock,
    rowId: string,
    colId: string,
    colCount: number
  ) => {
    const isSelected =
      selectedElement?.type === "primitive" &&
      selectedElement.primitiveId === block.id;

    const onSelect = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedElement({
        type: "primitive",
        primitiveId: block.id,
        columnId: colId,
        rowId,
      });
    };

    let content: React.ReactNode = (
      <div className="p-2 border border-dashed rounded-md text-xs text-muted-foreground">
        Block: {block.type}
      </div>
    );

    // heading
    if (block.type === "heading") {
      const headingBlock = block as HeadingBlock;
      const { textAlign, ...textStyles } = getHeadingStyle(headingBlock);
      content = (
        <div style={{ textAlign: textAlign as TextAlign }}>
          <span style={textStyles}>{headingBlock.payload.text}</span>
        </div>
      );
    }

    // text
    else if (block.type === "text") {
      const textBlock = block as TextBlock;
      const safeGlobalStyles =
        textBlock.payload.globalStyles || { textAlign: "left", fontSize: 16 };
      content = (
        <p
          style={{
            padding: "8px",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            textAlign: safeGlobalStyles.textAlign,
            fontSize: `${safeGlobalStyles.fontSize}px`,
          }}
        >
          {textBlock.payload.fragments?.map(fragment => {
            const El = fragment.link ? "a" : "span";
            const props = fragment.link
              ? {
                  href: fragment.link.url,
                  target: fragment.link.openInNewTab ? "_blank" : "_self",
                  rel: "noopener noreferrer",
                  style: {
                    color: "hsl(var(--primary))",
                    textDecoration: "underline",
                  },
                }
              : {};
            return (
              <El key={fragment.id} {...props}>
                <span style={getFragmentStyle(fragment)}>{fragment.text}</span>
              </El>
            );
          })}
        </p>
      );
    }

    // image
    else if (block.type === "image") {
      const imageBlock = block as ImageBlock;
      const { url, alt, styles, link } = imageBlock.payload;
      const { size, borderRadius, zoom, positionX, positionY, border } = styles;

      const outerWrapperStyle: React.CSSProperties = {
        width: `${size}%`,
        margin: "auto",
        padding: "8px",
      };

      const borderWrapperStyle: React.CSSProperties = {
        padding: `${border.width}px`,
        borderRadius: `${borderRadius}px`,
      };

      if (border.width > 0) {
        if (border.type === "solid") {
          borderWrapperStyle.backgroundColor = border.color1;
        } else if (border.type === "gradient") {
          const { direction, color1, color2 } = border;
          const angle = direction === "horizontal" ? "to right" : "to bottom";
          borderWrapperStyle.background =
            direction === "radial"
              ? `radial-gradient(circle, ${color1}, ${color2})`
              : `linear-gradient(${angle}, ${color1}, ${color2})`;
        }
      }

      const imageContainerStyle: React.CSSProperties = {
        borderRadius: `${Math.max(0, borderRadius - border.width)}px`,
        overflow: "hidden",
        height: 0,
        paddingBottom: "75%", // 4:3
        position: "relative",
      };

      const imageStyle: React.CSSProperties = {
        position: "absolute",
        width: `${zoom}%`,
        height: "auto",
        maxWidth: "none",
        top: `${positionY}%`,
        left: `${positionX}%`,
        transform: `translate(-${positionX}%, -${positionY}%)`,
        objectFit: "cover",
      };

      const imageElement = (
        <div style={outerWrapperStyle}>
          <div style={borderWrapperStyle}>
            <div style={imageContainerStyle}>
              <img src={url} alt={alt} style={imageStyle} />
            </div>
          </div>
        </div>
      );

      if (link && link.url && link.url !== "#") {
        content = (
          <a
            href={link.url}
            target={link.openInNewTab ? "_blank" : "_self"}
            rel="noopener noreferrer"
            style={{ textDecoration: "none", display: "block" }}
          >
            {imageElement}
          </a>
        );
      } else {
        content = imageElement;
      }
    }

    // emoji-static
    else if (block.type === "emoji-static") {
      const emojiBlock = block as StaticEmojiBlock;
      content = (
        <div style={{ textAlign: emojiBlock.payload.styles.textAlign }}>
          <p style={getStaticEmojiStyle(emojiBlock)}>
            {emojiBlock.payload.emoji}
          </p>
        </div>
      );
    }

    // button
    else if (block.type === "button") {
      const buttonBlock = block as ButtonBlock;
      const buttonElement = (
        <button style={getButtonStyle(buttonBlock)}>
          {buttonBlock.payload.text}
        </button>
      );
      content = (
        <div style={getButtonContainerStyle(buttonBlock)}>
          {buttonBlock.payload.link.url &&
          buttonBlock.payload.link.url !== "#" ? (
            <a
              href={buttonBlock.payload.link.url}
              target={
                buttonBlock.payload.link.openInNewTab ? "_blank" : "_self"
              }
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              {buttonElement}
            </a>
          ) : (
            buttonElement
          )}
        </div>
      );
    }

    // separator
    else if (block.type === "separator") {
      const separatorBlock = block as SeparatorBlock;
      const { payload } = separatorBlock;
      content = (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {payload.style === "invisible" && (
            <div style={{ height: `${payload.height}px` }} />
          )}
          {payload.style === "line" && <LineSeparator block={separatorBlock} />}
          {payload.style === "shapes" && (
            <div
              className="w-full h-full"
              style={{ height: `${payload.height}px` }}
            >
              <ShapesSeparator block={separatorBlock} />
            </div>
          )}
          {payload.style === "dots" && (
            <div
              className="flex justify-around items-center w-full"
              style={{ height: `${payload.height}px` }}
            >
              {Array.from({ length: dots.count }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: `${dots.size}px`,
                    height: `${dots.size}px`,
                    borderRadius: "50%",
                    backgroundColor: dots.color,
                    boxShadow: `0 0 8px ${dots.color}`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      );
    }
    
  else if (block.type === "youtube") {
    const youtubeBlock = block as YouTubeBlock;
    const {
      videoId,
      styles,
      link,
      title,
      showTitle,
      duration,
      showDuration,
    } = youtubeBlock.payload;
    const thumbnailUrl = videoId
      ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      : "https://placehold.co/600x400.png?text=YouTube+Video";

    const playButtonSvg = {
      default: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48"><path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"/><path d="M 45,24 27,14 27,34" fill="#fff"/></svg>`,
      classic: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><path fill-opacity="0.8" fill="#212121" d="M25.8 8.1c-.2-1.5-.9-2.8-2.1-3.9-1.2-1.2-2.5-1.9-4-2.1C16 2 14 2 14 2s-2 0-5.7.2C6.8 2.3 5.4 3 4.2 4.1 3 5.3 2.3 6.7 2.1 8.1 2 10 2 14 2 14s0 4 .1 5.9c.2 1.5.9 2.8 2.1 3.9 1.2 1.2 2.5 1.9 4 2.1 3.7.2 5.7.2 5.7.2s2 0 5.7-.2c1.5-.2 2.8-.9 4-2.1 1.2-1.2 1.9-2.5 2.1-4 .1-1.9.1-5.9.1-5.9s0-4-.1-5.9z"/><path fill="#FFFFFF" d="M11 10v8l7-4z"/></svg>`,
    };

    const sizeVariant =
      colCount === 1 ? "lg" : colCount === 2 ? "md" : colCount === 3 ? "sm" : "xs";
    const playButtonSize = {
      lg: "w-32 h-24",
      md: "w-16 h-12",
      sm: "w-12 h-9",
      xs: "w-12 h-9",
    };

    const titleSize = {
      lg: "text-2xl p-4",
      md: "text-lg p-3",
      sm: "text-sm p-2",
      xs: "text-xs px-2 pt-1 pb-0",
    };
    const durationSize = {
      lg: "text-base",
      md: "text-sm",
      sm: "text-xs",
      xs: "text-xs",
    };

    const formatDuration = () => {
      const { hours, minutes, seconds } = duration;
      const h = parseInt(hours || "0", 10);
      const m = parseInt(minutes || "0", 10);
      const s = parseInt(seconds || "0", 10);

      if (isNaN(h) && isNaN(m) && isNaN(s)) return null;

      const parts = [];
      if (h > 0) parts.push(h.toString());
      if (h > 0 || m > 0) {
        parts.push(m.toString().padStart(h > 0 ? 2 : 1, "0"));
      }
      if (s > 0 || m > 0 || h > 0) {
        parts.push(s.toString().padStart(2, "0"));
      }

      if (parts.length === 0) return null;
      if (parts.length === 1 && m > 0) return `0:${parts[0].padStart(2, "0")}`;
      if (parts.length === 1) return `0:0${parts[0]}`;

      return parts.join(":");
    };
    const displayDuration = showDuration ? formatDuration() : null;

    const { border } = styles;
    let borderStyle: React.CSSProperties = {};
    if (border.type === "solid") {
      borderStyle.background = border.color1;
    } else if (border.type === "gradient") {
      if (border.direction === "radial") {
        borderStyle.background = `radial-gradient(${border.color1}, ${border.color2})`;
      } else {
        const angle = border.direction === "horizontal" ? "to right" : "to bottom";
        borderStyle.background = `linear-gradient(${angle}, ${border.color1}, ${border.color2})`;
      }
    }

    return (
      <div className="p-2 w-full h-full">
        <div
          style={{
            ...borderStyle,
            borderRadius: `${styles.borderRadius}px`,
            padding: `${styles.borderWidth}px`,
          }}
          className="w-full h-full"
        >
          <div
            className="w-full h-full relative aspect-video bg-black/5"
            style={{
              borderRadius: `${
                styles.borderRadius > 0 ? styles.borderRadius - styles.borderWidth : 0
              }px`,
              overflow: "hidden",
            }}
          >
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {showTitle && title && (
              <div
                className={cn(
                  "absolute top-0 left-0 w-full text-white bg-gradient-to-b from-black/60 to-transparent pointer-events-none",
                  titleSize[sizeVariant]
                )}
              >
                <p className="font-semibold truncate">{title}</p>
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center z-10">
              <a
                href={link.url && videoId ? link.url : undefined}
                target={
                  link.url && videoId ? (link.openInNewTab ? "_blank" : "_self") : undefined
                }
                rel="noopener noreferrer"
                className={cn(
                  "block bg-center bg-no-repeat bg-contain transition-transform hover:scale-110",
                  playButtonSize[sizeVariant],
                  link.url && videoId ? "cursor-pointer" : "cursor-default"
                )}
                style={{
                  backgroundImage: `url('data:image/svg+xml;base64,${btoa(
                    playButtonSvg[styles.playButtonType]
                  )}')`,
                }}
                onClick={e => {
                  if (!link.url || !videoId) e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <span className="sr-only">Play Video</span>
              </a>
            </div>

            {displayDuration && (
              <div
                className={cn(
                  "absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white font-mono rounded-md pointer-events-none",
                  durationSize[sizeVariant]
                )}
              >
                {displayDuration}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

    // timer
    else if (block.type === "timer") {
      const timerBlock = block as TimerBlock;
      return <TimerComponent payload={timerBlock.payload} />;
    }
      
  // rating
    else if (block.type === "rating") {
      const ratingBlock = block as RatingBlock;
      const { styles } = ratingBlock.payload;
      const StarComponent = {
          pointed: PointedStar,
          universo: UniversoStar,
          moderno: ModernoStar,
      }[styles.starStyle] || PointedStar;

      const fullStars = Math.floor(ratingBlock.payload.rating);
      const halfStar = ratingBlock.payload.rating % 1 !== 0;

      return (
          <div style={{ display: 'flex', justifyContent: styles.alignment, gap: `${styles.spacing}px`, padding: `${styles.paddingY}px 8px` }}>
              {Array.from({ length: 5 }).map((_, i) => (
                  <StarComponent key={i} size={styles.starSize} fill={i < fullStars ? styles.filled.color1 : styles.unfilled.color1} stroke={styles.border.color1} strokeWidth={styles.border.width} />
              ))}
          </div>
      )
    }
      
  // switch
    else if (block.type === "switch") {
      return <SwitchComponent block={block as SwitchBlock} />;
    }
      
  // shapes
    else if (block.type === "shapes") {
      return <ShapesComponent block={block as ShapesBlock} />;
    }
      
  // gif
    else if (block.type === "gif") {
      return <GifComponent block={block as GifBlock} />;
    }
    
  return (
      <div
        key={block.id}
        className={cn(
          "group/primitive relative w-full overflow-hidden",
          isSelected &&
            "ring-2 ring-accent ring-offset-2 ring-offset-card rounded-md"
        )}
        onClick={onSelect}
      >
        {content}
      </div>
    );
  };
    
    const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
      setCanvasContent(prev => {
          const newCanvasContent = [...prev];
          const item = newCanvasContent.splice(index, 1)[0];
          const newIndex = direction === 'up' ? index - 1 : index + 1;
          newCanvasContent.splice(newIndex, 0, item);
          return newCanvasContent;
      }, true);
    };
  
    const handleSaveTemplateName = () => {
      if (tempTemplateName.trim() === '') {
          toast({
              title: 'Nombre requerido',
              description: 'Por favor, dale un nombre a tu plantilla.',
              variant: 'destructive',
          });
          return;
      }
      setTemplateName(tempTemplateName);
      setIsEditNameModalOpen(false);
      if(isInitialNameModalOpen){
          setIsInitialNameModalOpen(false);
          handlePublish(selectedCategories);
      } else {
          handlePublish();
      }
    };
    
    // --- Wrapper Resize Logic ---
    const handleMouseDownResize = (e: React.MouseEvent, wrapperId: string) => {
      e.preventDefault();
      setIsResizing(true);
      setResizingWrapperId(wrapperId);
    };
    
    const handleMouseMoveResize = useCallback((e: MouseEvent) => {
      if (isResizing && resizingWrapperId) {
        const wrapperElement = document.getElementById(resizingWrapperId);
        if(wrapperElement){
          const newHeight = e.clientY - wrapperElement.getBoundingClientRect().top;
          setCanvasContent(prev => prev.map(block => {
            if (block.id === resizingWrapperId && block.type === 'wrapper') {
              return {
                ...block,
                payload: { ...block.payload, height: Math.max(50, newHeight) } // min height 50
              };
            }
            return block;
          }), false);
        }
      }
    }, [isResizing, resizingWrapperId, setCanvasContent]);
    
    const handleMouseUpResize = useCallback(() => {
      if (isResizing) {
          setIsResizing(false);
          setResizingWrapperId(null);
          // Record history on mouse up
          setCanvasContent(prev => [...prev], true);
      }
    }, [isResizing, setCanvasContent]);
    
    const handleOpenCopyModal = (emoji: string) => {
      setIsCopySuccessModalOpen(true);
    };
  
    useEffect(() => {
      if (isResizing) {
        document.addEventListener('mousemove', handleMouseMoveResize);
        document.addEventListener('mouseup', handleMouseUpResize);
      } else {
        document.removeEventListener('mousemove', handleMouseMoveResize);
        document.removeEventListener('mouseup', handleMouseUpResize);
      }
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveResize);
        document.removeEventListener('mouseup', handleMouseUpResize);
      };
    }, [isResizing, handleMouseMoveResize, handleMouseUpResize]);
  
    useEffect(() => {
      setTempTemplateName(templateName);
    }, [isEditNameModalOpen, templateName]);
  
    const viewportClasses = {
      desktop: 'max-w-4xl', 
      tablet: 'max-w-xl',  
      mobile: 'max-w-sm', 
    };
    
    const getElementStyle = (element: ColumnsBlock | WrapperBlock | Column) => {
      const styles = 'payload' in element && 'styles' in element.payload ? element.payload.styles : 'styles' in element ? element.styles : {};
      const { background, borderRadius, backgroundImage } = styles || {};
  
      const style: React.CSSProperties = {};
  
      if (borderRadius !== undefined) {
        style.borderRadius = `${borderRadius}px`;
      }
      
      // Set background color first
      if (background) {
        const { type, color1, color2, direction } = background;
        if (type === 'solid') {
          style.backgroundColor = color1;
        } else if (type === 'gradient') {
          if (direction === 'radial') {
            style.backgroundImage = `radial-gradient(${color1}, ${color2})`;
          } else {
            const angle = direction === 'horizontal' ? 'to right' : 'to bottom';
            style.backgroundImage = `linear-gradient(${angle}, ${color1}, ${color2})`;
          }
        }
      }
      
      // Override with background image if it exists
      if (backgroundImage && backgroundImage.url) {
        style.backgroundImage = `url(${backgroundImage.url})`,
        style.backgroundSize = backgroundImage.fit === 'auto' ? `${backgroundImage.zoom}%` : backgroundImage.fit,
        style.backgroundPosition = `${backgroundImage.positionX}% ${backgroundImage.positionY}%`,
        style.backgroundRepeat = 'no-repeat'
      }
      
      return style;
    };
    
    const handleOpenBgImageModal = useCallback(() => {
      if (selectedElement?.type === 'wrapper') {
        setIsBgImageModalOpen(true);
      }
    }, [selectedElement]);
  
    const handleApplyBackgroundImage = useCallback((newState?: WrapperStyles['backgroundImage']) => {
        if (selectedElement?.type !== 'wrapper') return;
        const wrapperId = selectedElement.wrapperId;
  
        setCanvasContent(prev => prev.map(row => {
            if (row.id === wrapperId && row.type === 'wrapper') {
                const currentStyles = row.payload.styles || {};
                const newPayload = { ...row.payload, styles: { ...currentStyles, backgroundImage: newState } };
                return { ...row, payload: newPayload };
            }
            return row;
        }), true);
        setIsBgImageModalOpen(false);
    }, [selectedElement, setCanvasContent]);
  
    const WrapperComponent = React.memo(({ block, index }: { block: WrapperBlock, index: number }) => {
        const wrapperRef = useRef<HTMLDivElement>(null);
  
        useEffect(() => {
            wrapperRefs.current[block.id] = wrapperRef.current;
        }, [block.id]);
        
        const handleWrapperClick = (e: React.MouseEvent) => {
          const target = e.target as HTMLElement;
          if (target.closest('.interactive-primitive')) return;
  
          setActionTargetWrapperId(block.id);
  
          const containerElement = target.closest('.group\\/wrapper');
          if (containerElement) {
              const rect = containerElement.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              setClickPosition({ x, y });
          } else {
              setClickPosition({ x: 50, y: 50 }); // Fallback
          }
  
          setIsActionSelectorModalOpen(true);
      };
  
        return (
          <div 
            key={block.id} 
            className="group/row relative"
          >
            <div className="absolute top-1/2 -left-8 -translate-y-1/2 flex flex-col items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity bg-card p-1.5 rounded-md border shadow-md z-10">
                <Button variant="ghost" size="icon" className="size-6" disabled={index === 0} onClick={() => handleMoveBlock(index, 'up')}>
                    <ArrowUp className="size-4" />
                </Button>
                <GripVertical className="size-5 text-muted-foreground cursor-grab" />
                <Button variant="ghost" size="icon" className="size-6" disabled={index === canvasContent.length - 1} onClick={() => handleMoveBlock(index, 'down')}>
                    <ArrowDown className="size-4" />
                </Button>
            </div>
      
             <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 -right-8 size-7 opacity-0 group-hover/row:opacity-100 transition-opacity z-10"
                onClick={() => promptDeleteItem(block.id)}
              >
                <Trash2 className="size-4" />
              </Button>
      
            <div
              id={block.id}
              ref={wrapperRef}
              className="group/wrapper relative border-2 border-dashed border-purple-500 overflow-hidden" 
              style={{ height: `${block.payload.height}px`, ...getElementStyle(block.payload.styles) }}
              onClick={handleWrapperClick}
            >
              <div className="w-full h-full relative">
                {block.payload.blocks.map((b, bIndex) => {
                    const isSelected = selectedElement?.type === 'wrapper-primitive' && selectedElement.primitiveId === b.id;
                    
                    const commonStyles: React.CSSProperties = {
                         left: `${b.payload.x}%`,
                         top: `${b.payload.y}%`,
                         transform: `translate(-50%, -50%) scale(${b.payload.scale || 1}) rotate(${b.payload.rotate || 0}deg)`,
                         zIndex: bIndex,
                    };
                    
                    if (b.type === 'emoji-interactive') {
                      return (
                          <div
                            key={b.id}
                            className={cn(
                              "interactive-primitive absolute text-4xl cursor-pointer select-none", 
                              isSelected ? "ring-2 ring-accent z-10 p-2" : ""
                            )}
                            style={{
                               ...commonStyles,
                               fontSize: '48px',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedElement({ type: 'wrapper-primitive', primitiveId: b.id, wrapperId: block.id });
                            }}
                          >
                           {b.payload.emoji}
                          </div>
                      )
                    } else if (b.type === 'heading-interactive') {
                      const headingBlock = b as InteractiveHeadingBlock;
                      const style = getHeadingStyle(headingBlock);
                      
                      return (
                          <div
                            key={b.id}
                            className={cn(
                              "interactive-primitive absolute cursor-pointer select-none",
                              isSelected ? "ring-2 ring-accent z-10" : ""
                            )}
                            style={commonStyles}
                             onClick={(e) => {
                              e.stopPropagation();
                              setSelectedElement({ type: 'wrapper-primitive', primitiveId: b.id, wrapperId: block.id });
                            }}
                          >
                              <div style={{ textAlign: 'center', display: 'inline-block', whiteSpace: 'nowrap' }}>
                                  <span style={style}>
                                    {headingBlock.payload.text}
                                  </span>
                              </div>
                          </div>
                      )
                    }
                    return null;
                })}
              </div>
              <div 
                 onMouseDown={(e) => handleMouseDownResize(e, block.id)}
                 className="absolute bottom-0 left-0 w-full h-4 flex items-center justify-center cursor-ns-resize z-20 group"
              >
                   <div className="w-24 h-2 rounded-full bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 group-hover:from-primary/80 group-hover:via-accent/80 group-hover:to-primary/80 transition-all flex items-center justify-center">
                      <ChevronsUpDown className="size-4 text-white/50 group-hover:text-white/80 transition-colors"/>
                  </div>
              </div>
            </div>
          </div>
        );
      });
      WrapperComponent.displayName = 'WrapperComponent';
  
    const renderCanvasBlock = (block: CanvasBlock, index: number) => {
      if (block.type === 'wrapper') {
          return <WrapperComponent key={block.id} block={block} index={index} />;
      }
      
      const blockId = block.id;
      const { columns } = block.payload;
  
      return (
          <div 
              key={block.id} 
              id={block.id}
              className="group/row relative"
          >
          <div className="absolute top-1/2 -left-8 -translate-y-1/2 flex flex-col items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity bg-card p-1.5 rounded-md border shadow-md z-10">
              <Button variant="ghost" size="icon" className="size-6" disabled={index === 0} onClick={() => handleMoveBlock(index, 'up')}>
                  <ArrowUp className="size-4" />
              </Button>
              <GripVertical className="size-5 text-muted-foreground cursor-grab" />
              <Button variant="ghost" size="icon" className="size-6" disabled={index === canvasContent.length - 1} onClick={() => handleMoveBlock(index, 'down')}>
                  <ArrowDown className="size-4" />
              </Button>
          </div>
  
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 -right-8 size-7 opacity-0 group-hover/row:opacity-100 transition-opacity z-10"
            onClick={() => promptDeleteItem(block.id)}
          >
            <Trash2 className="size-4" />
          </Button>
          
          {block.type === 'columns' && (
              <div className="flex w-full relative">
                {block.payload.columns.map((col) => (
                  <React.Fragment key={col.id}>
                      <div 
                          style={{ ...getElementStyle(col), flexBasis: `${col.width}%` }}
                          className={cn(
                            "flex-grow p-2 border-2 border-dashed min-h-[100px] flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors min-w-0 group/column",
                            selectedElement?.type === 'column' && selectedElement.columnId === col.id ? 'border-primary border-solid' : 'border-transparent'
                          )}
                           onClick={(e) => { e.stopPropagation(); setSelectedElement({type: 'column', columnId: col.id, rowId: block.id})}}
                      >
                         {col.blocks.length > 0 ? (
                             <div className="flex flex-col gap-2 w-full">
                                 {col.blocks.map(b => renderPrimitiveBlock(b, block.id, col.id, columns.length))}
                                 <Button variant="outline" size="sm" className="w-full mt-2" onClick={(e) => { e.stopPropagation(); handleOpenBlockSelector(col.id, 'column', e); }}><PlusCircle className="mr-2"/>Añadir</Button>
                             </div>
                         ) : (
                           <Button variant="outline" size="sm" className="h-auto py-2 px-4 flex flex-col" onClick={(e) => { e.stopPropagation(); handleOpenBlockSelector(col.id, 'column', e); }}>
                             <PlusCircle className="mb-1"/>
                             <span className="text-xs font-medium -mb-0.5">Añadir</span>
                             <span className="text-xs font-medium">Bloque</span>
                           </Button>
                         )}
                      </div>
                  </React.Fragment>
                ))}
              </div>
          )}
          </div>
      );
    }
  
    const StyleEditorHeader = () => {
      if (!selectedElement) return null;
  
      let blockName = '';
      const blockType = getSelectedBlockType(selectedElement, canvasContent);
      
      if (blockType) {
          if (blockType === 'columns') {
               return (
                  <div className="mb-4">
                      <Button className="w-full bg-gradient-to-r from-[#1700E6] to-[#009AFF] text-white">
                          Configura tu columna
                      </Button>
                  </div>
              );
          }
  
          const foundBlock = [...columnContentBlocks, ...wrapperContentBlocks, ...mainContentBlocks].find(b => b.id === blockType);
          if (foundBlock) {
               blockName = `Bloque ${foundBlock.name.toLowerCase()}`;
          } else if (blockType === 'wrapper') {
              blockName = 'Contenedor';
          }
      }
  
      const handleDelete = () => {
          switch (selectedElement.type) {
              case 'column':
                  promptDeleteItem(selectedElement.rowId);
                  break;
              case 'wrapper':
                  promptDeleteItem(selectedElement.wrapperId);
                  break;
              case 'primitive':
                  promptDeleteItem(selectedElement.rowId, selectedElement.columnId, selectedElement.primitiveId);
                  break;
              case 'wrapper-primitive':
                  promptDeleteItem(selectedElement.wrapperId, undefined, selectedElement.primitiveId);
                  break;
          }
      };
      
      if (!blockName) return null;
  
      return (
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={handleDelete}
            className="w-full justify-between text-[#F00000] border-[#F00000] hover:bg-[#F00000] hover:text-white dark:text-foreground dark:hover:text-white dark:hover:bg-[#F00000] dark:border-[#F00000]"
          >
            <span className="capitalize">{blockName}</span>
            <Trash2 className="size-4" />
          </Button>
        </div>
      );
  };
  
  const LayerPanel = () => {
      const { toast } = useToast();
      const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  
      const selectedWrapper = canvasContent.find(
        (block): block is WrapperBlock =>
          block.type === 'wrapper' &&
          ((selectedElement?.type === 'wrapper' && block.id === selectedElement.wrapperId) ||
            (selectedElement?.type === 'wrapper-primitive' && block.id === selectedElement.wrapperId))
      );
  
      const reorderLayers = (wrapperId: string, fromIndex: number, toIndex: number) => {
          if (!selectedWrapper || toIndex < 0 || toIndex >= selectedWrapper.payload.blocks.length) return;
  
          setCanvasContent(prev => prev.map(row => {
              if (row.id === wrapperId && row.type === 'wrapper') {
                  const newBlocks = Array.from(row.payload.blocks);
                  const [movedItem] = newBlocks.splice(fromIndex, 1);
                  newBlocks.splice(toIndex, 0, movedItem);
                  return { ...row, payload: { ...row.payload, blocks: newBlocks } };
              }
              return row;
          }), true);
      };
  
      const handleRename = (blockId: string, newName: string) => {
          if (!selectedWrapper) return;
          
          if (newName.length > 20) {
              toast({
                  title: "Límite de caracteres excedido",
                  description: "El nombre no puede exceder los 20 caracteres.",
                  variant: 'destructive',
              });
              return;
          }
  
          const trimmedName = newName.trim();
          if (trimmedName === '') {
              setEditingBlockId(null);
              return;
          }
  
          const isNameTaken = selectedWrapper.payload.blocks.some(b => b.id !== blockId && b.payload.name === trimmedName);
  
          if (isNameTaken) {
               toast({
                  title: "¡Nombre en uso!",
                  description: "Cada capa debe tener un identificador único en el lienzo. Por favor, elige otro nombre.",
                  variant: 'destructive',
                  style: { backgroundColor: '#F00000', color: 'white' }
              });
              return;
          }
  
          setCanvasContent(prev => prev.map(row => {
              if (row.id === selectedWrapper.id && row.type === 'wrapper') {
                  const newBlocks = row.payload.blocks.map(block => {
                      if (block.id === blockId) {
                          return { ...block, payload: { ...block.payload, name: trimmedName } };
                      }
                      return block;
                  });
                  return { ...row, payload: { ...row.payload, blocks: newBlocks } };
              }
              return row;
          }), true);
          setEditingBlockId(null);
      }
      
      if (!selectedWrapper) {
          return (
              <div className="text-center text-muted-foreground p-4 text-sm">
                  Selecciona un Contenedor Flexible en el lienzo para ver sus capas.
              </div>
          );
      }
      
      const blocksInVisualOrder = [...selectedWrapper.payload.blocks].reverse();
  
      return (
          <div className="p-2 space-y-2">
               <div className="px-2 pb-2 text-center">
                   <h3 className="font-semibold flex items-center justify-center gap-2"><Shapes className="text-primary"/>Contenedor Flexible</h3>
                   <p className="text-xs text-muted-foreground mt-1">Gestiona el posicionamiento de tus bloques de contenido, asigna niveles de prioridad para definir qué bloques al frente y cuáles quedan atrás</p>
               </div>
               <div className="space-y-1">
                  {blocksInVisualOrder.map((block, visualIndex) => {
                      const originalIndex = selectedWrapper.payload.blocks.length - 1 - visualIndex;
                      const Icon = wrapperContentBlocks.find(b => b.id === block.type)?.icon || Smile;
                      const isSelected = selectedElement?.type === 'wrapper-primitive' && selectedElement.primitiveId === block.id;
  
                      return (
                          <div
                              key={block.id}
                              className={cn(
                                "group/layer-item relative overflow-hidden rounded-lg p-2 transition-colors cursor-pointer border border-transparent",
                                isSelected ? "bg-primary/20 border-primary/50" : "hover:bg-muted/50"
                              )}
                              onClick={() => {
                                  if (isSelected) {
                                      setSelectedElement({ type: 'wrapper', wrapperId: selectedWrapper.id });
                                  } else {
                                      setSelectedElement({ type: 'wrapper-primitive', primitiveId: block.id, wrapperId: selectedWrapper.id });
                                  }
                              }}
                          >
                               <div className="flex items-center gap-3">
                                  <div className="p-1.5 bg-muted rounded-md">
                                      <Icon className="size-4 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                  {editingBlockId === block.id ? (
                                      <Input 
                                          defaultValue={block.payload.name}
                                          onBlur={(e) => handleRename(block.id, e.target.value)}
                                          onKeyDown={(e) => { if (e.key === 'Enter') handleRename(block.id, e.currentTarget.value) }}
                                          autoFocus
                                          maxLength={20}
                                          className="h-7 text-sm flex-1"
                                      />
                                  ) : (
                                      <div className="flex-1 min-w-0">
                                         <p className="text-sm font-medium truncate">{block.payload.name}</p>
                                      </div>
                                  )}
                                  </div>
                              </div>
                              
                              <div className={cn("pl-9 pt-2 mt-2 border-t border-border/10", isSelected ? "block" : "hidden group-hover/layer-item:block")}>
                                  <div className="flex items-center justify-between gap-2">
                                       <p className="text-xs text-muted-foreground">Acciones</p>
                                       <div className="flex items-center gap-2">
                                          <button
                                              onClick={(e) => { e.stopPropagation(); setEditingBlockId(block.id) }}
                                              className="group/button size-7 flex items-center justify-center rounded-md bg-zinc-700/50 hover:bg-cyan-400/80 border border-cyan-400/30 hover:border-cyan-300 transition-all"
                                          >
                                              <Pencil className="size-4 text-cyan-300 group-hover/button:text-white transition-colors"/>
                                          </button>
                                          <div className="flex flex-col gap-0.5">
                                              <button 
                                                  onClick={(e) => {e.stopPropagation(); reorderLayers(selectedWrapper.id, originalIndex, originalIndex + 1)}} disabled={originalIndex === selectedWrapper.payload.blocks.length - 1}
                                                  className="group/button size-6 flex items-center justify-center rounded-md bg-zinc-700/50 hover:bg-green-400/80 border border-green-400/30 hover:border-green-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                              >
                                                  <ChevronUp className="size-4 text-green-300 group-hover/button:text-white transition-colors"/>
                                              </button>
                                              <button 
                                                  onClick={(e) => {e.stopPropagation(); reorderLayers(selectedWrapper.id, originalIndex, originalIndex - 1)}} disabled={originalIndex === 0}
                                                  className="group/button size-6 flex items-center justify-center rounded-md bg-zinc-700/50 hover:bg-green-400/80 border border-green-400/30 hover:border-green-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                              >
                                                  <ChevronDown className="size-4 text-green-300 group-hover/button:text-white transition-colors"/>
                                              </button>
                                          </div>
                                       </div>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
               </div>
          </div>
      );
    }

  const handleCategoryToggle = (category: string, checked: boolean) => {
    if (checked) {
        setSelectedCategories(prev => [...prev, category]);
    } else {
        setSelectedCategories(prev => prev.filter(c => c !== category));
    }
  };

  const handleAddNewCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !allCategories.includes(trimmed)) {
        setAllCategories(prev => [...prev, trimmed].sort());
        setSelectedCategories(prev => [...prev, trimmed]);
        setNewCategory('');
    } else if (trimmed) {
        toast({ title: 'Categoría existente', description: 'Esta categoría ya existe.', variant: 'default' });
    }
  };

  if (isLoading) {
      return <Preloader />
  }

  return (
    <div className="flex h-screen max-h-screen bg-transparent text-foreground overflow-hidden">
        <LoadingModal isOpen={!!loadingAction} variant={loadingAction as any} />
      <aside className="w-40 border-r border-r-black/10 dark:border-border/20 flex flex-col bg-card/5">
        <header className="flex items-center justify-between p-4 border-b bg-card/5 border-border/20 backdrop-blur-sm h-[61px] z-10 shrink-0">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-lg font-semibold truncate flex-1">{templateName}</span>
              <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => setIsEditNameModalOpen(true)}>
                <Pencil className="size-4" />
              </Button>
          </div>
        </header>
        <div className="p-2 space-y-2 flex-1 flex flex-col">
            <Dialog open={isColumnModalOpen} onOpenChange={setIsColumnModalOpen}>
              <DialogTrigger asChild>
                 <Card 
                  className="group bg-card/5 border-black/20 dark:border-border/20 flex flex-col items-center justify-center p-2 cursor-pointer transition-all hover:bg-primary/10 hover:border-black/50 dark:hover:border-primary/50 hover:shadow-lg"
                 >
                  <Columns className="size-8 text-[#00B0F0] transition-colors" />
                  <span className="text-sm font-semibold text-center text-foreground/80 mt-2">Columns</span>
                  <span className="text-xs font-medium text-center text-muted-foreground">1 - 4</span>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl bg-card/80 backdrop-blur-sm">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><LayoutGrid className="text-primary"/>Seleccionar Estructura de Columnas</DialogTitle>
                    <DialogDescription>
                      Elige cuántas secciones de columnas quieres añadir a tu plantilla. Podrás arrastrar contenido a cada sección.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    {columnOptions.map(option => (
                      <button
                        key={option.num}
                        onClick={() => handleAddColumns(option.num)}
                        className={cn(
                          "w-full p-2 border-2 rounded-lg transition-all flex items-center gap-4 relative",
                          "bg-card/50 hover:bg-primary/10 hover:border-primary/50"
                        )}
                      >
                         <div className="flex items-center justify-center p-3 bg-muted rounded-md">
                           <Box className="text-primary size-7" />
                        </div>
                         <div className="flex-1 text-left">
                          <p className="font-semibold">{option.num} {option.num > 1 ? 'Columnas' : 'Columna'}</p>
                          <div className="mt-2">
                            <option.icon />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
              </DialogContent>
            </Dialog>
            {mainContentBlocks.slice(1).map(block => (
               <Card 
                key={block.id} 
                onClick={() => handleBlockClick(block.id as BlockType)}
                className="group bg-card/5 border-black/20 dark:border-border/20 flex flex-col items-center justify-center p-4 aspect-square cursor-pointer transition-all hover:bg-primary/10 hover:border-black/50 dark:hover:border-primary/50 hover:shadow-lg"
              >
                <block.icon className="size-8 text-[#00B0F0] transition-colors" />
                <span className="text-sm font-semibold text-center text-foreground/80 mt-2">{block.name}</span>
                 {block.id === 'columns' && <span className="text-xs font-medium text-center text-muted-foreground">1 - 4</span>}
              </Card>
            ))}
            <div className="mt-auto pb-2 space-y-2">
                <div className="relative w-[calc(100%-1rem)] mx-auto h-[3px] my-2 overflow-hidden bg-muted/10 rounded-full">
                    <div className="tech-scanner" />
                </div>
                <button
                  onClick={() => setIsConfirmExitModalOpen(true)}
                  className="group relative inline-flex w-full flex-col items-center justify-center overflow-hidden rounded-lg p-3 text-sm font-semibold text-white transition-all duration-300 ai-core-button"
                >
                  <div className="ai-core-border-animation"></div>
                  <div className="ai-core"></div>
                  <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
                      <LayoutDashboard className="size-7" />
                      <span className="mt-1 text-xs font-bold text-center">Regresar al Menú Principal</span>
                  </div>
              </button>
            </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between p-2 border-b bg-card/5 border-border/20 backdrop-blur-sm h-[61px] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleUndo} disabled={historyIndex === 0}><Undo/></Button>
            <Button variant="ghost" size="icon" onClick={handleRedo} disabled={historyIndex >= history.length - 1}><Redo/></Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-black/10 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                <Cloud className="size-4 text-green-400"/>
                <span>{lastSaved ? `Guardado a las ${format(lastSaved, 'HH:mm')}` : 'Sin guardar'}</span>
            </div>
            <TooltipProvider>
              <div className="flex items-center gap-2 p-1 bg-card/10 rounded-lg border border-border/20">
                  <Tooltip>
                      <TooltipTrigger asChild><Button variant={viewport === 'desktop' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewport('desktop')}><Laptop/></Button></TooltipTrigger>
                      <TooltipContent>
                          <p>Mira cómo se ve en <span className="font-bold">Escritorio</span></p>
                      </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                      <TooltipTrigger asChild><Button variant={viewport === 'tablet' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewport('tablet')}><Tablet/></Button></TooltipTrigger>
                      <TooltipContent>
                          <p>Comprueba la vista para <span className="font-bold">Tabletas</span></p>
                      </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                      <TooltipTrigger asChild><Button variant={viewport === 'mobile' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewport('mobile')}><Smartphone/></Button></TooltipTrigger>
                      <TooltipContent>
                          <p>Comprueba la vista para <span className="font-bold">Móvil</span></p>
                      </TooltipContent>
                  </Tooltip>
              </div>
            </TooltipProvider>
          </div>
           <div className="flex items-center gap-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => { setIsFileManagerOpen(true); }}>
                                <FileIcon />
                           </Button></TooltipTrigger>
                        <TooltipContent>
                            <p>Abrir Gestor de Archivos</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <ThemeToggle />
                <Button 
                    onClick={() => {
                      if (!templateName || templateName === 'Mi Plantilla Increíble') {
                        setIsEditNameModalOpen(true);
                      } else {
                        handlePublish();
                      }
                    }}
                    disabled={isSaving}
                    className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-[#AD00EC] to-[#1700E6] px-6 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_theme(colors.purple.500/50%)]"
                >
                    <div className="absolute -inset-0.5 -z-10 animate-spin-slow rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    {isSaving ? <RefreshCw className="mr-2 animate-spin"/> : <Rocket className="mr-2"/>}
                    {isSaving ? 'Guardando...' : 'Guardar'}
                </Button>
            </div>
        </header>

         <div id="editor-canvas" className="flex-1 overflow-auto custom-scrollbar relative">
          <div className="p-8">
            <div className={cn("bg-background/80 dark:bg-zinc-900/80 dark:border dark:border-white/10 mx-auto shadow-2xl rounded-lg min-h-[1200px] transition-all duration-300 ease-in-out", viewportClasses[viewport])}>
                 {canvasContent.length === 0 ? (
                   <div className="border-2 border-dashed border-border/30 dark:border-border/30 rounded-lg h-full flex items-center justify-center text-center text-muted-foreground p-4">
                     <p>Haz clic en "Columns" o "Contenedor Flexible" de la izquierda para empezar.</p>
                   </div>
                 ) : (
                  <div className="flex flex-col gap-4">
                      {canvasContent.map((block, index) => renderCanvasBlock(block, index))}
                  </div>
                 )}
            </div>
          </div>
        </div>
      </main>

      <aside className="w-80 border-l border-l-black/10 dark:border-border/20 flex flex-col bg-card/5">
        <Tabs defaultValue="style" className="w-full flex flex-col h-full">
            <header className="h-[61px] border-b border-border/20 flex-shrink-0 p-2 flex items-center">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="style"><PaletteIcon className="mr-2"/>Estilo</TabsTrigger>
                    <TabsTrigger value="layers"><Layers className="mr-2"/>Capas</TabsTrigger>
                </TabsList>
            </header>
            <ScrollArea className="flex-1 custom-scrollbar">
                <TabsContent value="style">
                    <div className="p-4 space-y-6">
                        <StyleEditorHeader />
                        { (selectedElement?.type === 'column') && (
                        <>
                        <BackgroundEditor 
                            selectedElement={selectedElement} 
                            canvasContent={canvasContent} 
                            setCanvasContent={setCanvasContent}
                            onOpenImageModal={handleOpenBgImageModal}
                        />
                            <Separator className="bg-border/20" />
                            <ColumnDistributionEditor 
                                selectedElement={selectedElement}
                                canvasContent={canvasContent}
                                setCanvasContent={setCanvasContent}
                            />
                        </>
                        )}
                        { (selectedElement?.type === 'wrapper') && (
                        <BackgroundEditor 
                            selectedElement={selectedElement} 
                            canvasContent={canvasContent} 
                            setCanvasContent={setCanvasContent}
                            onOpenImageModal={handleOpenBgImageModal}
                        />
                        )}
                        { selectedElement?.type === 'primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'button' && (
                            <ButtonEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                        { selectedElement?.type === 'primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'heading' && (
                            <HeadingEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                         { selectedElement?.type === 'primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'image' && (
                            <ImageEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                        { selectedElement?.type === 'primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'text' && (
                            <TextEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                        { selectedElement?.type === 'primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'emoji-static' && (
                            <StaticEmojiEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                        { selectedElement?.type === 'wrapper-primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'emoji-interactive' && (
                            <InteractiveEmojiEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                        { selectedElement?.type === 'wrapper-primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'heading-interactive' && (
                            <InteractiveHeadingEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                        { selectedElement?.type === 'primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'separator' && (
                            <SeparatorEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                        { selectedElement?.type === 'primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'youtube' && (
                            <YouTubeEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                        { selectedElement?.type === 'primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'timer' && (
                            <TimerEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                         { selectedElement?.type === 'primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'rating' && (
                            <RatingEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                         { selectedElement?.type === 'primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'switch' && (
                            <SwitchEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                         { selectedElement?.type === 'primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'shapes' && (
                            <ShapesEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                         { selectedElement?.type === 'primitive' && getSelectedBlockType(selectedElement, canvasContent) === 'gif' && (
                            <GifEditor selectedElement={selectedElement} canvasContent={canvasContent} setCanvasContent={setCanvasContent} />
                        )}
                        
                        { !selectedElement && (
                            <div className="text-center text-muted-foreground p-4 text-sm">
                                Selecciona un elemento en el lienzo para ver sus opciones de estilo.
                            </div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="layers">
                    <LayerPanel />
                </TabsContent>
            </ScrollArea>
        </Tabs>
      </aside>

      <BackgroundManagerModal
        open={isBgImageModalOpen}
        onOpenChange={setIsBgImageModalOpen}
        onApply={handleApplyBackgroundImage}
        initialValue={
            selectedElement?.type === 'wrapper'
            ? (canvasContent.find(r => r.id === selectedElement.wrapperId) as WrapperBlock | undefined)?.payload.styles.backgroundImage
            : undefined
        }
       />

       <Dialog open={isColumnBlockSelectorOpen} onOpenChange={setIsColumnBlockSelectorOpen}>
        <DialogContent className="sm:max-w-2xl bg-card/80 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><PlusCircle className="text-primary"/>Añadir Bloque a Columna</DialogTitle>
            <DialogDescription>
              Selecciona un bloque de contenido para añadirlo a la columna.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="grid grid-cols-3 gap-4 p-4">
                {columnContentBlocks.map((block) => (
                  <Card 
                    key={block.id} 
                    onClick={() => handleAddBlockToColumn(block.id as StaticPrimitiveBlockType)}
                    className="group bg-card/5 border-black/20 dark:border-border/20 flex flex-col items-center justify-center p-4 aspect-square cursor-pointer transition-all hover:bg-primary/10 hover:border-black/50 dark:hover:border-primary/50 hover:shadow-lg"
                  >
                    <block.icon className="size-8 text-[#00B0F0] transition-colors" />
                    <span className="text-sm font-medium text-center text-foreground/80 mt-2">{block.name}</span>
                  </Card>
                ))}
              </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isWrapperBlockSelectorOpen} onOpenChange={(open) => {
          if(!open) {
            setClickPosition(null);
            setActiveContainer(null);
          }
          setIsWrapperBlockSelectorOpen(open);
      }}>
          <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-sm">
              <DialogHeader>
                  <DialogTitle>¿Qué deseas hacer?</DialogTitle>
                  <DialogDescription>
                      Selecciona una acción para el contenedor flexible.
                  </DialogDescription>
              </DialogHeader>
              <div className="flex gap-4 py-4">
                  <Button 
                      variant="outline" 
                      className="flex-1 h-24 flex-col gap-2"
                      onClick={() => {
                          if (actionTargetWrapperId) {
                              setSelectedElement({ type: 'wrapper', wrapperId: actionTargetWrapperId });
                          }
                          setIsActionSelectorModalOpen(false);
                      }}
                  >
                      <Edit className="size-6 text-primary"/>
                      Editar Contenedor
                  </Button>
                  <Button 
                      variant="outline" 
                      className="flex-1 h-24 flex-col gap-2"
                      onClick={() => {
                           if (actionTargetWrapperId) {
                              setActiveContainer({ id: actionTargetWrapperId, type: 'wrapper' });
                              setIsWrapperBlockSelectorOpen(true);
                           }
                          setIsActionSelectorModalOpen(false);
                      }}
                  >
                      <PlusCircle className="size-6 text-accent" style={{color: 'hsl(var(--accent-light-mode-override))'}}/>
                      Añadir Bloque
                  </Button>
              </div>
          </DialogContent>
      </Dialog>
      
       {/* Initial Name Modal */}
      <Dialog open={isInitialNameModalOpen} onOpenChange={(open) => { if (!open) router.push('/dashboard/templates'); }}>
          <DialogContent className="max-w-3xl bg-card/80 backdrop-blur-sm border-border/20" showCloseButton={false}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8 flex flex-col justify-center">
                      <div className="flex justify-center md:justify-start pb-4">
                          <div className="p-3 bg-primary/10 rounded-full border-2 border-primary/20">
                            <FileSignature className="size-10 text-primary" />
                          </div>
                      </div>
                      <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">¡Inicia tu Obra Maestra!</DialogTitle>
                          <DialogDescription>
                              Dale un nombre y asigna categorías a tu nueva plantilla para empezar a dar vida a tus ideas.
                          </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                          <div>
                              <Label>Nombre de la Plantilla</Label>
                              <Input
                                  value={tempTemplateName}
                                  onChange={(e) => setTempTemplateName(e.target.value)}
                                  placeholder="Ej: Newsletter de Bienvenida"
                                  autoFocus
                                  maxLength={20}
                              />
                          </div>
                      </div>
                  </div>
                  <div className="p-8 bg-black/10 dark:bg-black/20 rounded-r-lg">
                       <h3 className="font-semibold mb-4">Categorías</h3>
                       <ScrollArea className="h-48">
                          <div className="space-y-2">
                              {allCategories.map((category) => (
                                  <div key={category} className="flex items-center space-x-2">
                                      <Checkbox
                                          id={`initial-cat-${category}`}
                                          checked={selectedCategories.includes(category)}
                                          onCheckedChange={(checked) => handleCategoryToggle(category, !!checked)}
                                      />
                                      <label htmlFor={`initial-cat-${category}`} className="text-sm font-medium leading-none">
                                          {category}
                                      </label>
                                  </div>
                              ))}
                          </div>
                       </ScrollArea>
                       <div className="flex gap-2 mt-4">
                          <Input
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                              placeholder="Crear nueva categoría"
                              onKeyDown={(e) => e.key === 'Enter' && handleAddNewCategory()}
                          />
                          <Button onClick={handleAddNewCategory} size="icon" variant="outline">
                              <PlusCircle className="size-4" />
                          </Button>
                      </div>
                  </div>
              </div>
              <DialogFooter className="px-8 pb-8 pt-4 flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <Button
                      type="button"
                      onClick={() => router.push('/dashboard/templates')}
                      className="text-white bg-[#A11C00] hover:bg-[#F00000] w-full sm:w-auto"
                  >
                      Cancelar y Salir
                  </Button>
                  <Button
                      type="button"
                      onClick={handleSaveTemplateName}
                      className="bg-primary text-primary-foreground hover:bg-[#00CB07] hover:text-white w-full sm:w-auto"
                  >
                      Guardar y Empezar a Diseñar
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>


            {/* Confirm Exit Modal */}
      <AlertDialog open={isConfirmExitModalOpen} onOpenChange={setIsConfirmExitModalOpen}>
        <AlertDialogContent className="sm:max-w-lg bg-card/80 backdrop-blur-sm">
          <AlertDialogHeader>
            <div className="flex justify-center pb-4">
              <AlertTriangle className="size-12 text-amber-400" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              ¿Estás seguro de que quieres abandonar el editor?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Los cambios no guardados se perderán en el vacío digital.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground bg-black/10 dark:bg-black/20 px-3 py-2 rounded-lg border border-white/5">
              <div className="flex items-center gap-2">
                <Cloud className="size-4 text-green-400" />
                <span>
                  Último guardado a las {lastSaved ? format(lastSaved, "HH:mm") : "No se ha guardado"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handlePublish();
                  toast({
                    title: "Progreso Guardado",
                    description: "Tus últimos cambios están a salvo.",
                  });
                }}
                className="text-white bg-gradient-to-r from-primary to-accent hover:from-[#00CE07] hover:to-[#A6EE00] hover:text-white"
              >
                Guardar ahora
              </Button>
            </div>
            <Button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full text-lg py-6 bg-[#A11C00] text-white hover:bg-[#F00000]"
            >
              Sí, salir
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <FileManagerModal
        open={isFileManagerOpen}
        onOpenChange={setIsFileManagerOpen}
      />
    </div>
  );
}

export default function CreateTemplatePage() {
    return (
        <Suspense fallback={<Preloader />}>
            <CreatePageContent />
        </Suspense>
    );
}
