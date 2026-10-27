import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth";
import Badge from "@/components/ui/badge/Badge";
import { formatDate } from "@/utils";
import {
  CalenderIcon,
  CallIcon,
  DocsIcon,
  EnvelopeIcon,
  LockIcon,
  UserIcon,
} from "@/icons";

export default function UserMetaCard() {
  const { t, i18n } = useTranslation();
  const { user, refreshProfile } = useAuth();
  const dateLocale = i18n.language === "en" ? "en-US" : "id-ID";

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return (
    <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
      {/* Profile Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="size-20 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
          <img
            src="/images/user/owner.png"
            className="size-full object-cover"
            alt={user?.name || "User"}
          />
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">
            {user?.name || "Admin"}
          </h4>
          <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
            <Badge color="primary" size="sm">
              {user?.role ? user.role.toUpperCase() : "ADMIN"}
            </Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="pt-6">
        <h5 className="mb-5 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t("profile.cardTitle", "Informasi Akun")}
        </h5>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {/* 1. Full Name */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-gray-800 dark:bg-white/2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
              <UserIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                {t("profile.info.name", "Nama Lengkap")}
              </p>
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
                {user?.name || "-"}
              </p>
            </div>
          </div>

          {/* 2. Email Address */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-gray-800 dark:bg-white/2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-light-50 text-blue-light-600 dark:bg-blue-light-500/15 dark:text-blue-light-400">
              <EnvelopeIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                {t("profile.info.email", "Alamat Email")}
              </p>
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
                {user?.email || "-"}
              </p>
            </div>
          </div>

          {/* 3. Phone Number */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-gray-800 dark:bg-white/2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400">
              <CallIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                {t("profile.info.phone", "Nomor Telepon")}
              </p>
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
                {user?.phone_number || "-"}
              </p>
            </div>
          </div>

          {/* 4. Role */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-gray-800 dark:bg-white/2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400">
              <LockIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                {t("profile.info.role", "Peran / Hak Akses")}
              </p>
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
                {user?.role ? user.role.toUpperCase() : "ADMIN"}
              </p>
            </div>
          </div>

          {/* 5. User ID */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-gray-800 dark:bg-white/2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <DocsIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                {t("profile.info.id", "ID Administrator")}
              </p>
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
                #{user?.id || "-"}
              </p>
            </div>
          </div>

          {/* 6. Member Since */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-gray-800 dark:bg-white/2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
              <CalenderIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                {t("profile.info.createdAt", "Terdaftar Sejak")}
              </p>
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
                {user?.created_at ? formatDate(user.created_at, dateLocale) : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
