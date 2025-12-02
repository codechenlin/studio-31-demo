"use client";

import React, { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Toggle } from '@/components/ui/toggle';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ColorPickerAdvanced } from '@/components/dashboard/color-picker-advanced';
import { useToast } from '@/hooks/use-toast';
import { HexColorPicker } from 'react-colorful';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveTemplateAction, revalidatePath } from './actions';
import { getTemplateById, getAllCategories } from '@/app/dashboard/templates/actions';
import { listFiles, renameFile, deleteFiles, uploadFile, type StorageFile } from './gallery-actions';
import { createClient } from '@/lib/supabase/client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Preloader } from '@/components/common/preloader';
import { LoadingModal } from '@/components/common/loading-modal';
import { FileManagerModal } from '@/components/dashboard/file-manager-modal';

// All the imports from the original page.tsx are now here.
// ... (rest of the component definitions: mainContentBlocks, columnOptions, popularEmojis, etc.)

const mainContentBlocks = [
  { name: "Columns", icon: Columns, id: 'columns' },
  { name: "Contenedor Flexible", icon: Shapes, id: 'wrapper' },
];

const columnContentBlocks = [
  { name: "Titulo", icon: Heading1, id: 'heading' },
  { name: "Texto", icon: Type, id: 'text' },
  { name: "Imagen", icon: ImageIconType, id: 'image' },
  { name: "Botón", icon: Square, id: 'button' },
  { name: "Separador", icon: Minus, id: 'separator' },
  { name: "Video Youtube", icon: Youtube, id: 'youtube' },
  { name: "Contador", icon: Timer, id: 'timer' },
  { name: "Emoji", icon: Smile, id: 'emoji-static' },
  { name: "Estrellas", icon: Star, id: 'rating' },
  { name: "Interruptor", icon: ToggleLeft, id: 'switch' },
  { name: "Formas", icon: Pentagon, id: 'shapes' },
  { name: "GIF", icon: Film, id: 'gif' },
];

const wrapperContentBlocks = [
   { name: "Titulo", icon: Heading1, id: 'heading-interactive' },
   { name: "Emoji Interactivo", icon: Smile, id: 'emoji-interactive' },
];


const columnOptions = [
    { num: 1, icon: () => <div className="w-full h-8 bg-muted rounded-sm border border-border"></div> },
    { num: 2, icon: () => <div className="flex w-full h-8 gap-1"><div className="w-1/2 h-full bg-muted rounded-sm border border-border"></div><div className="w-1/2 h-full bg-muted rounded-sm border border-border"></div></div> },
    { num: 3, icon: () => <div className="flex w-full h-8 gap-1"><div className="w-1/3 h-full bg-muted rounded-sm border border-border"></div><div className="w-1/3 h-full bg-muted rounded-sm border border-border"></div><div className="w-1/3 h-full bg-muted rounded-sm border border-border"></div></div> },
    { num: 4, icon: () => <div className="flex w-full h-8 gap-1"><div className="w-1/4 h-full bg-muted rounded-sm border border-border"></div><div className="w-1/4 h-full bg-muted rounded-sm border border-border"></div><div className="w-1/4 h-full bg-muted rounded-sm border border-border"></div></div> },
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
}


const ColumnDistributionEditor = ({ selectedElement, canvasContent, setCanvasContent }: {
    selectedElement: SelectedElement;
    canvasContent: CanvasBlock[];
    setCanvasContent: (content: CanvasBlock[], recordHistory: boolean) => void;
}) => {
    if (selectedElement?.type !== 'column') return null;

    const row = canvasContent.find(r => r.id === selectedElement.rowId) as ColumnsBlock | undefined;
    if (!row) return null;

    const { columns } = row.payload;
    const columnIndex = columns.findIndex(c => c.id === selectedElement.columnId);
    if(columnIndex === -1) return null;

    const handleTwoColumnChange = (value: number) => {
        const newCanvasContent = canvasContent.map(r => {
            if (r.id === selectedElement.rowId && r.type === 'columns') {
                const newColumns = [...r.payload.columns];
                const clampedValue = Math.max(10, Math.min(90, value));
                newColumns[0] = { ...newColumns[0], width: clampedValue };
                newColumns[1] = { ...newColumns[1], width: 100 - clampedValue };
                return { ...r, payload: { ...r.payload, columns: newColumns } };
            }
            return r;
        });
        setCanvasContent(newCanvasContent as CanvasBlock[], true);
    }
    
    const handleThreeColumnChange = (changedIndex: number, newValue: number) => {
        const newCanvasContent = canvasContent.map(r => {
            if (r.id === selectedElement.rowId && r.type === 'columns') {
                let newColumns = [...r.payload.columns];
                const clampedValue = Math.max(10, Math.min(80, newValue));
            
                const remainingWidth = 100 - clampedValue;
                const otherIndices = [0, 1, 2].filter(i => i !== changedIndex);
            
                newColumns[changedIndex].width = clampedValue;
            
                if (changedIndex === 0) {
                    let col2Width = newColumns[1].width;
                    let col3Width = newColumns[2].width;
                    const totalOtherWidth = col2Width + col3Width;

                    let newCol2Width = (col2Width / totalOtherWidth) * remainingWidth;
                    let newCol3Width = (col3Width / totalOtherWidth) * remainingWidth;
                    
                    if(newCol2Width < 10) {
                        newCol2Width = 10;
                        newCol3Width = remainingWidth - 10;
                    }
                    if(newCol3Width < 10) {
                        newCol3Width = 10;
                        newCol2Width = remainingWidth - 10;
                    }

                    newColumns[1].width = newCol2Width;
                    newColumns[2].width = newCol3Width;
                } else if (changedIndex === 1) {
                    let col3Width = 100 - newColumns[0].width - clampedValue;
                    if (col3Width < 10) {
                        col3Width = 10;
                        newColumns[1].width = 100 - newColumns[0].width - 10;
                    } else {
                         newColumns[1].width = clampedValue;
                    }
                    newColumns[2].width = 100 - newColumns[0].width - newColumns[1].width;
                } else { // changedIndex === 2
                    let col2Width = 100 - newColumns[0].width - clampedValue;
                     if (col2Width < 10) {
                        col2Width = 10;
                        newColumns[2].width = 100 - newColumns[0].width - 10;
                    } else {
                        newColumns[2].width = clampedValue;
                    }
                    newColumns[1].width = 100 - newColumns[0].width - newColumns[2].width;
                }
                return { ...r, payload: { ...r.payload, columns: newColumns } };
            }
            return r;
        });
        setCanvasContent(newCanvasContent as CanvasBlock[], true);
    };

    const handleFourColumnChange = (changedIndex: number, newValue: number) => {
        const newCanvasContent = canvasContent.map(r => {
            if (r.id === selectedElement.rowId && r.type === 'columns') {
                let newColumns = [...r.payload.columns];
                let clampedValue = Math.max(10, Math.min(70, newValue));

                const otherIndices = [0, 1, 2, 3].filter(i => i > changedIndex);
                const fixedIndices = [0, 1, 2, 3].filter(i => i < changedIndex);
                
                const fixedWidth = fixedIndices.reduce((acc, i) => acc + newColumns[i].width, 0);

                const remainingForOthers = 100 - fixedWidth - clampedValue;
                if (remainingForOthers < otherIndices.length * 10) {
                     clampedValue = 100 - fixedWidth - (otherIndices.length * 10);
                }

                newColumns[changedIndex].width = clampedValue;
                
                const remainingWidth = 100 - fixedWidth - clampedValue;
                const totalOtherWidth = otherIndices.reduce((acc, i) => acc + r.payload.columns[i].width, 0);

                otherIndices.forEach(i => {
                    const proportion = r.payload.columns[i].width / totalOtherWidth;
                    newColumns[i].width = remainingWidth * proportion;
                });

                const finalTotalWidth = newColumns.reduce((sum, col) => sum + col.width, 0);
                const roundingError = 100 - finalTotalWidth;
                if (newColumns[3]) {
                    newColumns[3].width += roundingError;
                }
                return { ...r, payload: { ...r.payload, columns: newColumns } };
            }
            return r;
        });
        setCanvasContent(newCanvasContent as CanvasBlock[], true);
    };
    
    if(columns.length === 1) return null;

    if (columns.length === 2) {
        return (
             <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground/80 flex items-center gap-2"><Columns /> Distribución de Columnas</h3>
                 <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Columna 1: {columns[0].width.toFixed(0)}%</span>
                        <span>Columna 2: {columns[1].width.toFixed(0)}%</span>
                    </div>
                     <Slider
                        value={[columns[0].width]}
                        max={90}
                        min={10}
                        step={1}
                        onValueChange={(value) => handleTwoColumnChange(value[0])}
                    />
                 </div>
            </div>
        )
    }
    
    if (columns.length === 3) {
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground/80 flex items-center gap-2">
            <Columns /> Distribución de Columnas
          </h3>
          <div className="space-y-3">
            <Label>Columna 1: {columns[0].width.toFixed(0)}%</Label>
            <Slider
              value={[columns[0].width]}
              min={10}
              max={80}
              step={1}
              onValueChange={(val) => handleThreeColumnChange(0, val[0])}
            />
          </div>
          <div className="space-y-3">
            <Label>Columna 2: {columns[1].width.toFixed(0)}%</Label>
            <Slider
              value={[columns[1].width]}
              min={10}
              max={80}
              step={1}
              onValueChange={(val) => handleThreeColumnChange(1, val[0])}
            />
          </div>
          <div className="space-y-3">
             <Label>Columna 3: {columns[2].width.toFixed(0)}%</Label>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary/50" style={{ width: `${columns[2].width}%` }} />
              </div>
          </div>
        </div>
      );
    }
    
    if (columns.length === 4) {
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground/80 flex items-center gap-2">
            <Columns /> Distribución de Columnas
          </h3>
          {[0, 1, 2].map(i => (
            <div key={i} className="space-y-3">
              <Label>Columna {i + 1}: {columns[i].width.toFixed(0)}%</Label>
              <Slider
                value={[columns[i].width]}
                min={10}
                max={70}
                step={1}
                onValueChange={(val) => handleFourColumnChange(i, val[0])}
              />
            </div>
          ))}
          <div className="space-y-3">
             <Label>Columna 4: {columns[3].width.toFixed(0)}%</Label>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary/50" style={{ width: `${columns[3].width}%` }} />
              </div>
          </div>
        </div>
      );
    }

    return null;
};


const BackgroundEditor = ({ selectedElement, canvasContent, setCanvasContent, onOpenImageModal }: {
  selectedElement: SelectedElement;
  canvasContent: CanvasBlock[];
  setCanvasContent: (content: CanvasBlock[], recordHistory: boolean) => void;
  onOpenImageModal: () => void;
}) => {
  if (!selectedElement || (selectedElement.type !== 'column' && selectedElement.type !== 'wrapper')) return null;

  const getElement = () => {
    if (selectedElement.type === 'column') {
      const row = canvasContent.find(r => r.id === selectedElement.rowId);
      if (row?.type !== 'columns') return null;
      return row?.payload.columns.find(c => c.id === selectedElement.columnId);
    }
    if (selectedElement.type === 'wrapper') {
      const row = canvasContent.find(r => r.id === selectedElement.wrapperId);
      return row?.type === 'wrapper' ? row : null;
    }
    return null;
  }
  
  const element = getElement();
  if (!element) return null;

  const styles = 'payload' in element && 'styles' in element.payload ? element.payload.styles : 'styles' in element ? element.styles : {};
  const { background, borderRadius } = styles || {};
  
  const updateStyle = (key: string, value: any) => {
    let newCanvasContent = [...canvasContent];
    if (selectedElement.type === 'column') {
        newCanvasContent = canvasContent.map(row => {
            if (row.id === selectedElement.rowId && row.type === 'columns') {
                const newColumns = row.payload.columns.map(col => {
                    if (col.id === selectedElement.columnId) {
                        return { ...col, styles: { ...col.styles, [key]: value } };
                    }
                    return col;
                });
                return { ...row, payload: { ...row.payload, columns: newColumns } };
            }
            return row;
        });
    } else if (selectedElement.type === 'wrapper') {
        newCanvasContent = canvasContent.map(row => {
            if (row.id === selectedElement.wrapperId && row.type === 'wrapper') {
                const currentStyles = row.payload.styles || {};
                const newPayload = { ...row.payload, styles: { ...currentStyles, [key]: value } };
                return { ...row, payload: newPayload };
            }
            return row;
        });
    }
    setCanvasContent(newCanvasContent as CanvasBlock[], true);
  };
  
  const setBgType = (type: 'solid' | 'gradient') => {
     updateStyle('background', {
        type,
        color1: background?.color1 || '#A020F0',
        color2: background?.color2 || '#3357FF',
        direction: background?.direction || 'vertical',
     });
  };

  const setColor = (colorProp: 'color1' | 'color2', value: string) => {
      const currentBg = background || { type: 'solid', color1: '#A020F0', direction: 'vertical' };
      updateStyle('background', {...currentBg, [colorProp]: value });
  }
  
  const setDirection = (direction: GradientDirection) => {
      if(background) {
          updateStyle('background', {...background, direction });
      }
  }

  const isWrapper = selectedElement.type === 'wrapper';

  return (
    <>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-foreground/80 flex items-center gap-2"><Paintbrush/>Fondo</h3>
        <Button 
          variant="outline" 
          size="icon" 
          className="size-7 border-[#F00000] text-[#F00000] hover:bg-[#F00000] hover:text-white dark:text-foreground dark:hover:text-white" 
          onClick={()
