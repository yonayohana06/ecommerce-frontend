import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Calendar from "../components/Calendar";
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/palette.css";
import "@fullcalendar/react/themes/classic/theme.css";

export default function CalendarPage() {
  return (
    <div>
      <PageMeta
        title="Calendar | FastShop Admin"
        description="Calendar page for FastShop Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Calendar" />
      <Calendar />
    </div>
  );
}
