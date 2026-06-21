"use client";

import { useEffect, useRef } from "react";

type AutoConfirmSubscriptionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  token: string;
};

export function AutoConfirmSubscriptionForm({
  action,
  token,
}: AutoConfirmSubscriptionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (submittedRef.current) {
      return;
    }

    submittedRef.current = true;
    formRef.current?.requestSubmit();
  }, []);

  return (
    <form action={action} ref={formRef}>
      <input type="hidden" name="token" value={token} />
    </form>
  );
}
