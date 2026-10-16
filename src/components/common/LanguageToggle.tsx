import { useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getLanguage, languages, type Locale } from "@/i18n/languages";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/utils";
import { ChevronDownIcon } from "@/icons";

export default function LanguageToggle({
  className = "",
}: {
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language: locale, setLanguage } = useLanguage();
  const currentLang = getLanguage(locale as Locale);
  const CurrentFlag = currentLang.FlagIcon;

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSelect = (langId: Locale) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative inline-block", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-theme-sm font-medium text-gray-700 shadow-theme-xs backdrop-blur-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label="Select language"
      >
        <CurrentFlag className="size-4 shrink-0 overflow-hidden rounded-full" />
        <span className="font-semibold">{currentLang.shortName}</span>
        <ChevronDownIcon
          className={cn(
            "size-3.5 text-gray-500 transition-transform duration-200 dark:text-gray-400",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute inset-e-0 top-full mt-2 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-0.5">
            {languages.map((lang) => {
              const isSelected = locale === lang.id;
              const Flag = lang.FlagIcon;

              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => handleSelect(lang.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-start text-theme-sm font-medium transition-colors",
                    isSelected
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Flag className="size-4 shrink-0 overflow-hidden rounded-full" />
                    <span>{lang.name}</span>
                  </span>
                  {isSelected && (
                    <span className="size-1.5 rounded-full bg-brand-500 dark:bg-brand-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
