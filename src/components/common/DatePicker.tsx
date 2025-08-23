import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar, ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export const DatePicker = ({
  value,
  onChange,
  placeholder = "Select due date",
  disabled,
  className,
}: {
  value?: string;
  onChange: (date: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    value ? new Date(value) : null
  );
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);

  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLButtonElement>(null);

  const QUICK_OPTIONS = [
    {
      label: "Today",
      getValue: () => new Date(),
      color: "bg-blue-500",
      icon: "🌟",
    },
    {
      label: "Tomorrow",
      getValue: () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date;
      },
      color: "bg-green-500",
      icon: "⭐",
    },
    {
      label: "Next Week",
      getValue: () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
      },
      color: "bg-purple-500",
      icon: "📅",
    },
    {
      label: "Next Month",
      getValue: () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
      },
      color: "bg-orange-500",
      icon: "📊",
    },
  ];

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Helper functions
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const formatDate = (date: Date, format: string = "yyyy-MM-dd") => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    if (format === "yyyy-MM-dd") {
      return `${year}-${month}-${day}`;
    }

    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${year}`;
  };

  const getDayName = (date: Date) => {
    return DAYS[date.getDay()];
  };

  React.useEffect(() => {
    setSelectedDate(value ? new Date(value) : null);
  }, [value]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange(formatDate(date));
    setIsOpen(false);
  };

  const handleQuickSelect = (getValue: () => Date) => {
    const date = getValue();
    handleDateSelect(date);
  };

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(null);
    onChange(undefined);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newMonth;
    });
  };

  const getDateBadge = (date: Date | null) => {
    if (!date) return null;

    if (isToday(date)) {
      return (
        <Badge className="text-xs bg-blue-500 hover:bg-blue-600 animate-pulse">
          Today
        </Badge>
      );
    }
    if (isTomorrow(date)) {
      return (
        <Badge
          variant="secondary"
          className="text-xs bg-green-100 text-green-800 border-green-200"
        >
          Tomorrow
        </Badge>
      );
    }
    if (isPast(date)) {
      return (
        <Badge variant="destructive" className="text-xs animate-pulse">
          Overdue
        </Badge>
      );
    }

    return null;
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return null;

    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";

    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0 && diffDays <= 7) {
      return `In ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }

    return formatDate(date, "display");
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`relative ${className || ""}`}>
      <Button
        ref={inputRef}
        type="button" // CRITICAL FIX: Prevent form submission when used in forms
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full justify-between h-auto min-h-[50px] p-4 group
          hover:border-primary/60 hover:shadow-md transition-all duration-300
          ${!selectedDate ? "text-muted-foreground" : ""}
          ${
            selectedDate
              ? "border-primary/40 bg-gradient-to-r from-primary/5 to-transparent"
              : ""
          }
          ${isOpen ? "ring-2 ring-primary/20 border-primary/60" : ""}
        `}
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          <div
            className={`
            p-2.5 rounded-xl transition-all duration-300
            ${
              selectedDate
                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm"
                : "bg-muted group-hover:bg-muted/80"
            }
          `}
          >
            <Calendar className="h-4 w-4" />
          </div>

          <div className="flex-1 min-w-0">
            {selectedDate ? (
              <div className="space-y-1">
                <div className="font-semibold text-base text-foreground">
                  {formatDisplayDate(selectedDate)}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>
                    {getDayName(selectedDate)},{" "}
                    {formatDate(selectedDate, "display")}
                  </span>
                  {isToday(selectedDate) && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-base font-medium">{placeholder}</div>
            )}
          </div>

          {selectedDate && (
            <div className="flex items-center gap-2">
              {getDateBadge(selectedDate)}
              <Button
                type="button" // CRITICAL FIX: Prevent form submission
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                onClick={clearDate}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="ml-2">
          <ChevronLeft
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-90" : "-rotate-90"
            }`}
          />
        </div>
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-3 animate-in slide-in-from-top-2 duration-200"
        >
          <Card className="shadow-2xl border border-border/50 backdrop-blur-sm bg-background/95 overflow-hidden">
            <CardContent className="p-0">
              {/* Quick Options */}
              <div className="p-5 border-b border-border/30 bg-gradient-to-r from-muted/30 to-transparent">
                <div className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Quick Select
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {QUICK_OPTIONS.map((option) => (
                    <Button
                      key={option.label}
                      type="button" // CRITICAL FIX: Prevent form submission
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickSelect(option.getValue)}
                      className="justify-start gap-2.5 hover:bg-background/80 hover:shadow-sm transition-all duration-200 border border-transparent hover:border-border/30 rounded-lg p-3 h-auto"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${option.color} shadow-sm`}
                        />
                        <span className="text-xs font-medium">
                          {option.label}
                        </span>
                        <span className="text-sm">{option.icon}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div className="p-5">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-5">
                  <Button
                    type="button" // CRITICAL FIX: Prevent form submission
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth("prev")}
                    className="h-9 w-9 hover:bg-muted/80 rounded-full transition-colors duration-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {MONTHS[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </div>

                  <Button
                    type="button" // CRITICAL FIX: Prevent form submission
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth("next")}
                    className="h-9 w-9 hover:bg-muted/80 rounded-full transition-colors duration-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="p-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wide"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    if (!day) {
                      return <div key={index} className="p-2" />;
                    }

                    const isSelected =
                      selectedDate &&
                      day.toDateString() === selectedDate.toDateString();
                    const isCurrentDay = isToday(day);
                    const isPastDay = isPast(day) && !isToday(day);
                    const isHovered =
                      hoveredDate &&
                      day.toDateString() === hoveredDate.toDateString();

                    return (
                      <Button
                        key={day.getTime()}
                        type="button" // CRITICAL FIX: Prevent form submission
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDateSelect(day)}
                        onMouseEnter={() => setHoveredDate(day)}
                        onMouseLeave={() => setHoveredDate(null)}
                        className={`
                          h-10 w-10 p-0 text-sm relative transition-all duration-200 rounded-lg
                          hover:bg-primary/10 hover:text-primary hover:scale-105 hover:shadow-sm
                          ${
                            isSelected
                              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground hover:bg-primary/90 shadow-lg scale-105"
                              : ""
                          }
                          ${
                            isCurrentDay && !isSelected
                              ? "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 font-bold border border-blue-200"
                              : ""
                          }
                          ${
                            isPastDay
                              ? "text-muted-foreground/40 hover:text-muted-foreground/60"
                              : ""
                          }
                          ${
                            isHovered && !isSelected
                              ? "ring-2 ring-primary/20"
                              : ""
                          }
                        `}
                      >
                        {day.getDate()}
                        {isCurrentDay && !isSelected && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pb-4 pt-2 border-t border-border/20 bg-muted/20">
                <div className="text-xs text-muted-foreground text-center">
                  {selectedDate
                    ? `Selected: ${formatDate(selectedDate, "display")}`
                    : "No date selected"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
