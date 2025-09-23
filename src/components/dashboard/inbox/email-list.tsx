
"use client";

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, isToday, isThisWeek, isThisYear } from 'date-fns';
import { es } from 'date-fns/locale';

export interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  snippet: string;
  date: Date;
  read: boolean;
}

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
}

export function EmailList({ emails, selectedEmail, onSelectEmail }: EmailListProps) {
  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'p', { locale: es });
    }
    if (isThisWeek(date, { weekStartsOn: 1 })) {
      return format(date, 'E', { locale: es });
    }
    if (isThisYear(date)) {
      return format(date, 'd MMM', { locale: es });
    }
    return format(date, 'dd/MM/yyyy', { locale: es });
  };

  return (
    <ScrollArea className="h-[70vh]">
      <div className="flex flex-col gap-2 pr-4">
        {emails.map((email) => (
          <button
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className={cn(
              "w-full text-left p-4 rounded-lg transition-colors border-2",
              selectedEmail?.id === email.id
                ? "bg-primary/10 border-primary"
                : "bg-card/50 border-transparent hover:bg-muted/50"
            )}
          >
            <div className="flex items-start justify-between">
              <p className={cn("font-semibold truncate", !email.read && "text-foreground")}>{email.from}</p>
              <p className={cn("text-xs shrink-0 pl-2", !email.read ? "text-primary font-bold" : "text-muted-foreground")}>
                {formatDate(email.date)}
              </p>
            </div>
            <p className={cn("text-sm truncate", !email.read && "text-foreground")}>{email.subject}</p>
            <p className="text-xs text-muted-foreground truncate">{email.snippet}</p>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
