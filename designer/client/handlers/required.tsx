import { useState } from "react";
import { withI18n } from "../i18n/i18n";

export const useRequiredInput = () => {
  const [fieldValue, setFieldValue] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleFieldChange(e) {
    const { value } = e.target;
    setHasError(/\s/g.test(value));
    setFieldValue(value);
    console.log("handle field ");
  }

  return { fieldValue, hasError, handleFieldChange };
};
