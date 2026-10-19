import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import CheckboxComponents from "../components/CheckboxComponents";
import DefaultInputs from "../components/DefaultInputs";
import DropzoneComponent from "../components/DropZone";
import FileInputExample from "../components/FileInputExample";
import InputGroup from "../components/InputGroup";
import InputStates from "../components/InputStates";
import RadioButtons from "../components/RadioButtons";
import SelectInputs from "../components/SelectInputs";
import TextAreaInput from "../components/TextAreaInput";
import ToggleSwitch from "../components/ToggleSwitch";
import { cn } from "@/utils";

export default function FormElementsPage() {
  return (
    <div>
      <PageMeta
        title="Form Elements | FastShop Admin"
        description="Form Elements page for FastShop Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Form Elements" />
      <div className={cn("grid grid-cols-1 gap-6 xl:grid-cols-2")}>
        <div className={cn("space-y-6")}>
          <DefaultInputs />
          <SelectInputs />
          <TextAreaInput />
          <InputStates />
        </div>
        <div className={cn("space-y-6")}>
          <InputGroup />
          <FileInputExample />
          <CheckboxComponents />
          <RadioButtons />
          <ToggleSwitch />
          <DropzoneComponent />
        </div>
      </div>
    </div>
  );
}
