import { forwardRef, useId, useState, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BaseProps = {
  label: string;
  hint?: string;
  className?: string;
};

type InputProps = BaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & { multiline?: false };
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true };
type Props = InputProps | TextareaProps;

const FloatingField = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  (props, ref) => {
    const id = useId();
    const [focused, setFocused] = useState(false);
    const isMultiline = (props as TextareaProps).multiline === true;
    const value = (props.value as string | undefined) ?? "";
    const floated = focused || (typeof value === "string" && value.length > 0);

    const wrapperCls = cn(
      "relative rounded-xl border bg-secondary/40 transition-smooth",
      focused ? "border-primary/60 ring-2 ring-primary/15 bg-secondary/60" : "border-border hover:border-white/15",
      props.className,
    );

    const labelCls = cn(
      "pointer-events-none absolute left-4 transition-all duration-200 ease-out font-mono uppercase tracking-wider",
      floated ? "top-1.5 text-[10px] text-primary/90" : "top-1/2 -translate-y-1/2 text-xs text-muted-foreground",
      isMultiline && (floated ? "top-1.5" : "top-4 translate-y-0"),
    );

    const fieldCls = cn(
      "w-full bg-transparent outline-none text-foreground text-[15px] font-medium",
      "placeholder:text-transparent",
      isMultiline ? "px-4 pt-7 pb-3 resize-none" : "px-4 pt-5 pb-2 h-14",
    );

    return (
      <div>
        <div className={wrapperCls}>
          <label htmlFor={id} className={labelCls}>{props.label}</label>
          {isMultiline ? (
            <textarea
              id={id}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              {...(props as TextareaProps)}
              className={fieldCls}
              onFocus={(e) => { setFocused(true); (props as TextareaProps).onFocus?.(e); }}
              onBlur={(e) => { setFocused(false); (props as TextareaProps).onBlur?.(e); }}
              placeholder={props.label}
            />
          ) : (
            <input
              id={id}
              ref={ref as React.Ref<HTMLInputElement>}
              {...(props as InputProps)}
              className={fieldCls}
              onFocus={(e) => { setFocused(true); (props as InputProps).onFocus?.(e); }}
              onBlur={(e) => { setFocused(false); (props as InputProps).onBlur?.(e); }}
              placeholder={props.label}
            />
          )}
        </div>
        {props.hint && (
          <p className="mt-1.5 px-1 text-[11px] text-muted-foreground font-mono">{props.hint}</p>
        )}
      </div>
    );
  },
);
FloatingField.displayName = "FloatingField";

export default FloatingField;
