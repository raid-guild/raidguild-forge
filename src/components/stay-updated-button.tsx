"use client";

import { X } from "lucide-react";
import {
  useEffect,
  useId,
  useCallback,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  defaultSubscriberPreferences,
  type SubscriberPreferences,
} from "@/lib/subscribe/preferences";

type StayUpdatedButtonProps = {
  location: string;
  variant?: "primary" | "secondary" | "ghost";
  initialPreferences?: SubscriberPreferences;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

const preferenceLabels = {
  learn: "Educational posts",
  games: "New games and updates",
  marketplace: "Important marketplace activity",
} as const;

export function StayUpdatedButton({
  location,
  variant = "primary",
  initialPreferences,
}: StayUpdatedButtonProps) {
  const formId = useId();
  const startingPreferences = initialPreferences ?? defaultSubscriberPreferences;
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState(() => ({ ...startingPreferences }));
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const closeTimerRef = useRef<number | undefined>(undefined);
  const allSelected = useMemo(
    () => preferences.learn && preferences.games && preferences.marketplace,
    [preferences],
  );

  const closeModal = useCallback(() => {
    setIsVisible(false);
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      setStatus("idle");
      setMessage("");
      setEmail("");
      setPreferences({ ...startingPreferences });
    }, 220);
  }, [startingPreferences]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  function openModal() {
    trackEvent(analyticsEvents.stayUpdatedClick, { location });
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    setIsOpen(true);
    window.requestAnimationFrame(() => setIsVisible(true));
  }

  function toggleAll(checked: boolean) {
    setPreferences({
      learn: checked,
      games: checked,
      marketplace: checked,
    });
    trackEvent(analyticsEvents.subscribePreferenceClick, {
      location,
      preference: "all",
      selected: checked,
    });
  }

  function togglePreference(name: keyof typeof preferenceLabels, checked: boolean) {
    setPreferences((current) => ({
      ...current,
      [name]: checked,
    }));
    trackEvent(analyticsEvents.subscribePreferenceClick, {
      location,
      preference: name,
      selected: checked,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!preferences.learn && !preferences.games && !preferences.marketplace) {
      setStatus("error");
      setMessage("Choose at least one update category.");
      trackEvent(analyticsEvents.subscribeError, {
        location,
        step: "preferences",
      });
      return;
    }

    setStatus("submitting");
    setMessage("");
    trackEvent(analyticsEvents.subscribeSubmit, {
      location,
      learn: preferences.learn,
      games: preferences.games,
      marketplace: preferences.marketplace,
    });

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          preferences,
          source: location,
        }),
      });
      const result = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong.");
      }

      setStatus("success");
      setMessage(result.message ?? "Confirmation email sent.");
      trackEvent(analyticsEvents.subscribeSuccess, {
        location,
        learn: preferences.learn,
        games: preferences.games,
        marketplace: preferences.marketplace,
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
      trackEvent(analyticsEvents.subscribeError, {
        location,
        step: "submit",
      });
    }
  }

  const modal = isOpen ? (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-moloch-800/55 px-4 py-6 backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none sm:py-10 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <div
        className={`my-auto w-full max-w-lg border border-moloch-800/20 bg-scroll-100 shadow-[8px_8px_0_rgba(41,16,10,0.18)] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-[0.97] opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
      >
        <div className="flex items-start justify-between gap-6 border-b border-moloch-800/15 p-5">
          <div>
            <p className="type-label-sm text-moloch-500">RaidGuild Forge</p>
            <h2 id={`${formId}-title`} className="type-heading-md mt-2 text-moloch-800">
              Stay up to date
            </h2>
          </div>
          <button
            type="button"
            className="grid size-10 cursor-pointer place-items-center border border-moloch-800/20 text-moloch-800 transition-colors hover:bg-moloch-800 hover:text-scroll-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={closeModal}
            aria-label="Close subscribe form"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        {status === "success" ? (
          <div className="grid gap-5 p-5" role="status">
            <div className="border border-moloch-800/15 bg-neutral-100 p-5">
              <p className="type-label-sm text-moloch-500">Confirmation sent</p>
              <p className="type-heading-md mt-2 text-moloch-800">
                Check your inbox.
              </p>
              <p className="type-body-md mt-3 text-moloch-800/72">
                We sent a confirmation link to {email}. Open it to finish
                subscribing to RaidGuild Forge updates.
              </p>
            </div>
            <Button type="button" onClick={closeModal}>
              Done
            </Button>
          </div>
        ) : (
          <form className="grid gap-4 p-5" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="type-label-sm text-moloch-800">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="type-body-lg h-14 border border-moloch-800/25 bg-neutral-100 px-3 text-moloch-800 outline-none transition-colors placeholder:text-moloch-800/45 focus:border-moloch-500"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <fieldset className="grid gap-2">
              <legend className="type-label-sm mb-1 text-moloch-800/70">Updates</legend>
              <label className="flex cursor-pointer items-center gap-3 border border-moloch-800/10 bg-scroll-100 px-3 py-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => toggleAll(event.target.checked)}
                  className="size-3.5 cursor-pointer accent-moloch-500"
                />
                <span className="type-body-md text-[0.95rem] leading-6 text-moloch-800/82">
                  All updates
                </span>
              </label>

              {Object.entries(preferenceLabels).map(([name, label]) => (
                <label
                  key={name}
                  className="flex cursor-pointer items-center gap-3 border border-moloch-800/10 bg-scroll-100 px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={preferences[name as keyof typeof preferenceLabels]}
                    onChange={(event) =>
                      togglePreference(
                        name as keyof typeof preferenceLabels,
                        event.target.checked,
                      )
                    }
                    className="size-3.5 cursor-pointer accent-moloch-500"
                  />
                  <span className="type-body-md text-[0.95rem] leading-6 text-moloch-800/82">
                    {label}
                  </span>
                </label>
              ))}
            </fieldset>

            <p className="type-body-md text-[0.95rem] leading-6 text-moloch-800/65">
              We will send a confirmation email before adding you to the list.
            </p>

            {message && status === "error" ? (
              <p className="type-body-md text-moloch-800" role="alert">
                {message}
              </p>
            ) : null}

            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending..." : "Send confirmation"}
            </Button>
          </form>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="inline-flex w-full flex-col items-start gap-2 sm:w-auto">
      <Button
        variant={variant}
        className="w-full sm:w-auto"
        onClick={openModal}
      >
        Stay up to date
      </Button>

      {modal && typeof document !== "undefined"
        ? createPortal(modal, document.body)
        : null}
    </div>
  );
}
