
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tag, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryFilterProps {
    allCategories: string[];
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
}

export function CategoryFilter({ allCategories, selectedCategories, setSelectedCategories }: CategoryFilterProps) {
    const handleSelectCategory = (category: string) => {
        setSelectedCategories(
            selectedCategories.includes(category)
                ? selectedCategories.filter(c => c !== category)
                : [...selectedCategories, category]
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Tag className="mr-2"/>
                    Categorías
                    {selectedCategories.length > 0 && ` (${selectedCategories.length})`}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <div className="flex items-center justify-between px-2 py-1.5">
                    <DropdownMenuLabel className="p-0">Filtrar por Categoría</DropdownMenuLabel>
                    {selectedCategories.length > 0 && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCategories([]);
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                {allCategories.length > 0 ? (
                     allCategories.map(category => (
                        <DropdownMenuCheckboxItem
                            key={category}
                            checked={selectedCategories.includes(category)}
                            onSelect={(e) => { e.preventDefault(); handleSelectCategory(category); }}
                        >
                            {category}
                        </DropdownMenuCheckboxItem>
                    ))
                ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">No hay categorías.</div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function CategoryFilterSkeleton() {
    return <Skeleton className="h-10 w-[140px]" />
}
