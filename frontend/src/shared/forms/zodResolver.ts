import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form';
import type { ZodType } from 'zod';

/**
 * Adapts a Zod schema to react-hook-form's `resolver` option.
 * Prefer this over `@hookform/resolvers/zod` so the app does not depend on
 * that package's subpath export (breaks under some TS language hosts).
 */
export function zodResolver<TFieldValues extends FieldValues>(
  schema: ZodType<TFieldValues>,
): Resolver<TFieldValues> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors = {} as FieldErrors<TFieldValues>;
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? 'root');
      if (key in errors) continue;
      Object.assign(errors, {
        [key]: {
          type: issue.code,
          message: issue.message,
        },
      });
    }

    return { values: {}, errors };
  };
}
