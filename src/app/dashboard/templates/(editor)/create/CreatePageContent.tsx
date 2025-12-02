"use client";

import React, {
  useState,
  useTransition,
  useEffect,
  useRef,
  useCallback,
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

export default function CreatePageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const templateId = params.get("id");

  // Aquí puedes seguir usando tus hooks
  const [state, setState] = useState(null);

  useEffect(() => {
    // lógica de carga inicial
  }, []);

  return (
    <div>
      <h1>Editor de Template</h1>
      <p>ID del template: {templateId}</p>

      {/* Aquí pega el resto de tu JSX y lógica que antes estaba en page.tsx */}
    </div>
  );
}

// 🔹 Constantes que ya tenías
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
