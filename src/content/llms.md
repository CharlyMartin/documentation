# React Hook Form

> Performant, flexible and extensible forms for React with easy-to-use validation. These docs describe React Hook Form v7 (the latest stable release); v8 is in beta and its changes are covered in the migration guide.

- Package: [react-hook-form on npm](https://www.npmjs.com/package/react-hook-form)
- Source: [github.com/react-hook-form/react-hook-form](https://github.com/react-hook-form/react-hook-form)
- Schema resolvers (Zod, Yup, Valibot, etc.): [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- Full documentation in a single file: [llms-full.txt](https://react-hook-form.com/llms-full.txt)

Every page below is also available as HTML by dropping the `.md` suffix.

## When to use

Use React Hook Form when building forms in React or React Native that need:

- Validation, either with built-in rules (`required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `validate`) passed to `register`, or with a schema (Zod, Yup, Valibot and others) passed to `useForm({ resolver })` from `@hookform/resolvers`.
- Few re-renders on large or fast-changing forms: native inputs stay uncontrolled and are wired up with `register`.
- Controlled UI-library components (MUI, shadcn/ui, React Select, date pickers), wrapped with `Controller` or `useController`.
- Dynamic lists of fields, added, removed and reordered with `useFieldArray`.
- Multi-step wizards, nested components that share one form through `FormProvider` and `useFormContext`, or forms prefilled from async data through `defaultValues` and `reset`.
- Type-safe form values in TypeScript, inferred from `useForm<FormValues>()` or from a resolver's schema.
- Server-side validation in Next.js and React 19, with errors mapped back to fields with `setError`.

The usual call sequence is `useForm()`, then `register("name")` on each input, `handleSubmit(onSubmit)` on the form, and `formState.errors` to display messages. Start from [Get Started](https://react-hook-form.com/get-started.md), and look up each method's options and return values in the [API Reference](https://react-hook-form.com/docs.md).

## Optional

- [Guides and learning paths](https://react-hook-form.com/guides): Curated paths through the docs by task.
- [DevTools](https://react-hook-form.com/dev-tools): Visual debugging for React Hook Form.
- [Form Builder](https://react-hook-form.com/form-builder): Generate form code with validation.
- [Community Integrations](https://react-hook-form.com/resources/3rd-party-bindings): Community bindings for UI libraries.
